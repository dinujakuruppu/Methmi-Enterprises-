import fs from "fs";
import path from "path";
import { canWriteToSupabase, getSupabase, STORAGE_BUCKET } from "./supabase.js";
// Photos go to a public Supabase Storage bucket and the tour/vehicle keeps
// the full public URL. Without credentials they land in ./uploads instead.
export const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "uploads");
let bucketChecked = false;
async function ensureBucket() {
    if (bucketChecked)
        return;
    const supabase = getSupabase();
    if (!supabase)
        return;
    const { error } = await supabase.storage.getBucket(STORAGE_BUCKET);
    if (error) {
        const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
            public: true,
            fileSizeLimit: 5 * 1024 * 1024,
            allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
        });
        // "already exists" means another request won the race.
        if (createError && !/exists/i.test(createError.message)) {
            throw new Error(`Could not create the "${STORAGE_BUCKET}" storage bucket: ${createError.message}`);
        }
    }
    bucketChecked = true;
}
export async function uploadImage(bytes, contentType, folder, filename) {
    const supabase = getSupabase();
    if (supabase && canWriteToSupabase()) {
        await ensureBucket();
        const objectPath = `${folder}/${filename}`;
        const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(objectPath, bytes, {
            contentType,
            upsert: true,
            cacheControl: "31536000",
        });
        if (error) {
            throw new Error(`Upload to Supabase Storage failed: ${error.message}`);
        }
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
        return { path: data.publicUrl, storage: "supabase" };
    }
    // Served back at /api/uploads/<folder>/<file>, which the frontend proxies
    // on its own origin, so the stored path stays relative.
    const dir = path.join(LOCAL_UPLOAD_DIR, folder);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), bytes);
    return { path: `/api/uploads/${folder}/${filename}`, storage: "local" };
}
//# sourceMappingURL=storage.js.map
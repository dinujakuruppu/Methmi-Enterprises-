import { createClient } from "@supabase/supabase-js";
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "site-images";
export function isSupabaseConfigured() {
    return Boolean(SUPABASE_URL && (SERVICE_ROLE_KEY || ANON_KEY));
}
/** The anon key can only read; writes need the service-role key. */
export function canWriteToSupabase() {
    return Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);
}
let cachedClient = null;
export function getSupabase() {
    if (!isSupabaseConfigured())
        return null;
    if (cachedClient)
        return cachedClient;
    cachedClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY || ANON_KEY, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
    return cachedClient;
}
let warned = false;
export function warnNotConfigured(context) {
    if (warned)
        return;
    warned = true;
    console.warn(`[supabase] ${context}: no credentials set, falling back to data/content.json. ` +
        "Fill in .env and restart to use the database.");
}
//# sourceMappingURL=supabase.js.map
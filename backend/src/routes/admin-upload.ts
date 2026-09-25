import { Router } from "express";
import multer from "multer";
import { slugify } from "../lib/slug.js";
import { uploadImage } from "../lib/storage.js";
import { requireAdmin } from "../middleware/require-admin.js";

const router = Router();
router.use(requireAdmin);

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_FOLDERS = new Set(["tours", "vehicles", "general"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES, files: 1 },
});

router.post("/", (req, res) => {
  upload.single("file")(req, res, async (uploadError) => {
    if (uploadError) {
      const tooLarge =
        uploadError instanceof multer.MulterError && uploadError.code === "LIMIT_FILE_SIZE";
      res.status(400).json({
        error: tooLarge ? "Image must be smaller than 5MB." : "Expected multipart/form-data.",
      });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No image file was provided." });
      return;
    }

    const ext = ALLOWED_TYPES[file.mimetype];
    if (!ext) {
      res.status(400).json({ error: "Only JPG, PNG, or WEBP images are supported." });
      return;
    }

    const targetRaw = String(req.body?.target ?? "");
    const slugRaw = String(req.body?.slug ?? "");

    const folder = ALLOWED_FOLDERS.has(targetRaw) ? targetRaw : "general";
    const namePart = slugRaw.trim() ? slugify(slugRaw) : "upload";
    const filename = `${namePart}-${Date.now()}.${ext}`;

    try {
      const result = await uploadImage(file.buffer, file.mimetype, folder, filename);
      res.json({ path: result.path, storage: result.storage });
    } catch (error) {
      console.error("[upload] Failed to store image:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Could not upload the image. Please try again.",
      });
    }
  });
});

export default router;

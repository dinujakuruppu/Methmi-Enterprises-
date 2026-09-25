import fs from "fs";
import path from "path";

/**
 * Returns something safe to hand to next/image. Remote URLs and /api/uploads
 * paths pass through; a local /images path is only used when the file really
 * exists, otherwise we show the fallback instead of a broken image.
 *
 * Server-only — uses fs.
 */
export function resolveImage(imagePath: string | undefined | null, fallback: string): string {
  if (!imagePath) return fallback;

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  if (imagePath.startsWith("/api/uploads/")) {
    return imagePath;
  }

  try {
    const relative = imagePath.replace(/^\/+/, "");
    const absolute = path.join(process.cwd(), "public", relative);
    if (fs.existsSync(absolute)) {
      return imagePath;
    }
  } catch {
    // fall through
  }

  return fallback;
}

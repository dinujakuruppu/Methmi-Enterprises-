"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { UploadCloud, Loader2, AlertTriangle } from "lucide-react";

export const inputClass =
  "w-full rounded-lg border border-ink-900/15 px-3.5 py-2.5 text-sm text-ink-900 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/30";

export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink-800">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-700/70">{hint}</p>}
    </div>
  );
}

interface ImageUploaderProps {
  value: string;
  onChange: (path: string) => void;
  target: "tours" | "vehicles" | "general";
  slug: string;
  fallbackLabel?: string;
}

export function ImageUploader({ value, onChange, target, slug, fallbackLabel }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target", target);
      formData.append("slug", slug || "photo");

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
      } else {
        onChange(data.path);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-sand-100">
          {value ? (
            /^https?:\/\//i.test(value) ? (
              <Image src={value} alt={fallbackLabel || "Preview"} fill className="object-cover" unoptimized />
            ) : (
              // Plain <img> so a fresh upload shows straight away.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt={fallbackLabel || "Preview"} className="h-full w-full object-cover" />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-ink-700/60">
              No photo yet
            </div>
          )}
        </div>

        <div className="flex-1">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-sand-100">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <UploadCloud className="h-4 w-4" aria-hidden="true" />
            )}
            {uploading ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
          <p className="mt-1.5 text-xs text-ink-700/70">JPG, PNG, or WEBP. Max 5MB.</p>
          {error && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

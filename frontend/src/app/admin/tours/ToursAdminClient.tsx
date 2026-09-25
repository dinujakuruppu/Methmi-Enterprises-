"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, AlertTriangle, Loader2 } from "lucide-react";
import type { Tour } from "@/types/tour";
import { slugify } from "@/lib/slug";
import { Field, ImageUploader, inputClass } from "../AdminFormControls";

type FormState = {
  name: string;
  duration: string;
  pickupTime: string;
  startingPrice: string;
  description: string;
  highlights: string;
  included: string;
  image: string;
};

const emptyForm: FormState = {
  name: "",
  duration: "",
  pickupTime: "",
  startingPrice: "",
  description: "",
  highlights: "",
  included: "",
  image: "",
};

function tourToForm(tour: Tour): FormState {
  return {
    name: tour.name,
    duration: tour.duration,
    pickupTime: tour.pickupTime,
    startingPrice: tour.startingPrice,
    description: tour.description,
    highlights: tour.highlights.join("\n"),
    included: tour.included.join("\n"),
    image: tour.image,
  };
}

export default function ToursAdminClient({ initialTours }: { initialTours: Tour[] }) {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Tour | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openAdd() {
    setForm(emptyForm);
    setEditingSlug(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(tour: Tour) {
    setForm(tourToForm(tour));
    setEditingSlug(tour.slug);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Tour name is required.");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      duration: form.duration.trim(),
      pickupTime: form.pickupTime.trim(),
      startingPrice: form.startingPrice.trim(),
      description: form.description.trim(),
      highlights: form.highlights,
      included: form.included,
      image: form.image,
    };

    try {
      const url = editingSlug ? `/api/admin/tours/${editingSlug}` : "/api/admin/tours";
      const method = editingSlug ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSaving(false);
        return;
      }

      const saved: Tour = data.tour;
      setTours((prev) => {
        if (editingSlug) {
          return prev.map((t) => (t.slug === editingSlug ? saved : t));
        }
        return [...prev, saved];
      });

      setShowForm(false);
      setSaving(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/tours/${deleteTarget.slug}`, { method: "DELETE" });
      setTours((prev) => prev.filter((t) => t.slug !== deleteTarget.slug));
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const uploadSlug = editingSlug || slugify(form.name || "tour");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Tours</h1>
          <p className="mt-1 text-sm text-ink-700">
            Edit tour details, starting prices, and photos shown on the public site.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-full bg-palm-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Tour
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
          <div key={tour.slug} className="overflow-hidden rounded-xl2 bg-white shadow-soft">
            <div className="relative h-36 bg-sand-100">
              {tour.image && (
                /^https?:\/\//i.test(tour.image) ? (
                  <Image src={tour.image} alt={tour.name} fill className="object-cover" unoptimized />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tour.image} alt={tour.name} className="h-full w-full object-cover" />
                )
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-ink-900">{tour.name}</h3>
                {tour.startingPrice && (
                  <span className="whitespace-nowrap rounded-full bg-gold-400/20 px-2.5 py-1 text-xs font-bold text-ink-900">
                    {tour.startingPrice}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-ink-700/80">{tour.duration}</p>
              <p className="mt-2 line-clamp-2 text-xs text-ink-700">{tour.description}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openEdit(tour)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink-900/15 py-2 text-xs font-semibold text-ink-700 transition-colors hover:bg-sand-100"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(tour)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-red-200 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {tours.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-ink-700/60">
            No tours yet. Add your first one.
          </p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl2 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink-900">
                {editingSlug ? "Edit Tour" : "Add Tour"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-full p-1.5 text-ink-700 hover:bg-sand-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Tour Name" required>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sigiriya Day Tour"
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Duration">
                  <input
                    className={inputClass}
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="Full Day (10-12 hrs)"
                  />
                </Field>
                <Field label="Pickup Time">
                  <input
                    className={inputClass}
                    value={form.pickupTime}
                    onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
                    placeholder="6:00 AM"
                  />
                </Field>
              </div>

              <Field label="Starting Price" hint="Shown on the tour card, e.g. $65 or LKR 20,000.">
                <input
                  className={inputClass}
                  value={form.startingPrice}
                  onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
                  placeholder="$65"
                />
              </Field>

              <Field label="Description">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Field>

              <Field label="Highlights" hint="One highlight per line.">
                <textarea
                  className={inputClass}
                  rows={4}
                  value={form.highlights}
                  onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                  placeholder={"Climb Sigiriya Rock Fortress\nAncient frescoes and Mirror Wall"}
                />
              </Field>

              <Field label="What's Included" hint="One item per line.">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.included}
                  onChange={(e) => setForm({ ...form, included: e.target.value })}
                  placeholder={"Private air-conditioned transport\nExperienced driver"}
                />
              </Field>

              <Field label="Photo">
                <ImageUploader
                  value={form.image}
                  onChange={(path) => setForm({ ...form, image: path })}
                  target="tours"
                  slug={uploadSlug}
                  fallbackLabel={form.name}
                />
              </Field>

              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-ocean-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {editingSlug ? "Save Changes" : "Add Tour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4">
          <div className="w-full max-w-sm rounded-xl2 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink-900">Delete tour?</h2>
            <p className="mt-2 text-sm text-ink-700">
              &ldquo;{deleteTarget.name}&rdquo; will be permanently removed from the site.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-sand-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

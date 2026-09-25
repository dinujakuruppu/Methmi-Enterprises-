"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, AlertTriangle, Loader2 } from "lucide-react";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";
import { slugify } from "@/lib/slug";
import { Field, ImageUploader, inputClass } from "../AdminFormControls";

const CATEGORIES: VehicleCategory[] = ["Van", "Car", "SUV", "Bus"];

function toCategory(value: string): VehicleCategory {
  return CATEGORIES.find((category) => category === value) ?? "Van";
}

type FormState = {
  name: string;
  category: VehicleCategory;
  seats: string;
  ac: boolean;
  luggageCapacity: string;
  description: string;
  image: string;
  priceColombo: string;
  priceGalle: string;
  priceSigiriya: string;
};

const emptyForm: FormState = {
  name: "",
  category: "Van",
  seats: "",
  ac: true,
  luggageCapacity: "",
  description: "",
  image: "",
  priceColombo: "",
  priceGalle: "",
  priceSigiriya: "",
};

function vehicleToForm(vehicle: Vehicle): FormState {
  return {
    name: vehicle.name,
    category: vehicle.category,
    seats: String(vehicle.seats),
    ac: vehicle.ac,
    luggageCapacity: vehicle.luggageCapacity,
    description: vehicle.description,
    image: vehicle.image,
    priceColombo: vehicle.samplePrices.colombo,
    priceGalle: vehicle.samplePrices.galle,
    priceSigiriya: vehicle.samplePrices.sigiriya,
  };
}

export default function VehiclesAdminClient({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openAdd() {
    setForm(emptyForm);
    setEditingSlug(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(vehicle: Vehicle) {
    setForm(vehicleToForm(vehicle));
    setEditingSlug(vehicle.slug);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Vehicle name is required.");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      category: form.category,
      seats: Number(form.seats) || 0,
      ac: form.ac,
      luggageCapacity: form.luggageCapacity.trim(),
      description: form.description.trim(),
      image: form.image,
      samplePrices: {
        colombo: form.priceColombo.trim(),
        galle: form.priceGalle.trim(),
        sigiriya: form.priceSigiriya.trim(),
      },
    };

    try {
      const url = editingSlug ? `/api/admin/vehicles/${editingSlug}` : "/api/admin/vehicles";
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

      const saved: Vehicle = data.vehicle;
      setVehicles((prev) => {
        if (editingSlug) {
          return prev.map((v) => (v.slug === editingSlug ? saved : v));
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
      await fetch(`/api/admin/vehicles/${deleteTarget.slug}`, { method: "DELETE" });
      setVehicles((prev) => prev.filter((v) => v.slug !== deleteTarget.slug));
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const uploadSlug = editingSlug || slugify(form.name || "vehicle");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Vehicles</h1>
          <p className="mt-1 text-sm text-ink-700">
            Edit fleet specs, sample transfer prices, and photos shown on the public site.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-full bg-ocean-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Vehicle
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <div key={vehicle.slug} className="overflow-hidden rounded-xl2 bg-white shadow-soft">
            <div className="relative h-36 bg-sand-100">
              {vehicle.image && (
                /^https?:\/\//i.test(vehicle.image) ? (
                  <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" unoptimized />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-cover" />
                )
              )}
              <span className="absolute left-3 top-3 rounded-full bg-ocean-700/90 px-2.5 py-1 text-[0.65rem] font-bold text-white">
                {vehicle.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-display text-base font-semibold text-ink-900">{vehicle.name}</h3>
              <p className="mt-1 text-xs text-ink-700/80">
                {vehicle.seats} seats · {vehicle.ac ? "A/C" : "Non-A/C"}
              </p>
              <div className="mt-2 space-y-0.5 text-xs text-ink-700">
                <div className="flex justify-between">
                  <span>Colombo</span>
                  <span className="font-semibold">{vehicle.samplePrices.colombo || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Galle</span>
                  <span className="font-semibold">{vehicle.samplePrices.galle || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sigiriya</span>
                  <span className="font-semibold">{vehicle.samplePrices.sigiriya || "—"}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openEdit(vehicle)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink-900/15 py-2 text-xs font-semibold text-ink-700 transition-colors hover:bg-sand-100"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(vehicle)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-red-200 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-ink-700/60">
            No vehicles yet. Add your first one.
          </p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl2 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink-900">
                {editingSlug ? "Edit Vehicle" : "Add Vehicle"}
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
              <Field label="Vehicle Name" required>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Toyota KDH Van (Standard)"
                  required
                />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Category">
                  <select
                    className={inputClass}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: toCategory(e.target.value) })}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Seats">
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: e.target.value })}
                  />
                </Field>
                <Field label="A/C">
                  <label className="mt-1.5 flex h-[42px] items-center gap-2 rounded-lg border border-ink-900/15 px-3.5 text-sm">
                    <input
                      type="checkbox"
                      checked={form.ac}
                      onChange={(e) => setForm({ ...form, ac: e.target.checked })}
                    />
                    Air-conditioned
                  </label>
                </Field>
              </div>

              <Field label="Luggage Capacity">
                <input
                  className={inputClass}
                  value={form.luggageCapacity}
                  onChange={(e) => setForm({ ...form, luggageCapacity: e.target.value })}
                  placeholder="4–6 large suitcases"
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

              <div>
                <p className="mb-1.5 text-sm font-semibold text-ink-800">
                  Sample Transfer Prices <span className="text-red-600">*</span>
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="To Colombo">
                    <input
                      className={inputClass}
                      value={form.priceColombo}
                      onChange={(e) => setForm({ ...form, priceColombo: e.target.value })}
                      placeholder="$25"
                    />
                  </Field>
                  <Field label="To Galle">
                    <input
                      className={inputClass}
                      value={form.priceGalle}
                      onChange={(e) => setForm({ ...form, priceGalle: e.target.value })}
                      placeholder="$60"
                    />
                  </Field>
                  <Field label="To Sigiriya">
                    <input
                      className={inputClass}
                      value={form.priceSigiriya}
                      onChange={(e) => setForm({ ...form, priceSigiriya: e.target.value })}
                      placeholder="$70"
                    />
                  </Field>
                </div>
              </div>

              <Field label="Photo">
                <ImageUploader
                  value={form.image}
                  onChange={(path) => setForm({ ...form, image: path })}
                  target="vehicles"
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
                  {editingSlug ? "Save Changes" : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4">
          <div className="w-full max-w-sm rounded-xl2 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink-900">Delete vehicle?</h2>
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

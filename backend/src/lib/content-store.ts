import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  TourInsert,
  TourRow,
  VehicleInsert,
  VehicleRow,
} from "../types/database.js";
import type { Tour } from "../types/tour.js";
import type { Vehicle } from "../types/vehicle.js";
import { tours as seedTours } from "../data/tours.js";
import { vehicles as seedVehicles } from "../data/vehicles.js";
import {
  canWriteToSupabase,
  getSupabase,
  isSupabaseConfigured,
  warnNotConfigured,
} from "./supabase.js";
import * as fileStore from "./file-store.js";

// Reads and writes for tours and vehicles. Backed by Postgres; falls back to
// the JSON store when Supabase is unavailable so the site stays up.

function toTour(row: TourRow): Tour {
  return {
    slug: row.slug,
    name: row.name,
    duration: row.duration,
    pickupTime: row.pickup_time,
    description: row.description,
    highlights: row.highlights,
    included: row.included,
    startingPrice: row.starting_price,
    image: row.image,
  };
}

function toTourRow(tour: Tour, sortOrder?: number): TourInsert {
  return {
    slug: tour.slug,
    name: tour.name,
    duration: tour.duration,
    pickup_time: tour.pickupTime,
    description: tour.description,
    highlights: tour.highlights,
    included: tour.included,
    starting_price: tour.startingPrice,
    image: tour.image,
    ...(sortOrder === undefined ? {} : { sort_order: sortOrder }),
  };
}

function toVehicle(row: VehicleRow): Vehicle {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    seats: row.seats,
    ac: row.ac,
    luggageCapacity: row.luggage_capacity,
    description: row.description,
    image: row.image,
    samplePrices: {
      colombo: row.sample_prices.colombo ?? "",
      galle: row.sample_prices.galle ?? "",
      sigiriya: row.sample_prices.sigiriya ?? "",
    },
  };
}

function toVehicleRow(vehicle: Vehicle, sortOrder?: number): VehicleInsert {
  return {
    slug: vehicle.slug,
    name: vehicle.name,
    category: vehicle.category,
    seats: vehicle.seats,
    ac: vehicle.ac,
    luggage_capacity: vehicle.luggageCapacity,
    description: vehicle.description,
    image: vehicle.image,
    sample_prices: vehicle.samplePrices,
    ...(sortOrder === undefined ? {} : { sort_order: sortOrder }),
  };
}

export class ContentStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentStoreError";
  }
}

function readFailed(entity: string, error: unknown): void {
  console.error(
    `[content-store] Read failed for ${entity}, serving the JSON fallback. ` +
      "Has schema.sql been run?",
    error,
  );
}

function writeError(entity: string, error: PostgrestError): ContentStoreError {
  console.error(`[content-store] Write failed for ${entity}:`, error);
  return new ContentStoreError(`Could not save to the database: ${error.message}`);
}

function requireWritableClient(): SupabaseClient<Database> {
  const supabase = getSupabase();
  if (!supabase || !canWriteToSupabase()) {
    throw new ContentStoreError(
      "Supabase is not configured for writes. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in .env and restart the server.",
    );
  }
  return supabase;
}

let seedChecked = false;

// Populates an empty database from src/data. The app_meta flag stops the
// defaults reappearing after an admin deletes everything.
async function ensureSeeded(supabase: SupabaseClient<Database>): Promise<void> {
  if (seedChecked || !canWriteToSupabase()) return;
  seedChecked = true;

  try {
    const { data, error } = await supabase
      .from("app_meta")
      .select("value")
      .eq("key", "content_seeded")
      .maybeSingle();

    if (error) throw error;
    if (data?.value === "true") return;

    await supabase
      .from("tours")
      .upsert(
        seedTours.map((tour, index) => toTourRow(tour, index)),
        { onConflict: "slug" },
      );

    await supabase
      .from("vehicles")
      .upsert(
        seedVehicles.map((vehicle, index) => toVehicleRow(vehicle, index)),
        { onConflict: "slug" },
      );

    await supabase
      .from("app_meta")
      .upsert({ key: "content_seeded", value: "true" }, { onConflict: "key" });

    console.log("[content-store] Seeded the default tours and vehicles.");
  } catch (error) {
    seedChecked = false; // retry on the next request
    console.error("[content-store] Seeding failed:", error);
  }
}

async function nextSortOrder(
  supabase: SupabaseClient<Database>,
  table: "tours" | "vehicles",
): Promise<number> {
  const { data } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.sort_order ?? -1) + 1;
}

// ---- Tours ------------------------------------------------------------------

export async function getAllTours(): Promise<Tour[]> {
  const supabase = getSupabase();
  if (!supabase) {
    warnNotConfigured("Reading tours from disk");
    return fileStore.getAllTours();
  }

  try {
    await ensureSeeded(supabase);
    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data.map(toTour);
  } catch (error) {
    readFailed("tours", error);
    return fileStore.getAllTours();
  }
}

export async function getTourBySlug(slug: string): Promise<Tour | undefined> {
  const supabase = getSupabase();
  if (!supabase) return fileStore.getTourBySlug(slug);

  try {
    const { data, error } = await supabase.from("tours").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ? toTour(data) : undefined;
  } catch (error) {
    readFailed("tours", error);
    return fileStore.getTourBySlug(slug);
  }
}

/** Pass `originalSlug` when the slug is being renamed. */
export async function saveTour(tour: Tour, originalSlug?: string): Promise<Tour> {
  if (!isSupabaseConfigured()) {
    warnNotConfigured("Saving a tour to disk");
    return fileStore.saveTour(tour, originalSlug);
  }

  const supabase = requireWritableClient();

  if (originalSlug) {
    const { error } = await supabase
      .from("tours")
      .update(toTourRow(tour))
      .eq("slug", originalSlug);
    if (error) throw writeError("tours", error);
    return tour;
  }

  const sortOrder = await nextSortOrder(supabase, "tours");
  const { error } = await supabase.from("tours").insert(toTourRow(tour, sortOrder));
  if (error) throw writeError("tours", error);
  return tour;
}

export async function deleteTourBySlug(slug: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    fileStore.deleteTourBySlug(slug);
    return;
  }

  const supabase = requireWritableClient();
  const { error } = await supabase.from("tours").delete().eq("slug", slug);
  if (error) throw writeError("tours", error);
}

// ---- Vehicles ---------------------------------------------------------------

export async function getAllVehicles(): Promise<Vehicle[]> {
  const supabase = getSupabase();
  if (!supabase) {
    warnNotConfigured("Reading vehicles from disk");
    return fileStore.getAllVehicles();
  }

  try {
    await ensureSeeded(supabase);
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data.map(toVehicle);
  } catch (error) {
    readFailed("vehicles", error);
    return fileStore.getAllVehicles();
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
  const supabase = getSupabase();
  if (!supabase) return fileStore.getVehicleBySlug(slug);

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? toVehicle(data) : undefined;
  } catch (error) {
    readFailed("vehicles", error);
    return fileStore.getVehicleBySlug(slug);
  }
}

export async function saveVehicle(vehicle: Vehicle, originalSlug?: string): Promise<Vehicle> {
  if (!isSupabaseConfigured()) {
    warnNotConfigured("Saving a vehicle to disk");
    return fileStore.saveVehicle(vehicle, originalSlug);
  }

  const supabase = requireWritableClient();

  if (originalSlug) {
    const { error } = await supabase
      .from("vehicles")
      .update(toVehicleRow(vehicle))
      .eq("slug", originalSlug);
    if (error) throw writeError("vehicles", error);
    return vehicle;
  }

  const sortOrder = await nextSortOrder(supabase, "vehicles");
  const { error } = await supabase.from("vehicles").insert(toVehicleRow(vehicle, sortOrder));
  if (error) throw writeError("vehicles", error);
  return vehicle;
}

export async function deleteVehicleBySlug(slug: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    fileStore.deleteVehicleBySlug(slug);
    return;
  }

  const supabase = requireWritableClient();
  const { error } = await supabase.from("vehicles").delete().eq("slug", slug);
  if (error) throw writeError("vehicles", error);
}

export async function resetToSeedData(): Promise<{ tours: Tour[]; vehicles: Vehicle[] }> {
  if (!isSupabaseConfigured()) {
    return fileStore.resetToSeedData();
  }

  const supabase = requireWritableClient();

  const deleteTours = await supabase.from("tours").delete().neq("slug", "");
  if (deleteTours.error) throw writeError("tours", deleteTours.error);

  const deleteVehicles = await supabase.from("vehicles").delete().neq("slug", "");
  if (deleteVehicles.error) throw writeError("vehicles", deleteVehicles.error);

  const insertTours = await supabase
    .from("tours")
    .insert(seedTours.map((tour, index) => toTourRow(tour, index)));
  if (insertTours.error) throw writeError("tours", insertTours.error);

  const insertVehicles = await supabase
    .from("vehicles")
    .insert(seedVehicles.map((vehicle, index) => toVehicleRow(vehicle, index)));
  if (insertVehicles.error) throw writeError("vehicles", insertVehicles.error);

  await supabase
    .from("app_meta")
    .upsert({ key: "content_seeded", value: "true" }, { onConflict: "key" });

  return { tours: seedTours, vehicles: seedVehicles };
}

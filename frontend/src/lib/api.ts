import type { Tour } from "@/types/tour";
import type { Vehicle } from "@/types/vehicle";
import { tours as fallbackTours } from "@/data/tours";
import { vehicles as fallbackVehicles } from "@/data/vehicles";

// Content comes from the Express API in ../backend. Server components call it
// over BACKEND_URL; browser code uses the relative /api/* proxy.

export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

async function fetchFromApi<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      // Edited from /admin, so never serve a cached copy.
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(
      `[api] GET ${path} failed, using bundled fallback data. Is the backend running?`,
      error,
    );
    return null;
  }
}

export async function getAllTours(): Promise<Tour[]> {
  const data = await fetchFromApi<{ tours: Tour[] }>("/api/tours");
  return data?.tours ?? fallbackTours;
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const data = await fetchFromApi<{ vehicles: Vehicle[] }>("/api/vehicles");
  return data?.vehicles ?? fallbackVehicles;
}

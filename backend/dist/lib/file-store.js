import fs from "fs";
import path from "path";
import { tours as seedTours } from "../data/tours.js";
import { vehicles as seedVehicles } from "../data/vehicles.js";
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "content.json");
export function seedContent() {
    return { tours: seedTours, vehicles: seedVehicles };
}
function readFromDisk() {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed.tours) || !Array.isArray(parsed.vehicles))
            return null;
        return { tours: parsed.tours, vehicles: parsed.vehicles };
    }
    catch {
        return null;
    }
}
function writeToDisk(content) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), "utf-8");
    }
    catch (error) {
        // Read-only filesystem. Configure Supabase for durable persistence.
        console.error("[file-store] Could not write data/content.json:", error);
    }
}
function loadContent() {
    const existing = readFromDisk();
    if (existing)
        return existing;
    const seeded = seedContent();
    writeToDisk(seeded);
    return seeded;
}
// ---- Tours ----------------------------------------------------------------
export function getAllTours() {
    return loadContent().tours;
}
export function getTourBySlug(slug) {
    return loadContent().tours.find((t) => t.slug === slug);
}
/** Pass `originalSlug` when the slug is being renamed. */
export function saveTour(tour, originalSlug) {
    const content = loadContent();
    const key = originalSlug ?? tour.slug;
    const idx = content.tours.findIndex((t) => t.slug === key);
    if (idx === -1) {
        content.tours.push(tour);
    }
    else {
        content.tours[idx] = tour;
    }
    writeToDisk(content);
    return tour;
}
export function deleteTourBySlug(slug) {
    const content = loadContent();
    content.tours = content.tours.filter((t) => t.slug !== slug);
    writeToDisk(content);
}
// ---- Vehicles ---------------------------------------------------------------
export function getAllVehicles() {
    return loadContent().vehicles;
}
export function getVehicleBySlug(slug) {
    return loadContent().vehicles.find((v) => v.slug === slug);
}
export function saveVehicle(vehicle, originalSlug) {
    const content = loadContent();
    const key = originalSlug ?? vehicle.slug;
    const idx = content.vehicles.findIndex((v) => v.slug === key);
    if (idx === -1) {
        content.vehicles.push(vehicle);
    }
    else {
        content.vehicles[idx] = vehicle;
    }
    writeToDisk(content);
    return vehicle;
}
export function deleteVehicleBySlug(slug) {
    const content = loadContent();
    content.vehicles = content.vehicles.filter((v) => v.slug !== slug);
    writeToDisk(content);
}
export function resetToSeedData() {
    const seeded = seedContent();
    writeToDisk(seeded);
    return seeded;
}
//# sourceMappingURL=file-store.js.map
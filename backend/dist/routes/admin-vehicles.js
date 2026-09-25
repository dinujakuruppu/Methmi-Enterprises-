import { Router } from "express";
import { ContentStoreError, deleteVehicleBySlug, getAllVehicles, saveVehicle, } from "../lib/content-store.js";
import { slugify, uniqueSlug } from "../lib/slug.js";
import { firstErrorMessage, vehicleInputSchema } from "../lib/validation.js";
import { requireAdmin } from "../middleware/require-admin.js";
const router = Router();
router.use(requireAdmin);
router.get("/", async (_req, res) => {
    res.json({ vehicles: await getAllVehicles() });
});
router.post("/", async (req, res) => {
    const parsed = vehicleInputSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: firstErrorMessage(parsed.error) });
        return;
    }
    const input = parsed.data;
    const existing = await getAllVehicles();
    const vehicle = {
        slug: uniqueSlug(input.name, existing.map((v) => v.slug)),
        name: input.name,
        category: input.category,
        seats: input.seats ?? 0,
        ac: input.ac,
        luggageCapacity: input.luggageCapacity ?? "",
        description: input.description ?? "",
        image: input.image ?? "",
        samplePrices: {
            colombo: input.samplePrices.colombo ?? "",
            galle: input.samplePrices.galle ?? "",
            sigiriya: input.samplePrices.sigiriya ?? "",
        },
    };
    try {
        await saveVehicle(vehicle);
    }
    catch (error) {
        if (error instanceof ContentStoreError) {
            res.status(500).json({ error: error.message });
            return;
        }
        throw error;
    }
    res.status(201).json({ vehicle });
});
router.put("/:slug", async (req, res) => {
    const { slug } = req.params;
    const parsed = vehicleInputSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: firstErrorMessage(parsed.error) });
        return;
    }
    const input = parsed.data;
    const existing = await getAllVehicles();
    const current = existing.find((v) => v.slug === slug);
    if (!current) {
        res.status(404).json({ error: "Vehicle not found." });
        return;
    }
    const requestedSlug = input.slug?.trim() ? slugify(input.slug) : slug;
    if (requestedSlug !== slug && existing.some((v) => v.slug === requestedSlug)) {
        res.status(400).json({ error: "That slug is already used by another vehicle." });
        return;
    }
    const vehicle = {
        slug: requestedSlug,
        name: input.name,
        category: input.category,
        seats: input.seats ?? current.seats,
        ac: input.ac,
        luggageCapacity: input.luggageCapacity ?? current.luggageCapacity,
        description: input.description ?? current.description,
        image: input.image ?? current.image,
        samplePrices: {
            colombo: input.samplePrices.colombo ?? current.samplePrices.colombo,
            galle: input.samplePrices.galle ?? current.samplePrices.galle,
            sigiriya: input.samplePrices.sigiriya ?? current.samplePrices.sigiriya,
        },
    };
    try {
        await saveVehicle(vehicle, slug);
    }
    catch (error) {
        if (error instanceof ContentStoreError) {
            res.status(500).json({ error: error.message });
            return;
        }
        throw error;
    }
    res.json({ vehicle });
});
router.delete("/:slug", async (req, res) => {
    try {
        await deleteVehicleBySlug(req.params.slug);
    }
    catch (error) {
        if (error instanceof ContentStoreError) {
            res.status(500).json({ error: error.message });
            return;
        }
        throw error;
    }
    res.json({ ok: true });
});
export default router;
//# sourceMappingURL=admin-vehicles.js.map
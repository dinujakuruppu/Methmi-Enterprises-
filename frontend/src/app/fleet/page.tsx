import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import VehicleCard from "@/components/VehicleCard";
import { getAllVehicles } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Fleet",
  description:
    "Explore the Methmi Enterprises fleet — vans, cars, an SUV, and a coach bus — all air-conditioned and available for Colombo airport transfers and Sri Lanka tours.",
};

export default async function FleetPage() {
  const vehicles = await getAllVehicles();

  return (
    <section className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="Our Fleet"
        title="Comfortable vehicles for every journey"
        description="7 well-maintained vehicles — from private sedans to a full-size coach — ready for airport transfers and multi-day tours across Sri Lanka."
      />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.slug} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}

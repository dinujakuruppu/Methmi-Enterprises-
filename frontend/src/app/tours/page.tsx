import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/TourCard";
import { getAllTours } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sri Lanka Tours",
  description:
    "Full-day Sri Lanka tour packages to Sigiriya, Galle, Kandy, and beyond — private, air-conditioned transport with an experienced driver.",
};

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <section className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="Sri Lanka Tours"
        title="Discover Sri Lanka with a trusted driver"
        description="Private, full-day tours to Sri Lanka's most iconic destinations — comfortable transport, flexible pickup, and 20+ years of local knowledge."
      />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
          <TourCard key={tour.slug} tour={tour} />
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { MapPinned, CarFront, ArrowRight } from "lucide-react";
import AdminNav from "./AdminNav";
import { getAllTours, getAllVehicles } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const tours = await getAllTours();
  const vehicles = await getAllVehicles();

  return (
    <>
      <AdminNav />
      <main className="container-page py-10">
        <h1 className="font-display text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-700">
          Manage the tours, vehicles, prices, and photos shown on the public site.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            href="/admin/tours"
            className="group flex flex-col justify-between rounded-xl2 bg-white p-6 shadow-soft transition-shadow hover:shadow-card"
          >
            <div>
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-palm-500/10 text-palm-600">
                <MapPinned className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-ink-900">Tours</h2>
              <p className="mt-1 text-sm text-ink-700">
                {tours.length} tour{tours.length === 1 ? "" : "s"} — edit names, descriptions,
                prices, highlights, and photos.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700">
              Manage tours{" "}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>

          <Link
            href="/admin/vehicles"
            className="group flex flex-col justify-between rounded-xl2 bg-white p-6 shadow-soft transition-shadow hover:shadow-card"
          >
            <div>
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ocean-500/10 text-ocean-700">
                <CarFront className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-ink-900">Vehicles</h2>
              <p className="mt-1 text-sm text-ink-700">
                {vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"} — edit specs,
                sample transfer prices, and photos.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700">
              Manage vehicles{" "}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>
      </main>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Users, Luggage, Snowflake } from "lucide-react";
import { Vehicle } from "@/types/vehicle";
import { getVehicleWhatsAppLink } from "@/lib/whatsapp";
import { resolveImage } from "@/lib/image-fallback";
import WhatsAppButton from "./WhatsAppButton";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const imageSrc = resolveImage(vehicle.image, PLACEHOLDER_IMAGE);
  const isPlaceholder = imageSrc === PLACEHOLDER_IMAGE;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl2 bg-white shadow-soft transition-shadow hover:shadow-card">
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={imageSrc}
          alt={
            isPlaceholder
              ? `[VEHICLE IMAGE] — placeholder photo for ${vehicle.name}, replace with a real photo`
              : vehicle.name
          }
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ocean-700/90 px-3 py-1 text-xs font-bold text-white">
          {vehicle.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ink-900">{vehicle.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          {vehicle.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-ink-800">
          <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-3 py-1">
            <Users className="h-3.5 w-3.5" aria-hidden="true" /> {vehicle.seats} seats
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-3 py-1">
            <Snowflake className="h-3.5 w-3.5" aria-hidden="true" />{" "}
            {vehicle.ac ? "Air-conditioned" : "Non-AC"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-3 py-1">
            <Luggage className="h-3.5 w-3.5" aria-hidden="true" /> {vehicle.luggageCapacity}
          </span>
        </div>

        <div className="mt-5 rounded-xl bg-ocean-50 p-4 text-sm">
          <p className="mb-2 font-bold text-ocean-800">
            Example transfer prices from CMB Airport
          </p>
          <ul className="space-y-1 text-ink-800">
            <li className="flex justify-between">
              <span>To Colombo</span>
              <span className="font-semibold">{vehicle.samplePrices.colombo}</span>
            </li>
            <li className="flex justify-between">
              <span>To Galle</span>
              <span className="font-semibold">{vehicle.samplePrices.galle}</span>
            </li>
            <li className="flex justify-between">
              <span>To Sigiriya</span>
              <span className="font-semibold">{vehicle.samplePrices.sigiriya}</span>
            </li>
          </ul>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/booking-enquiry?vehicle=${encodeURIComponent(vehicle.name)}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-ocean-600 px-4 py-2.5 text-sm font-semibold text-ocean-700 hover:bg-ocean-50"
          >
            Enquire Now
          </Link>
          <WhatsAppButton
            href={getVehicleWhatsAppLink(vehicle.name)}
            size="sm"
            className="flex-1"
            analyticsContext={`vehicle_card_${vehicle.slug}`}
          />
        </div>
      </div>
    </article>
  );
}

// Temporary photo. Replace files in public/images/vehicles/ with real car photos later.
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=900&auto=format&fit=crop";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Check } from "lucide-react";
import { Tour } from "@/types/tour";
import { getTourWhatsAppLink } from "@/lib/whatsapp";
import { resolveImage } from "@/lib/image-fallback";
import WhatsAppButton from "./WhatsAppButton";

interface TourCardProps {
  tour: Tour;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=900&auto=format&fit=crop";

export default function TourCard({ tour }: TourCardProps) {
  const imageSrc = resolveImage(tour.image, PLACEHOLDER_IMAGE);
  const isPlaceholder = imageSrc === PLACEHOLDER_IMAGE;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl2 bg-white shadow-soft transition-shadow hover:shadow-card">
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={imageSrc}
          alt={
            isPlaceholder
              ? `[TOUR IMAGE] — placeholder photo for ${tour.name}, replace with a real photo`
              : tour.name
          }
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-palm-600/90 px-3 py-1 text-xs font-bold text-white">
          {tour.duration}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ink-900">{tour.name}</h3>

        <div className="mt-2 flex flex-wrap gap-4 text-xs font-semibold text-ink-700">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Pickup: {tour.pickupTime}
          </span>
        </div>
 
        <p className="mt-3 text-sm leading-relaxed text-ink-700">{tour.description}</p>

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ocean-700">
            Highlights
          </p>
          <ul className="space-y-1 text-sm text-ink-800">
            {tour.highlights.slice(0, 3).map((h) => (
              <li key={h} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-palm-500" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-sand-100 px-4 py-3">
          <span className="text-xs font-semibold text-ink-700">Starting from</span>
          <span className="text-lg font-bold text-ocean-700">{tour.startingPrice}</span>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/booking-enquiry?tour=${encodeURIComponent(tour.name)}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-ocean-600 px-4 py-2.5 text-sm font-semibold text-ocean-700 hover:bg-ocean-50"
          >
            Enquire About This Tour
          </Link>
          <WhatsAppButton
            href={getTourWhatsAppLink(tour.name)}
            size="sm"
            className="flex-1"
            analyticsContext={`tour_card_${tour.slug}`}
          />
        </div>
      </div>
    </article>
  );
}

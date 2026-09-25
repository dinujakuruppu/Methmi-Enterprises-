import Image from "next/image";
import { ShieldCheck, Clock, Award } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import Link from "next/link";
import TrustBadge from "./TrustBadge";
import JourneyPath from "./JourneyPath";
import { getDefaultWhatsAppLink } from "@/lib/whatsapp";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ocean-50 via-sand-100 to-sand-100">
      <div className="container-page grid grid-cols-1 items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <p className="mb-4 inline-flex items-center rounded-full bg-ocean-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ocean-700">
            Since 2006 · Katunayaka, Sri Lanka
          </p>
          <h1 className="text-4xl font-bold leading-[1.1] text-ink-900 sm:text-5xl lg:text-6xl">
            Methmi Enterprises —{" "}
            <span className="text-ocean-600">Airport Transfers</span> &amp;{" "}
            <span className="text-palm-600">Tours</span> Since 2006
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700">
            Over 20 years of safe, reliable airport transfers and Sri Lankan
            tours. Professional drivers, comfortable vehicles, and a
            family-run business you can trust — available 24/7.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton
              href={getDefaultWhatsAppLink()}
              size="lg"
              analyticsContext="hero_primary"
            />
            <Link
              href="/booking-enquiry"
              className="inline-flex items-center justify-center rounded-full border-2 border-ocean-600 px-7 py-4 text-lg font-semibold text-ocean-700 transition-all hover:-translate-y-0.5 hover:bg-ocean-50"
            >
              Send a Booking Enquiry
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <TrustBadge icon={Award} label="20+ Years" sublabel="Experience" />
            <TrustBadge icon={ShieldCheck} label="Licensed" sublabel="Drivers" />
            <TrustBadge icon={Clock} label="24/7" sublabel="Service" />
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl2 shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?q=80&w=1200&auto=format&fit=crop"
              alt="[VEHICLE IMAGE] — placeholder airport transfer vehicle photo, replace with a real Methmi Enterprises vehicle image"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 left-1/2 hidden w-[110%] -translate-x-1/2 text-ocean-300 sm:block">
            <JourneyPath />
          </div>
        </div>
      </div>
    </section>
  );
}

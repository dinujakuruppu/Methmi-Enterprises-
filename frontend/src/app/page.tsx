import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ShieldCheck,
  Clock,
  Users,
  MessageSquareText,
  CarFront,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import VehicleCard from "@/components/VehicleCard";
import TourCard from "@/components/TourCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getAllVehicles, getAllTours } from "@/lib/api";
import { getDefaultWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Methmi Enterprises - CMB Airport Transfer Since 2006",
  description:
    "Safe, reliable Colombo (CMB) airport transfers and Sri Lanka tours since 2006. Family-run, licensed drivers, 24/7 service. Book on WhatsApp today.",
};

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Safe & Reliable",
    description:
      "20+ years of on-time, careful driving with well-maintained vehicles you can depend on.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Early flight or a late arrival — our team is available around the clock for your transfer.",
  },
  {
    icon: Users,
    title: "Family-Run Business",
    description:
      "A personal, trustworthy service built on two decades of relationships with our guests.",
  },
  {
    icon: MessageSquareText,
    title: "Easy Booking",
    description:
      "Message us directly on WhatsApp or send a quick enquiry — no complicated booking systems.",
  },
];

const bookingSteps = [
  {
    title: "Reach out",
    description: "Message us on WhatsApp or send a booking enquiry with your travel details.",
  },
  {
    title: "We confirm",
    description: "Our team confirms your vehicle, price, and pickup details directly with you.",
  },
  {
    title: "We drive, you relax",
    description: "Your driver meets you on arrival, and you're on your way — safely and on time.",
  },
];

export default async function HomePage() {
  const vehicles = await getAllVehicles();
  const tours = await getAllTours();

  return (
    <>
      <Hero />

      {/* About / Company Introduction */}
      <section className="container-page py-16 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl2 shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1100&auto=format&fit=crop"
              alt="[VEHICLE IMAGE] — placeholder photo, replace with a real Methmi Enterprises photo"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="About Methmi Enterprises"
              title="Two decades of safe, on-time airport transfers"
            />
            <p className="mt-5 text-base leading-relaxed text-ink-700">
              Founded in 2006 as a sole proprietorship, Methmi Enterprises has
              grown into a trusted, family-run airport transfer and tour
              business based in Katunayaka. For over 20 years, we've helped
              international travellers arrive safely and explore Sri Lanka
              with confidence.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-ocean-700 hover:text-ocean-800"
            >
              Read our full story <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Built on trust, safety, and reliability"
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="rounded-xl2 bg-sand-100 p-6 text-center transition-transform hover:-translate-y-1"
              >
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ocean-600 text-white">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="container-page py-16 sm:py-24">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Our Fleet"
            title="A vehicle for every journey"
            description="From private sedans to a full-size coach — comfortable, air-conditioned vehicles for every group size."
          />
          <Link
            href="/fleet"
            className="inline-flex shrink-0 items-center gap-2 font-semibold text-ocean-700 hover:text-ocean-800"
          >
            View full fleet <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.slice(0, 3).map((vehicle) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* Featured Tours */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Sri Lanka Tours"
              title="Explore the island with a trusted driver"
              description="Full-day tours to Sri Lanka's most iconic destinations, with private, air-conditioned transport."
            />
            <Link
              href="/tours"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-ocean-700 hover:text-ocean-800"
            >
              View all tours <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.slice(0, 3).map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* How Booking Works */}
      <section className="container-page py-16 sm:py-24">
        <SectionHeading
          eyebrow="How Booking Works"
          title="Three simple steps to your ride"
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {bookingSteps.map((step, i) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ocean-600 text-xl font-bold text-white">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking / WhatsApp / Contact CTA */}
      <section className="bg-ocean-700 py-16 text-white sm:py-20">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <CarFront className="h-10 w-10 text-gold-400" aria-hidden="true" />
          <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
            Ready to book your safe airport transfer or Sri Lanka tour?
          </h2>
          <p className="max-w-xl text-ocean-100">
            Message us on WhatsApp for the fastest response, or send a
            booking enquiry and our team will confirm your trip.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton
              href={getDefaultWhatsAppLink()}
              size="lg"
              analyticsContext="homepage_cta"
            />
            <Link
              href="/booking-enquiry"
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-4 text-lg font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              Send a Booking Enquiry
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-ocean-100">
            <CheckCircle2 className="h-4 w-4 text-gold-400" aria-hidden="true" />
            {siteConfig.location} · Serving international tourists since {siteConfig.foundedYear}
          </div>
        </div>
      </section>
    </>
  );
}

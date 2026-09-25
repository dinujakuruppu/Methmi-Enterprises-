import Image from "next/image";
import type { Metadata } from "next";
import { ShieldCheck, Heart, Users, Compass } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Methmi Enterprises was founded in 2006 as a family-run airport transfer and tour business in Katunayaka, Sri Lanka — 20+ years of safe, on-time service.",
};

const sections = [
  {
    icon: Compass,
    title: "Our Story",
    body: "Methmi Enterprises was founded in 2006 as a sole proprietorship in Katunayaka, close to Bandaranaike International Airport. What began as a small, personal transfer service has grown into a trusted name for international tourists arriving in Sri Lanka.",
  },
  {
    icon: ShieldCheck,
    title: "20+ Years of Experience",
    body: "For over two decades, we've focused on one thing: getting our guests to their destination safely and on time. That consistency has built the trust our business is known for today.",
  },
  {
    icon: Users,
    title: "Family-Run Business",
    body: "Methmi Enterprises remains a family-run operation based in Katunayaka. That means every booking is handled with the same personal care we've offered since day one.",
  },
  {
    icon: Heart,
    title: "Safety, Reliability & Sri Lankan Hospitality",
    body: "From the moment you land to the moment you reach your destination, our drivers are committed to professional, safe service — paired with the warmth of Sri Lankan hospitality.",
  },
];

export default function AboutPage() {
  return (
    <section className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="About Us"
        title="Founded in 2006. Family-run. Built on trust."
        align="center"
        className="mx-auto"
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ocean-600 text-white">
                  <section.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-ink-900">{section.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                    {section.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-xl2 shadow-card mx-auto">
            <Image
              src="/images/owner/owner.jpeg"
              alt="[OWNER PHOTO] — placeholder image, replace with a real photo of the owner/founder"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-center text-xs text-ink-700">
                     FOUNDER: DANANJA MAHESH 
          </p>
        </div>
      </div>

      <div className="mt-16 rounded-xl2 bg-ocean-700 p-8 text-center text-white sm:p-12">
        <p className="text-lg font-medium sm:text-xl">
          &ldquo;Founded in 2006 as a sole proprietorship. 20 years of safe,
          on-time service. Family-run business based in Katunayaka.&rdquo;
        </p>
        <p className="mt-4 text-sm text-ocean-100">
          — {siteConfig.businessName}
        </p>
      </div>
    </section>
  );
}

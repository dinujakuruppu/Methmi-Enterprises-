"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Plane } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ocean-800 bg-ink-900 text-sand-100">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
              <img
                src="/images/brand/logo.jpeg"
                alt={`${siteConfig.businessName} logo`}
                className="h-full w-full object-contain"
              />
            </span>
            {siteConfig.businessName}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-sand-200">
            {siteConfig.tagline}. A family-run business proudly serving
            international tourists from {siteConfig.location}.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-palm-300">
            Explore
          </h3>
          <ul className="space-y-2 text-sm text-sand-200">
            <li><Link href="/fleet" className="hover:text-white">Fleet</Link></li>
            <li><Link href="/tours" className="hover:text-white">Tours</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/booking-enquiry" className="hover:text-white">Booking Enquiry</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-palm-300">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-sand-200">
            <li>
              <a
                href={`tel:${siteConfig.phone}`}
                onClick={() => trackEvent("phone_click", { context: "footer" })}
                className="flex items-center gap-2 hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                onClick={() => trackEvent("email_click", { context: "footer" })}
                className="flex items-center gap-2 hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {siteConfig.location}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-palm-300">
            Trust & Safety
          </h3>
          <ul className="space-y-2 text-sm text-sand-200">
            <li>20+ Years of Experience</li>
            <li>Licensed Drivers</li>
            <li>24/7 Availability</li>
            <li>Family-Run Business</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-sand-200 sm:flex-row">
          <p>© {year} {siteConfig.businessName}. All rights reserved.</p>
          <p>Katunayaka, Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}

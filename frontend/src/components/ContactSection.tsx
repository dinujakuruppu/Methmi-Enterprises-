"use client";

import { Phone, Mail, MapPin, Navigation } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getDefaultWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import WhatsAppButton from "./WhatsAppButton";

export default function ContactSection() {
  const mapSrc = siteConfig.googleMapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${siteConfig.googleMapsApiKey}&q=${encodeURIComponent(
        siteConfig.mapEmbedQuery
      )}`
    : `https://www.google.com/maps?q=${encodeURIComponent(
        siteConfig.mapEmbedQuery
      )}&output=embed`;

  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    siteConfig.mapEmbedQuery
  )}`;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <a
          href={getDefaultWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-xl2 bg-white p-5 shadow-soft transition-shadow hover:shadow-card"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-palm-50 text-palm-600">
            <Phone className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink-900">Chat on WhatsApp</p>
            <p className="text-sm text-ink-700">Fastest way to reach us, 24/7</p>
          </div>
        </a>

        <a
          href={`tel:${siteConfig.phone}`}
          onClick={() => trackEvent("phone_click", { context: "contact_page" })}
          className="flex items-center gap-4 rounded-xl2 bg-white p-5 shadow-soft transition-shadow hover:shadow-card"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ocean-50 text-ocean-600">
            <Phone className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink-900">Call Us</p>
            <p className="text-sm text-ink-700">{siteConfig.phone}</p>
          </div>
        </a>

        <a
          href={`mailto:${siteConfig.email}`}
          onClick={() => trackEvent("email_click", { context: "contact_page" })}
          className="flex items-center gap-4 rounded-xl2 bg-white p-5 shadow-soft transition-shadow hover:shadow-card"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ocean-50 text-ocean-600">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink-900">Email Us</p>
            <p className="text-sm text-ink-700">{siteConfig.email}</p>
          </div>
        </a>

        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-xl2 bg-white p-5 shadow-soft transition-shadow hover:shadow-card"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-600">
            <Navigation className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink-900">Get Directions</p>
            <p className="text-sm text-ink-700">{siteConfig.location}</p>
          </div>
        </a>

        <div className="pt-2">
          <WhatsAppButton href={getDefaultWhatsAppLink()} analyticsContext="contact_page" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl2 shadow-soft">
        <div className="flex items-center gap-2 bg-white px-5 py-3 text-sm font-semibold text-ink-800">
          <MapPin className="h-4 w-4 text-ocean-600" aria-hidden="true" />
          Our location in {siteConfig.location}
        </div>
        <iframe
          title="Methmi Enterprises location map"
          src={mapSrc}
          className="h-80 w-full border-0 sm:h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

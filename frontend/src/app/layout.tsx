import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Methmi Enterprises - CMB Airport Transfer Since 2006",
    template: "%s | Methmi Enterprises",
  },
  description:
    "Methmi Enterprises has provided safe, reliable Colombo (CMB) airport transfers and Sri Lanka tours since 2006. Family-run, licensed drivers, 24/7 service.",
  keywords: [
    "Colombo Airport Transfer",
    "CMB Airport Taxi",
    "Sri Lanka Airport Transfer",
    "Katunayaka Airport Transfer",
    "Sri Lanka Tours",
    "Airport Pickup Sri Lanka",
    "Colombo Airport to Galle",
    "Colombo Airport to Sigiriya",
  ],
  openGraph: {
    title: "Methmi Enterprises - CMB Airport Transfer Since 2006",
    description:
      "Safe, reliable Colombo (CMB) airport transfers and Sri Lanka tours since 2006.",
    url: siteConfig.siteUrl,
    siteName: siteConfig.businessName,
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/general/og-cover.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Methmi Enterprises - CMB Airport Transfer Since 2006",
    description:
      "Safe, reliable Colombo (CMB) airport transfers and Sri Lanka tours since 2006.",
    images: ["/images/general/og-cover.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: siteConfig.siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.businessName,
    description:
      "Airport transfer and Sri Lanka tour operator based in Katunayaka, serving international tourists since 2006.",
    url: siteConfig.siteUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Katunayaka",
      addressCountry: "LK",
    },
    areaServed: "LK",
    foundingDate: "2006",
    additionalType: "https://schema.org/TransportationService",
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-card"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}

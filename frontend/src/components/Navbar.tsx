"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { getDefaultWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppButton from "./WhatsAppButton";
import { siteConfig } from "@/lib/site-config";

const links = [
  { href: "/", label: "Home" },
  { href: "/fleet", label: "Fleet" },
  { href: "/tours", label: "Tours" },
  { href: "/about", label: "About Us" },
  { href: "/booking-enquiry", label: "Booking Enquiry" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ocean-100 bg-white/95 backdrop-blur">
      <nav
        className="container-page flex h-16 items-center justify-between sm:h-20"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold text-ocean-700 sm:text-xl"
          onClick={() => setOpen(false)}
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
            <Image
              src="/images/brand/logo.jpeg"
              alt={`${siteConfig.businessName} logo`}
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </span>
          {siteConfig.businessName}
        </Link>

        {/* Desktop menu */}
        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold text-ink-800 transition-colors hover:text-ocean-600",
                    active && "text-ocean-700"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <WhatsAppButton
            href={getDefaultWhatsAppLink()}
            size="sm"
            analyticsContext="navbar"
          />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-800 lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden transition-[max-height] duration-300 ease-in-out lg:hidden",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <ul className="container-page flex flex-col gap-1 pb-5">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-800 hover:bg-sand-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2">
            <WhatsAppButton
              href={getDefaultWhatsAppLink()}
              className="w-full"
              analyticsContext="mobile_menu"
            />
          </li>
        </ul>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, LayoutDashboard, CarFront, MapPinned, ExternalLink } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tours", label: "Tours", icon: MapPinned },
  { href: "/admin/vehicles", label: "Vehicles", icon: CarFront },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <header className="border-b border-ink-900/10 bg-white">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg font-bold text-ocean-700">
            Methmi Admin
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const active =
                link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-ocean-600 text-white"
                      : "text-ink-700 hover:bg-sand-100"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ocean-700"
          >
            View site <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-sand-100 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </div>
    </header>
  );
}

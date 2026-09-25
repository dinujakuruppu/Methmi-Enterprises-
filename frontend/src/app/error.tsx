"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { getDefaultWhatsAppLink } from "@/lib/whatsapp";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="h-12 w-12 text-gold-500" aria-hidden="true" />
      <h1 className="mt-4 text-3xl font-bold text-ink-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-ink-700">
        We couldn't load this page. Please try again, or reach us directly on
        WhatsApp.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-full bg-ocean-600 px-6 py-3 font-semibold text-white hover:bg-ocean-700"
        >
          Try again
        </button>
        <a
          href={getDefaultWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border-2 border-ocean-600 px-6 py-3 font-semibold text-ocean-700 hover:bg-ocean-50"
        >
          Contact on WhatsApp
        </a>
      </div>
    </section>
  );
}

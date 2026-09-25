import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Compass className="h-12 w-12 text-ocean-500" aria-hidden="true" />
      <h1 className="mt-4 text-3xl font-bold text-ink-900">Page not found</h1>
      <p className="mt-2 max-w-md text-ink-700">
        The page you're looking for doesn't exist or may have moved. Let's
        get you back on track.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-ocean-600 px-6 py-3 font-semibold text-white hover:bg-ocean-700"
      >
        Back to Homepage
      </Link>
    </section>
  );
}

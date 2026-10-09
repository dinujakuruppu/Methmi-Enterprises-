"use client";

import { useEffect } from "react";

export default function ToursAdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Tours page error:", error);
  }, [error]);

  return (
    <main className="container-page py-20 text-center">
      <h1 className="text-2xl font-bold text-red-600">
        Unable to Load Tours
      </h1>

      <p className="mt-4 text-gray-600">
        Something went wrong while loading tours.
        Please try again.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"
      >
        Try Again
      </button>
    </main>
  );
}
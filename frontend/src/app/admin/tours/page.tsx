import type { Metadata } from "next";
import Link from "next/link";

import AdminNav from "../AdminNav";
import ToursAdminClient from "./ToursAdminClient";

import {
  getAdminToursPage,
} from "@/lib/server/admin-tours";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Manage Tours | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ToursAdminPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const requestedPage = Number(params.page ?? "1");

  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage > 0
      ? Math.min(requestedPage, 10000)
      : 1;

  const {
    tours,
    total,
    totalPages,
  } = await getAdminToursPage(page);

  return (
    <>
      <AdminNav />

      <main className="container-page py-10">
        <ToursAdminClient
          key={page}
          initialTours={tours}
        />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink-700">
            Total Tours: {total}
          </p>

          {totalPages > 1 && (
            <nav
              aria-label="Tours pagination"
              className="flex items-center gap-3"
            >
              {page > 1 && (
                <Link
                  href={`/admin/tours?page=${page - 1}`}
                  className="rounded-lg border px-4 py-2"
                >
                  Previous
                </Link>
              )}

              <span className="text-sm">
                Page {page} of {totalPages}
              </span>

              {page < totalPages && (
                <Link
                  href={`/admin/tours?page=${page + 1}`}
                  className="rounded-lg border px-4 py-2"
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </div>
      </main>
    </>
  );
}
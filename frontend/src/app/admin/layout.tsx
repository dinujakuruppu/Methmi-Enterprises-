import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Methmi Enterprises",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-sand-100">{children}</div>;
}

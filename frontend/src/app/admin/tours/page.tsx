import AdminNav from "../AdminNav";
import { getAllTours } from "@/lib/api";
import ToursAdminClient from "./ToursAdminClient";

export const dynamic = "force-dynamic";

export default async function ToursAdminPage() {
  const tours = await getAllTours();

  return (
    <>
      <AdminNav />
      <main className="container-page py-10">
        <ToursAdminClient initialTours={tours} />
      </main>
    </>
  );
}

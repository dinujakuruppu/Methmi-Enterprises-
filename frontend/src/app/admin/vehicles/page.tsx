import AdminNav from "../AdminNav";
import { getAllVehicles } from "@/lib/api";
import VehiclesAdminClient from "./VehiclesAdminClient";

export const dynamic = "force-dynamic";

export default async function VehiclesAdminPage() {
  const vehicles = await getAllVehicles();

  return (
    <>
      <AdminNav />
      <main className="container-page py-10">
        <VehiclesAdminClient initialVehicles={vehicles} />
      </main>
    </>
  );
}

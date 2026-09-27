import type { Tour } from "@/types/tour";
import type { Vehicle } from "@/types/vehicle";
export const BACKEND_URL=process.env.BACKEND_URL||"http://localhost:4000";
async function get<T>(p:string):Promise<T>{ const r=await fetch(`${BACKEND_URL}${p}`,{cache:"no-store",headers:{Accept:"application/json"}}); if(!r.ok) throw new Error(`Backend request failed: ${r.status}`); return r.json(); }
export async function getAllTours(){ return (await get<{tours:Tour[]}>("/api/tours")).tours; }
export async function getAllVehicles(){ return (await get<{vehicles:Vehicle[]}>("/api/vehicles")).vehicles; }

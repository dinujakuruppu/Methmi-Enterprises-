import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TourInsert, TourRow, VehicleInsert, VehicleRow } from "../types/database.js";
import type { Tour } from "../types/tour.js";
import type { Vehicle } from "../types/vehicle.js";
import { getSupabase } from "./supabase.js";

export class ContentStoreError extends Error { constructor(m:string){ super(m); this.name="ContentStoreError"; } }
function db(): SupabaseClient<Database> {
  const s=getSupabase();
  if(!s) throw new ContentStoreError("Database is not configured.");
  return s;
}
const toTour=(r:TourRow):Tour=>({slug:r.slug,name:r.name,duration:r.duration,pickupTime:r.pickup_time,description:r.description,highlights:r.highlights,included:r.included,startingPrice:r.starting_price,image:r.image});
const toVehicle=(r:VehicleRow):Vehicle=>({slug:r.slug,name:r.name,category:r.category,seats:r.seats,ac:r.ac,luggageCapacity:r.luggage_capacity,description:r.description,image:r.image,samplePrices:{colombo:r.sample_prices.colombo??"",galle:r.sample_prices.galle??"",sigiriya:r.sample_prices.sigiriya??""}});
const tourRow=(t:Tour,sort_order?:number):TourInsert=>({slug:t.slug,name:t.name,duration:t.duration,pickup_time:t.pickupTime,description:t.description,highlights:t.highlights,included:t.included,starting_price:t.startingPrice,image:t.image,...(sort_order===undefined?{}:{sort_order})});
const vehicleRow=(v:Vehicle,sort_order?:number):VehicleInsert=>({slug:v.slug,name:v.name,category:v.category,seats:v.seats,ac:v.ac,luggage_capacity:v.luggageCapacity,description:v.description,image:v.image,sample_prices:v.samplePrices,...(sort_order===undefined?{}:{sort_order})});

async function next(table:"tours"|"vehicles"){ const {data,error}=await db().from(table).select("sort_order").order("sort_order",{ascending:false}).limit(1).maybeSingle(); if(error) throw new ContentStoreError("Database operation failed."); return (data?.sort_order??-1)+1; }
export async function getAllTours(){ const {data,error}=await db().from("tours").select("*").order("sort_order",{ascending:true}); if(error) throw new ContentStoreError("Database operation failed."); return data.map(toTour); }
export async function getTourBySlug(slug:string){ const {data,error}=await db().from("tours").select("*").eq("slug",slug).maybeSingle(); if(error) throw new ContentStoreError("Database operation failed."); return data?toTour(data):undefined; }
export async function saveTour(t:Tour,originalSlug?:string){ const s=db(); if(originalSlug){ const {data,error}=await s.from("tours").update(tourRow(t)).eq("slug",originalSlug).select("id").maybeSingle(); if(error) throw new ContentStoreError("Database operation failed."); if(!data) throw new ContentStoreError("Tour not found."); return t;} const {error}=await s.from("tours").insert(tourRow(t,await next("tours"))); if(error) throw new ContentStoreError("Database operation failed."); return t; }
export async function deleteTourBySlug(slug:string){ const {data,error}=await db().from("tours").delete().eq("slug",slug).select("id"); if(error) throw new ContentStoreError("Database operation failed."); return Boolean(data?.length); }

export async function getAllVehicles(){ const {data,error}=await db().from("vehicles").select("*").order("sort_order",{ascending:true}); if(error) throw new ContentStoreError("Database operation failed."); return data.map(toVehicle); }
export async function getVehicleBySlug(slug:string){ const {data,error}=await db().from("vehicles").select("*").eq("slug",slug).maybeSingle(); if(error) throw new ContentStoreError("Database operation failed."); return data?toVehicle(data):undefined; }
export async function saveVehicle(v:Vehicle,originalSlug?:string){ const s=db(); if(originalSlug){ const {data,error}=await s.from("vehicles").update(vehicleRow(v)).eq("slug",originalSlug).select("id").maybeSingle(); if(error) throw new ContentStoreError("Database operation failed."); if(!data) throw new ContentStoreError("Vehicle not found."); return v;} const {error}=await s.from("vehicles").insert(vehicleRow(v,await next("vehicles"))); if(error) throw new ContentStoreError("Database operation failed."); return v; }
export async function deleteVehicleBySlug(slug:string){ const {data,error}=await db().from("vehicles").delete().eq("slug",slug).select("id"); if(error) throw new ContentStoreError("Database operation failed."); return Boolean(data?.length); }

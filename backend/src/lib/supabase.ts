import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.js";

const SUPABASE_URL = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "site-images";

export function isSupabaseConfigured(){ return Boolean(SUPABASE_URL && SERVICE_ROLE_KEY); }
let client: SupabaseClient<Database> | null = null;
export function getSupabase(){
  if(!isSupabaseConfigured()) return null;
  if(!client) client=createClient<Database>(SUPABASE_URL,SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
  return client;
}
export function canWriteToSupabase(){ return isSupabaseConfigured(); }

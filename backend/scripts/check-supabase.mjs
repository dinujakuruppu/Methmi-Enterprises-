#!/usr/bin/env node
// npm run check:supabase
// Checks that .env points at a working project and schema.sql has been run.
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// This script is run from the backend workspace, so its `.env` is the source
// of truth for the Supabase project being checked.
const envPath = path.join(process.cwd(), ".env");
if (!fs.existsSync(envPath)) {
  console.error("✗ backend/.env not found. Copy backend/.env.example to backend/.env first.");
  process.exit(1);
}

// Load the small subset of dotenv syntax needed by this standalone script
// without depending on the application's configuration loader.
const env = {};
for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
  const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
  if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = env.SUPABASE_STORAGE_BUCKET || "site-images";

if (!url || !serviceKey) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY are empty in backend/.env.");
  console.error("  Supabase Dashboard → Settings → API → copy the Project URL and the service_role key.");
  process.exit(1);
}

console.log(`→ Project: ${url}`);

// Use the service-role key because the check must validate every required
// table, independently of the row-level-security rules used by the app.
const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let failed = false;

// These tables are created by backend/schema.sql and are required at startup.
for (const table of ["tours", "vehicles", "booking_enquiries", "app_meta"]) {
  // Not `head: true` — a HEAD against a missing table returns an empty body,
  // so there is no error and no count, and the check silently passes.
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact" })
    .limit(1);

  if (error) {
    failed = true;
    console.error(`✗ table "${table}": ${error.message}`);
  } else if (count === null) {
    failed = true;
    console.error(`✗ table "${table}": no row count returned — the table is missing.`);
  } else {
    console.log(`✓ table "${table}" — ${count} row${count === 1 ? "" : "s"}`);
  }
}

// Storage is optional at first setup: admin uploads create the bucket on demand.
const { error: bucketError } = await supabase.storage.getBucket(bucket);
if (bucketError) {
  console.warn(`! bucket "${bucket}" not found — it will be created on the first admin upload.`);
} else {
  console.log(`✓ storage bucket "${bucket}"`);
}

if (failed) {
  console.error("\n✗ Some tables are missing. Open the Supabase SQL Editor and run backend/schema.sql.");
  process.exit(1);
}

console.log("\n✓ Supabase is connected and ready. Run `npm run dev` from the repo root.");

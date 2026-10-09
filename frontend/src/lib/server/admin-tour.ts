import "server-only";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  isSessionTokenValid,
} from "@/lib/admin-auth";

import type { Tour } from "@/types/tour";

export const ADMIN_TOURS_PAGE_SIZE = 12;

type TourRow = {
  slug: string;
  name: string;
  duration: string;
  pickup_time: string;
  description: string;
  highlights: string[];
  included: string[];
  starting_price: string;
  image: string;
};

function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase server configuration is missing."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Requires adaptation to the project's real session format.
export async function requireAuthorizedAdmin() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    ADMIN_SESSION_COOKIE
  )?.value;

  if (!(await isSessionTokenValid(token))) {
    redirect("/admin/login");
  }

  // IMPORTANT:
  // Do not use token.split(".")[1] to obtain a user ID.
  // The existing authentication module must securely
  // verify the session and return the authenticated user ID.
  //
  // Replace this placeholder with that verified user ID.
  const userId = ""; // REPLACE using existing auth module.

  if (!userId) {
    redirect("/admin/login");
  }

  const supabase = getSupabaseAdminClient();

  const {
    data: userData,
    error: userError,
  } = await supabase.auth.admin.getUserById(userId);

  if (userError || !userData.user?.email) {
    redirect("/admin/login");
  }

  const {
    data: admin,
    error: adminError,
  } = await supabase
    .from("admins")
    .select("email")
    .eq("email", userData.user.email.toLowerCase())
    .maybeSingle();

  if (adminError) {
    throw new Error("Unable to verify admin access.");
  }

  if (!admin) {
    redirect("/admin/login");
  }

  return supabase;
}

// Read tours directly from Supabase on the server.
export async function getAdminToursPage(page: number) {
  const supabase = await requireAuthorizedAdmin();

  const offset = (page - 1) * ADMIN_TOURS_PAGE_SIZE;

  const { data, count, error } = await supabase
    .from("tours")
    .select(
      `slug,
       name,
       duration,
       pickup_time,
       description,
       highlights,
       included,
       starting_price,
       image`,
      { count: "exact" }
    )
    .order("sort_order", { ascending: true })
    .order("slug", { ascending: true })
    .range(
      offset,
      offset + ADMIN_TOURS_PAGE_SIZE - 1
    );

  if (error) {
    console.error(
      "Admin tours query failed:",
      error.code
    );

    throw new Error("Unable to load tours.");
  }

  const rows = (data ?? []) as TourRow[];

  const tours: Tour[] = rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    duration: row.duration,
    pickupTime: row.pickup_time,
    description: row.description,
    highlights: row.highlights,
    included: row.included,
    startingPrice: row.starting_price,
    image: row.image,
  }));

  const total = count ?? 0;

  return {
    tours,
    total,
    totalPages: Math.max(
      1,
      Math.ceil(total / ADMIN_TOURS_PAGE_SIZE)
    ),
  };
}
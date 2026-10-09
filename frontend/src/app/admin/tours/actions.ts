"use server";

import { revalidatePath } from "next/cache";

import {
  requireAuthorizedAdmin,
} from "@/lib/server/admin-tours";

export async function revalidateAfterTourChange() {
  // Verify the authenticated administrator.
  await requireAuthorizedAdmin();

  // Admin pages
  revalidatePath("/admin/tours");
  revalidatePath("/admin");

  // Public pages displaying tour data
  revalidatePath("/tours");
  revalidatePath("/");
}
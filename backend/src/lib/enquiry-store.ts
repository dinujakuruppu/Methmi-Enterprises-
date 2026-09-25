import type { BookingEnquiryInput } from "./validation.js";
import { getSupabase, canWriteToSupabase } from "./supabase.js";

// Enquiries are stored as well as emailed, so nothing is lost if the email
// bounces or is not configured. Browse them in the Supabase Table Editor.

export interface SaveEnquiryResult {
  saved: boolean;
  id?: string;
  reason?: "not_configured" | "insert_failed";
}

export async function saveBookingEnquiry(
  data: BookingEnquiryInput,
  meta: { emailSent: boolean; ip?: string | null; userAgent?: string | null },
): Promise<SaveEnquiryResult> {
  const supabase = getSupabase();

  if (!supabase || !canWriteToSupabase()) {
    console.warn("[enquiry-store] Supabase not configured — the enquiry was not stored.");
    return { saved: false, reason: "not_configured" };
  }

  try {
    const { data: inserted, error } = await supabase
      .from("booking_enquiries")
      .insert({
        full_name: data.fullName,
        email: data.email,
        whatsapp_number: data.whatsappNumber,
        country: data.country,
        flight_number: data.flightNumber || null,
        arrival_date: data.arrivalDate,
        arrival_time: data.arrivalTime,
        pickup_location: data.pickupLocation,
        drop_location: data.dropLocation,
        vehicle_type: data.vehicleType,
        message: data.message || null,
        email_sent: meta.emailSent,
        source_ip: meta.ip || null,
        user_agent: meta.userAgent || null,
      })
      .select("id")
      .single();

    if (error) throw error;
    return { saved: true, id: inserted?.id };
  } catch (error) {
    console.error("[enquiry-store] Failed to store booking enquiry:", error);
    return { saved: false, reason: "insert_failed" };
  }
}

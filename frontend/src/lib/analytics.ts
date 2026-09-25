"use client";

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: {
      (command: "event", eventName: string, params?: GtagParams): void;
      (command: "config", measurementId: string, params?: GtagParams): void;
      (command: "js", date: Date): void;
    };
  }
}

/** Fires a GA4 event. No-ops when there's no Measurement ID. */
export function trackEvent(
  eventName:
    | "whatsapp_click"
    | "booking_form_submit"
    | "tour_enquiry"
    | "vehicle_enquiry"
    | "phone_click"
    | "email_click",
  params?: GtagParams
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", eventName, params || {});
}

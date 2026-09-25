import { siteConfig } from "./site-config";

/** Builds a wa.me link with a pre-filled message. Use this everywhere. */
function buildWhatsAppLink(message: string): string {
  const number = siteConfig.whatsappNumber.replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function getDefaultWhatsAppLink(): string {
  return buildWhatsAppLink(
    "Hi Methmi Enterprises, I would like to enquire about an airport transfer / tour."
  );
}

export function getTransferWhatsAppLink(params: {
  date?: string;
  flightNumber?: string;
  pickupLocation?: string;
  dropLocation?: string;
}): string {
  const { date, flightNumber, pickupLocation, dropLocation } = params;
  const message = `Hi Methmi Enterprises, I need airport pickup on ${date || "[date]"}. My flight number is ${flightNumber || "[flight number]"}. Pickup location: ${pickupLocation || "[location]"}. Drop location: ${dropLocation || "[location]"}.`;
  return buildWhatsAppLink(message);
}

export function getVehicleWhatsAppLink(vehicleName: string): string {
  return buildWhatsAppLink(
    `Hi Methmi Enterprises, I would like to enquire about booking the ${vehicleName} for an airport transfer or tour.`
  );
}

export function getTourWhatsAppLink(tourName: string): string {
  return buildWhatsAppLink(
    `Hi Methmi Enterprises, I would like to enquire about the ${tourName}.`
  );
}

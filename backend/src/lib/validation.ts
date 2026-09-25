import { z } from "zod";

export const bookingEnquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long."),
  email: z.string().trim().email("Please enter a valid email address."),
  whatsappNumber: z
    .string()
    .trim()
    .min(7, "Please enter a valid WhatsApp number, including country code.")
    .max(20, "Please enter a valid WhatsApp number."),
  country: z.string().trim().min(2, "Please enter your country."),
  flightNumber: z.string().trim().max(20).optional().or(z.literal("")),
  arrivalDate: z.string().trim().min(1, "Please select an arrival date."),
  arrivalTime: z.string().trim().min(1, "Please select an arrival time."),
  pickupLocation: z
    .string()
    .trim()
    .min(2, "Please enter a pickup location."),
  dropLocation: z.string().trim().min(2, "Please enter a drop-off location."),
  vehicleType: z.string().trim().min(1, "Please select a vehicle type."),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type BookingEnquiryInput = z.infer<typeof bookingEnquirySchema>;

export const VEHICLE_CATEGORIES = ["Van", "Car", "SUV", "Bus"] as const;

// A junk value falls back instead of rejecting the whole request, which is how
// the admin routes have always behaved.
const optionalText = z.string().optional().catch(undefined);

function requiredName(label: string) {
  const message = `${label} name is required.`;
  return z
    .string({ required_error: message, invalid_type_error: message })
    .trim()
    .min(1, message);
}

// The admin textareas post newline-separated text; arrays are accepted too.
const stringList = z
  .union([z.string(), z.array(z.coerce.string())])
  .transform((value) =>
    (typeof value === "string" ? value.split("\n") : value)
      .map((line) => line.trim())
      .filter(Boolean),
  )
  .catch([]);

export const tourInputSchema = z.object({
  name: requiredName("Tour"),
  slug: optionalText,
  duration: optionalText,
  pickupTime: optionalText,
  description: optionalText,
  highlights: stringList,
  included: stringList,
  startingPrice: optionalText,
  image: optionalText,
});

export type TourInput = z.infer<typeof tourInputSchema>;

export const vehicleInputSchema = z.object({
  name: requiredName("Vehicle"),
  slug: optionalText,
  category: z.enum(VEHICLE_CATEGORIES).catch("Van"),
  seats: z.coerce.number().finite().optional().catch(undefined),
  ac: z.coerce.boolean().catch(false),
  luggageCapacity: optionalText,
  description: optionalText,
  image: optionalText,
  samplePrices: z
    .object({
      colombo: optionalText,
      galle: optionalText,
      sigiriya: optionalText,
    })
    .catch({}),
});

export type VehicleInput = z.infer<typeof vehicleInputSchema>;

export function firstErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid request body.";
}

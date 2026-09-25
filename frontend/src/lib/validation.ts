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

// Business details, from env. Don't hardcode contact info in components.
export const siteConfig = {
  businessName: "Methmi Enterprises",
  tagline: "Airport Transfers & Tours Since 2006",
  foundedYear: 2006,
  location: "Katunayaka, Sri Lanka",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+94 70 421 1444",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+94 70 421 1444",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "methmiwalakanda@gmail.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.methmienterprises.com",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  // Approximate Katunayaka coordinates — replace with the exact business location.
  mapEmbedQuery: "Katunayaka, Sri Lanka",
};

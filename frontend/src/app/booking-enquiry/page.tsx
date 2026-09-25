import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import BookingForm from "@/components/BookingForm";
import { getDefaultWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Booking Enquiry",
  description:
    "Send a booking enquiry to Methmi Enterprises for your Colombo airport transfer or Sri Lanka tour. We'll confirm your trip directly.",
};

interface BookingEnquiryPageProps {
  // In this version of Next.js `searchParams` is a Promise and must be awaited
  // before its properties are read.
  searchParams: Promise<{ vehicle?: string; tour?: string }>;
}

export default async function BookingEnquiryPage({
  searchParams,
}: BookingEnquiryPageProps) {
  const { vehicle, tour } = await searchParams;

  const defaultVehicle = vehicle;
  const defaultMessage = tour ? `I'm interested in the ${tour}.` : undefined;

  return (
    <section className="container-page py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Booking Enquiry"
          title="Tell us about your trip"
          description="Fill in your travel details below and our team will confirm availability, vehicle, and pricing directly with you. Prefer to chat? Message us on WhatsApp instead."
        />
        <div className="mt-6">
          <WhatsAppButton
            href={getDefaultWhatsAppLink()}
            variant="outline"
            analyticsContext="booking_page_top"
          />
        </div>
        <div className="mt-8">
          <BookingForm defaultVehicle={defaultVehicle} defaultMessage={defaultMessage} />
        </div>
      </div>
    </section>
  );
}

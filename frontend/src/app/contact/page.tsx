import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Methmi Enterprises for Colombo airport transfers and Sri Lanka tours — WhatsApp, phone, email, and our Katunayaka location.",
};

export default function ContactPage() {
  return (
    <section className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="Contact Us"
        title="We're here to help, 24/7"
        description="Reach out on WhatsApp for the fastest response, or use any of the options below."
      />
      <div className="mt-10">
        <ContactSection />
      </div>
    </section>
  );
}

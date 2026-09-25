import { getDefaultWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppButton from "./WhatsAppButton";

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      <WhatsAppButton
        href={getDefaultWhatsAppLink()}
        variant="icon"
        label="Chat with us on WhatsApp"
        analyticsContext="floating_button"
      />
    </div>
  );
}

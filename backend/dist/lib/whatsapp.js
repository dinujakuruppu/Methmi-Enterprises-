/**
 * WhatsApp Cloud API (Meta) notifications.
 * Sends a WhatsApp message to the business owner when a booking enquiry arrives.
 * No-ops if the keys are unset — enquiries are stored either way.
 *
 * Env vars:
 *   WHATSAPP_ACCESS_TOKEN     — permanent System User token (the "API key")
 *   WHATSAPP_PHONE_NUMBER_ID  — the sender's Phone number ID (NOT the phone number)
 *   WHATSAPP_NOTIFY_TO        — number that receives alerts, e.g. 94771234567
 *   WHATSAPP_API_VERSION      — optional, default v23.0
 *   WHATSAPP_TEMPLATE_NAME    — optional; approved template to use
 *   WHATSAPP_TEMPLATE_LANG    — optional, default en_US
 */
const DEFAULT_API_VERSION = "v23.0";
export function isWhatsAppConfigured() {
    return Boolean(process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WHATSAPP_PHONE_NUMBER_ID &&
        process.env.WHATSAPP_NOTIFY_TO);
}
/** Low-level sender. `payload` is everything except messaging_product / to. */
export async function sendWhatsAppMessage(to, payload) {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const version = process.env.WHATSAPP_API_VERSION || DEFAULT_API_VERSION;
    if (!token || !phoneNumberId) {
        return { sent: false, reason: "not_configured" };
    }
    try {
        const response = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to.replace(/[^\d]/g, ""),
                ...payload,
            }),
            signal: AbortSignal.timeout(10_000),
        });
        const body = (await response.json().catch(() => ({})));
        if (!response.ok) {
            // Never log the token. Error code/message are safe to log.
            console.error(`[whatsapp] Send failed (HTTP ${response.status}, code ${body.error?.code}):`, body.error?.message);
            return { sent: false, reason: "send_failed" };
        }
        return { sent: true, messageId: body.messages?.[0]?.id };
    }
    catch (error) {
        console.error("[whatsapp] Request error:", error);
        return { sent: false, reason: "send_failed" };
    }
}
/** Notifies the business owner about a new booking enquiry. */
export async function sendBookingEnquiryWhatsApp(data) {
    const notifyTo = process.env.WHATSAPP_NOTIFY_TO;
    if (!isWhatsAppConfigured() || !notifyTo) {
        console.warn("[whatsapp] Skipped — WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, or WHATSAPP_NOTIFY_TO is not set.");
        return { sent: false, reason: "not_configured" };
    }
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
    // Template mode: works any time (business-initiated messages need a template).
    if (templateName) {
        const language = { code: process.env.WHATSAPP_TEMPLATE_LANG || "en_US" };
        // Meta's built-in test template has no variables.
        if (templateName === "hello_world") {
            return sendWhatsAppMessage(notifyTo, {
                type: "template",
                template: { name: templateName, language },
            });
        }
        // Your own template must have exactly these 5 body variables, in order:
        // {{1}} name, {{2}} arrival date & time, {{3}} pickup → drop,
        // {{4}} vehicle, {{5}} customer WhatsApp number
        return sendWhatsAppMessage(notifyTo, {
            type: "template",
            template: {
                name: templateName,
                language,
                components: [
                    {
                        type: "body",
                        parameters: [
                            data.fullName,
                            `${data.arrivalDate} ${data.arrivalTime}`,
                            `${data.pickupLocation} → ${data.dropLocation}`,
                            data.vehicleType,
                            data.whatsappNumber,
                        ].map((text) => ({ type: "text", text: templateSafe(text) })),
                    },
                ],
            },
        });
    }
    // Text mode: only delivered if WHATSAPP_NOTIFY_TO messaged the business
    // number in the last 24 hours. Good for testing; use a template in production.
    return sendWhatsAppMessage(notifyTo, {
        type: "text",
        text: { preview_url: false, body: renderEnquiryText(data) },
    });
}
function renderEnquiryText(data) {
    return [
        "*New Booking Enquiry — Methmi Enterprises*",
        "",
        `Name: ${data.fullName}`,
        `Email: ${data.email}`,
        `WhatsApp: ${data.whatsappNumber}`,
        `Country: ${data.country}`,
        `Flight: ${data.flightNumber || "—"}`,
        `Arrival: ${data.arrivalDate} ${data.arrivalTime}`,
        `Pickup: ${data.pickupLocation}`,
        `Drop-off: ${data.dropLocation}`,
        `Vehicle: ${data.vehicleType}`,
        `Message: ${data.message || "—"}`,
        "",
        `Reply to customer: https://wa.me/${data.whatsappNumber.replace(/[^\d]/g, "")}`,
    ].join("\n");
}
/** Template variables can't contain newlines/tabs or 4+ consecutive spaces. */
function templateSafe(value) {
    const cleaned = String(value || "—")
        .replace(/[\r\n\t]+/g, " ")
        .replace(/ {4,}/g, "   ")
        .trim();
    return cleaned.slice(0, 1000) || "—";
}
//# sourceMappingURL=whatsapp.js.map
/** Sends the enquiry notification via Resend. No-ops if the keys are unset. */
export async function sendBookingEnquiryEmail(data) {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.BUSINESS_EMAIL;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !to || !from) {
        console.warn("[email] Skipped — RESEND_API_KEY, BUSINESS_EMAIL, or EMAIL_FROM is not set.");
        return { sent: false, reason: "not_configured" };
    }
    try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);
        await resend.emails.send({
            from,
            to,
            replyTo: data.email,
            subject: `New Booking Enquiry — ${data.fullName}`,
            html: renderEnquiryEmailHtml(data),
        });
        return { sent: true };
    }
    catch (error) {
        console.error("[email] Failed to send booking enquiry email:", error);
        return { sent: false, reason: "send_failed" };
    }
}
function renderEnquiryEmailHtml(data) {
    const rows = [
        ["Full name", data.fullName],
        ["Email", data.email],
        ["WhatsApp number", data.whatsappNumber],
        ["Country", data.country],
        ["Flight number", data.flightNumber || "—"],
        ["Arrival date", data.arrivalDate],
        ["Arrival time", data.arrivalTime],
        ["Pickup location", data.pickupLocation],
        ["Drop-off location", data.dropLocation],
        ["Vehicle type", data.vehicleType],
        ["Message", data.message || "—"],
    ];
    const rowsHtml = rows
        .map(([label, value]) => `<tr><td style="padding:8px 12px;font-weight:600;color:#0e5872;">${label}</td><td style="padding:8px 12px;">${escapeHtml(value)}</td></tr>`)
        .join("");
    return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#0e5872;">New Booking Enquiry — Methmi Enterprises</h2>
      <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
    </div>
  `;
}
function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
//# sourceMappingURL=email.js.map
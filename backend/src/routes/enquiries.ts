import { Router } from "express";
import { bookingEnquirySchema } from "../lib/validation.js";
import { sendBookingEnquiryEmail } from "../lib/email.js";
import { saveBookingEnquiry } from "../lib/enquiry-store.js";
import { sendBookingEnquiryWhatsApp } from "../lib/whatsapp.js";

const router = Router();

// Per-instance rate limiting. Use Redis or a provider-level limit if this
// ever runs on more than one process.
const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

router.post("/booking-enquiry", async (req, res) => {
  try {
    const forwardedFor = req.headers["x-forwarded-for"];
    const ip =
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor) || req.ip || "unknown";

    if (isRateLimited(ip)) {
      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again in a minute.",
      });
      return;
    }

    const parsed = bookingEnquirySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Please check the form for errors and try again.",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    // Email and WhatsApp alerts run in parallel; neither blocks the other.
    const [emailResult, whatsappResult] = await Promise.all([
      sendBookingEnquiryEmail(parsed.data),
      sendBookingEnquiryWhatsApp(parsed.data),
    ]);

    const stored = await saveBookingEnquiry(parsed.data, {
      emailSent: emailResult.sent,
      ip,
      userAgent: req.headers["user-agent"] ?? null,
    });

    if (!emailResult.sent && !whatsappResult.sent && !stored.saved) {
      console.log("[booking-enquiry] New enquiry received:", parsed.data);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("[booking-enquiry] Unexpected error:", error);
    res.status(500).json({
      success: false,
      message:
        "We couldn't process your enquiry right now. Please try again or contact us on WhatsApp.",
    });
  }
});

export default router;

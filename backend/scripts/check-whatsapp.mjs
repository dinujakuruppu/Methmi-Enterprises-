// Sends a test WhatsApp message using the values in backend/.env
// Run: npm run check:whatsapp
import "dotenv/config";

const {
  WHATSAPP_ACCESS_TOKEN: token,
  WHATSAPP_PHONE_NUMBER_ID: phoneNumberId,
  WHATSAPP_NOTIFY_TO: to,
  WHATSAPP_API_VERSION: version = "v23.0",
  WHATSAPP_TEMPLATE_NAME: templateName,
  WHATSAPP_TEMPLATE_LANG: lang = "en_US",
} = process.env;

const missing = Object.entries({
  WHATSAPP_ACCESS_TOKEN: token,
  WHATSAPP_PHONE_NUMBER_ID: phoneNumberId,
  WHATSAPP_NOTIFY_TO: to,
}).filter(([, v]) => !v).map(([k]) => k);

if (missing.length) {
  console.error("✗ Missing in backend/.env:", missing.join(", "));
  process.exit(1);
}

// Test with hello_world unless plain text was explicitly chosen.
const useTemplate = templateName !== "";
const payload = useTemplate
  ? { type: "template", template: { name: "hello_world", language: { code: "en_US" } } }
  : { type: "text", text: { body: "✅ Methmi Enterprises WhatsApp API test" } };

console.log(`Sending ${useTemplate ? "hello_world template" : "text"} to ${to}...`);

const res = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ messaging_product: "whatsapp", to: to.replace(/[^\d]/g, ""), ...payload }),
});
const body = await res.json().catch(() => ({}));

if (res.ok) {
  console.log("✓ Accepted by WhatsApp. Message id:", body.messages?.[0]?.id);
  if (templateName && templateName !== "hello_world") {
    console.log(`  (Your live template "${templateName}" / ${lang} will be used for real enquiries.)`);
  }
} else {
  console.error(`✗ Failed (HTTP ${res.status}, code ${body.error?.code}):`, body.error?.message);
  process.exit(1);
}

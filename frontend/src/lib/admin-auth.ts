// Sessions are issued by the backend; here we only verify the signed cookie
// so the middleware can redirect signed-out visitors. Both apps must share
// the same ADMIN_SESSION_SECRET. Web Crypto so this runs on the edge.

export const ADMIN_SESSION_COOKIE = "methmi_admin_session";

const DEFAULT_SECRET = "methmi-dev-only-secret-change-me";

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
}

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return bufferToHex(signature);
}

export async function isSessionTokenValid(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await hmacHex(getSecret(), payload);
  if (expected.length !== signature.length) return false;

  // Constant-time-ish comparison.
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  if (mismatch !== 0) return false;

  const expiresAt = Number(payload);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

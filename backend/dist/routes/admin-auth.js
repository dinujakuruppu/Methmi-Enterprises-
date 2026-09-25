import { Router } from "express";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS, createSessionToken, getAdminPassword, isSessionTokenValid, } from "../lib/admin-auth.js";
const router = Router();
function readSameSite() {
    const value = (process.env.COOKIE_SAMESITE || "lax").toLowerCase();
    return value === "none" || value === "strict" ? value : "lax";
}
function sessionCookieOptions() {
    const sameSite = readSameSite();
    const secure = process.env.COOKIE_SECURE === "true" ||
        sameSite === "none" ||
        process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        sameSite,
        secure,
        path: "/",
        ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
    };
}
router.post("/login", async (req, res) => {
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!password || password !== getAdminPassword()) {
        res.status(401).json({ error: "Incorrect password." });
        return;
    }
    const token = await createSessionToken();
    res.cookie(ADMIN_SESSION_COOKIE, token, {
        ...sessionCookieOptions(),
        maxAge: ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
    });
    res.json({ ok: true });
});
router.post("/logout", (_req, res) => {
    res.cookie(ADMIN_SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
    res.json({ ok: true });
});
router.get("/session", async (req, res) => {
    const valid = await isSessionTokenValid(req.cookies?.[ADMIN_SESSION_COOKIE]);
    res.status(valid ? 200 : 401).json({ authenticated: valid });
});
export default router;
//# sourceMappingURL=admin-auth.js.map
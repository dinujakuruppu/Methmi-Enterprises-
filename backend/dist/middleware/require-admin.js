import { ADMIN_SESSION_COOKIE, isSessionTokenValid } from "../lib/admin-auth.js";
// The frontend middleware also checks the session so /admin redirects
// nicely, but this is the check that actually protects the data.
export async function requireAdmin(req, res, next) {
    const token = req.cookies?.[ADMIN_SESSION_COOKIE];
    if (await isSessionTokenValid(token)) {
        next();
        return;
    }
    res.status(401).json({ error: "Unauthorized. Please log in again." });
}
//# sourceMappingURL=require-admin.js.map
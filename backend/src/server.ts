import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { LOCAL_UPLOAD_DIR } from "./lib/storage.js";
import { isSupabaseConfigured } from "./lib/supabase.js";
import adminAuthRouter from "./routes/admin-auth.js";
import adminToursRouter from "./routes/admin-tours.js";
import adminVehiclesRouter from "./routes/admin-vehicles.js";
import adminUploadRouter from "./routes/admin-upload.js";
import enquiriesRouter from "./routes/enquiries.js";
import publicRouter from "./routes/public.js";

const app = express();
const PORT = Number(process.env.PORT || process.env.BACKEND_PORT || 4000);

app.set("trust proxy", true);
app.disable("x-powered-by");

// Only needed for direct calls — the frontend proxies /api/* on its own origin.
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/uploads", express.static(LOCAL_UPLOAD_DIR, { maxAge: "1y", fallthrough: true }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "methmi-backend",
    database: isSupabaseConfigured() ? "supabase" : "local-json-fallback",
    time: new Date().toISOString(),
  });
});

app.use("/api", publicRouter);
app.use("/api", enquiriesRouter);

app.use("/api/admin", adminAuthRouter);
app.use("/api/admin/tours", adminToursRouter);
app.use("/api/admin/vehicles", adminVehiclesRouter);
app.use("/api/admin/upload", adminUploadRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[api] Unhandled error:", error);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

app.listen(PORT, () => {
  console.log(`\n  Methmi API listening on http://localhost:${PORT}`);
  console.log(
    `  Data source: ${isSupabaseConfigured() ? "Supabase" : "local JSON fallback (set the Supabase keys in backend/.env)"}\n`,
  );
});

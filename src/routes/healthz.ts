import crypto from "crypto";
import { Router } from "express";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Pre-load the HTML template once
const filePath = path.join(__dirname, "../../components/healthz.htm");
let healthTemplate: string;

try {
    healthTemplate = fs.readFileSync(filePath, "utf8");
} catch (err) {
    console.error("Failed to load healthz.htm:", err);
    healthTemplate = "<h1>Health template missing</h1>";
}

router.get("/", async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const statusMap: Record<number, string> = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting",
        };

        const dbStatus = statusMap[dbState] || "unknown";
        const timestamp = new Date().toLocaleString();
        const isoTimestamp = new Date().toISOString();

        // Inline SVG icons with correct classes
        let dbIcon = "";
        let dbClass = "";

        if (dbStatus === "connected") {
            dbIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon success">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>`;
            dbClass = "connected";
        } else if (dbStatus === "connecting") {
            dbIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon warning">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
                  <path d="M12 9v4"/>
                  <path d="M12 17h.01"/>
                </svg>`;
            dbClass = "connecting";
        } else {
            dbIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon error">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m15 9-6 6"/>
                  <path d="m9 9 6 6"/>
                </svg>`;
            dbClass = dbStatus;
        }

        // Generate ETag from current health state (changes when DB status changes)
        const etagContent = dbStatus + timestamp;
        const etag = `"${crypto.createHash("md5").update(etagContent).digest("hex")}"`;

        // === HTML Response (Browser) - With Caching ===
        if (req.headers.accept?.includes("text/html")) {
            const rendered = healthTemplate
                .replace("{title}", "Health Check | Ecom API Hub")
                .replace("{dbClass}", dbClass)
                .replace("{dbIcon}", dbIcon)
                .replace("{dbStatus}", dbStatus)
                .replace("{timeStamp}", timestamp);

            res.set({
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=2592000, stale-while-revalidate=3600", // 30 days + 1hr revalidate
                "ETag": etag,
            });

            // If ETag matches, browser will get 304 automatically
            return res.send(rendered);
        }

        // === JSON Response (API clients, monitoring) - No Caching ===
        res.set({
            "Cache-Control": "no-store, no-cache, must-revalidate, private",
        });

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Health check OK",
            data: {
                app: "running",
                db: dbStatus,
                timestamp: isoTimestamp,
            },
        });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Server error";
        console.error("Health check error:", msg);

        // Always return JSON on error
        res.set("Cache-Control", "no-store");
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: msg,
        });
    }
});

export default router;
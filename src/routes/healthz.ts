import crypto from "crypto";
import { Router } from "express";
import mongoose from "mongoose";
import React from "react";
import { renderToString } from "react-dom/server";
import { Healthz } from "../../components/Healthz.js";

const router = Router();

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

        const etagContent = dbStatus + timestamp;
        const etag = `"${crypto.createHash("md5").update(etagContent).digest("hex")}"`;

        // HTML Response (Browser) - With Caching
        if (req.headers.accept?.includes("text/html")) {
            const htmlTemplate = renderToString(
                React.createElement(Healthz, {
                    title: "Health Check | Ecom API Hub",
                    response: {
                        success: true,
                        statusCode: 200,
                        message: "Health check OK",
                        data: {
                            app: "running",
                            db: statusMap[dbState],
                            timestamp: isoTimestamp,
                        },
                    },
                })
            );

            const rendered = "<!DOCTYPE html>" + htmlTemplate;

            res.set({
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=2592000, stale-while-revalidate=3600", // 30 days + 1hr revalidate
                "ETag": etag,
            });

            return res.type("html").send(rendered);

        }

        // JSON Response (API clients, monitoring) - No Caching
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
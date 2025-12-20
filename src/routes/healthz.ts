import { Router } from "express";
import mongoose from "mongoose";
import React from "react";
import { renderToString } from "react-dom/server";
import { HealthPage } from "../../components/healthz.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    // Check mongoose connection state
    const dbState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const statusMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    const html = renderToString(
      React.createElement(HealthPage, {
        response: {
          success: true,
          statusCode: 200,
          message: "Health check OK",
          data: {
            app: "running",
            db: statusMap[dbState],
            timestamp: new Date().toISOString(),
          },
        },
      })
    );

    return res.type("html").send("<!DOCTYPE html>" + html);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";

    console.error("Health check error:", msg);

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: msg,
    });
  }
});

export default router;

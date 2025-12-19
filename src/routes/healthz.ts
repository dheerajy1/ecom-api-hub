import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
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

        const response = {
            success: true,
            statusCode: 200,
            message: "Health check OK",
            data: {
                app: "running",
                db: statusMap[dbState],
                timestamp: new Date().toISOString(),
            },
        };

        return res.status(200).json(response);
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
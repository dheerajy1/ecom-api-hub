import { Router } from "express";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import mongoose from "mongoose";
import React from "react";
import { renderToString } from "react-dom/server";

const router = Router();

// React UI
function HealthPage({
  response,
}: {
  response: {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
      app: string;
      db: string;
      timestamp: string;
    };
  };
}): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Health Check | Ecom API Hub</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div className="container health">
          <h1 className="health-title">Health Status</h1>

          <div className="health-card">
            <div className="health-row">
              <span className="health-label">App</span>
              <span className="health-value">{response.data.app}</span>
            </div>

            <div className="health-row">
              <span className="health-label">Database</span>

              <span className={`health-value ${response.data.db}`}>
                {response.data.db === "connected" && (
                  <>
                    <CheckCircle size={16} className="icon success" />
                    connected
                  </>
                )}

                {response.data.db === "connecting" && (
                  <>
                    <AlertTriangle size={16} className="icon warning" />
                    connecting
                  </>
                )}

                {response.data.db !== "connected" &&
                  response.data.db !== "connecting" && (
                    <>
                      <XCircle size={16} className="icon error" />
                      {response.data.db}
                    </>
                  )}
              </span>
            </div>

            <div className="health-row">
              <span className="health-label">Timestamp</span>
              <span className="health-value">{response.data.timestamp}</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

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
      <HealthPage
        response={{
          success: true,
          statusCode: 200,
          message: "Health check OK",
          data: {
            app: "running",
            db: statusMap[dbState],
            timestamp: new Date().toISOString(),
          },
        }}
      />
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

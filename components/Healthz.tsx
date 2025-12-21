import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import React from "react";

type Props = {
  title: string;
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
};

export function Healthz({ title, response }: Props): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
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
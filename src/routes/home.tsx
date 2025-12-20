import { Router } from "express";
import { renderToString } from "react-dom/server";

const router = Router();

import React from "react";

type Props = {
  bunVersion: string;
};

function HomePage({ bunVersion }: Props): React.ReactElement {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{`Express + Bun ${bunVersion} on Vercel`}</title>
        <link rel="stylesheet" href="/style.css" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="container">
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/api/docs">API Docs</a>
            <a href="/healthz">Health</a>
          </nav>
          <section className="section">
            <h1 className="section-title">
              Welcome to Ecom API Hub, Express + Bun {bunVersion} on Vercel 🚀
            </h1>
            <p className="section-text">
              Complete foundational structure, type safety layer, deployment
              readiness, and basic login authentication for the ecom-api-hub
              backend.
            </p>
            <img src="/logo.png" alt="Logo" className="section-logo" />
          </section>
        </div>
      </body>
    </html>
  );
}

router.get("", (_req, res) => {
  try {
    const html = renderToString(<HomePage bunVersion={process.versions.bun} />);

    return res.type("html").send("<!DOCTYPE html>" + html);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ message: msg });
  }
});

export default router;

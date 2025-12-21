import React from "react";

type Props = {
  title: string;
  nodeVersion: string;
};

export function Home({ title, nodeVersion }: Props): React.ReactElement {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
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
              Welcome to Ecom API Hub, Express + Node {nodeVersion} on Vercel 🚀
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
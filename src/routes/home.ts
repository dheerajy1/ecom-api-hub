import crypto from 'crypto';
import { Router } from 'express';
import React from "react";
import { renderToString } from "react-dom/server";
import { Home } from "../../components/Home.js";

const router = Router();

let cachedHtmlTemplate: string;
let cachedEtag: string;

try {
  cachedHtmlTemplate = renderToString(React.createElement(Home, { title: `Express + Node ${process.versions.node} on Vercel`, nodeVersion: process.versions.node }));

  const contentForEtag = cachedHtmlTemplate + process.versions.node;
  cachedEtag = `"${crypto.createHash('md5').update(contentForEtag).digest('hex')}"`;
} catch (err: unknown) {
  console.error("Failed to load home.htm:", err);
  cachedHtmlTemplate = "<h1>Home template missing</h1>";
  cachedEtag = '"missing"';
}

router.get('', (_req, res) => {
  try {

    const rendered = "<!DOCTYPE html>" + cachedHtmlTemplate;
    // 30 days + revalidate 1 hour
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=3600',
      'ETag': cachedEtag,
    });

    return res.type("html").send(rendered);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ message: msg });
  }
});

export default router;
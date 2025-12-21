import crypto from 'crypto';
import { Router } from 'express';
import React from "react";
import { renderToString } from "react-dom/server";
import { About } from '../../components/About.js';

const router = Router();

const ABOUT_CONTENT = {
    title: "About | Ecom API Hub",
    heading: "About",
    description: `
Ecom API Hub is a production-grade custom backend platform designed to prove
clean contracts, strict validation, and zero drift between backend and frontend.

It demonstrates how a modern Express + oRPC backend can act as a single source
of truth, exposing OpenAPI specifications that directly power frontend types,
fetching, and caching strategies.
  `.trim(),
};

let cachedHtmlTemplate: string;
let cachedEtag: string;

try {
    cachedHtmlTemplate = renderToString(React.createElement(
        About, {
        title: ABOUT_CONTENT.title,
        heading: ABOUT_CONTENT.heading,
        description: ABOUT_CONTENT.description,
    }));

    const hashContent = cachedHtmlTemplate + ABOUT_CONTENT.title + ABOUT_CONTENT.heading + ABOUT_CONTENT.description;
    cachedEtag = `"${crypto.createHash('md5').update(hashContent).digest('hex')}"`;
} catch (err) {
    console.error("Failed to load about.htm:", err);
    cachedHtmlTemplate = "<h1>About page missing</h1>";
    cachedEtag = '"error"';
}

router.get('/', (_req, res) => {
    try {
        const rendered = "<!DOCTYPE html>" + cachedHtmlTemplate;

        // 30 days + 1hr revalidate
        res.set({
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=3600',
            'ETag': cachedEtag,
        });

        res.type("html").send(rendered);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Server error';
        res.status(500).json({ message: msg });
    }
});

export default router;
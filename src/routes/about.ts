import crypto from 'crypto'; // Built-in, no install needed
import { Router } from 'express';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Static content (can be updated anytime — ETag will change automatically)
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

// Pre-load template and generate ETag once at startup
const filePath = path.join(__dirname, "../../components/about.htm");
let cachedTemplate: string;
let cachedEtag: string;

try {
    cachedTemplate = fs.readFileSync(filePath, "utf8");

    // ETag based on template file + about content → changes on any update
    const hashContent = cachedTemplate + ABOUT_CONTENT.title + ABOUT_CONTENT.heading + ABOUT_CONTENT.description;
    cachedEtag = `"${crypto.createHash('md5').update(hashContent).digest('hex')}"`;
} catch (err) {
    console.error("Failed to load about.htm:", err);
    cachedTemplate = "<h1>About page missing</h1>";
    cachedEtag = '"error"';
}

// About route with caching
router.get('/', (_req, res) => {
    try {
        const rendered = cachedTemplate
            .replace("{title}", ABOUT_CONTENT.title)
            .replace("{heading}", ABOUT_CONTENT.heading)
            .replace("{description}", ABOUT_CONTENT.description);

        res.set({
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=3600', // 30 days + 1hr revalidate
            'ETag': cachedEtag,
        });

        res.send(rendered);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Server error';
        res.status(500).json({ message: msg });
    }
});

export default router;
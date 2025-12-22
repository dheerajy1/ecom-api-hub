import { Router } from 'express';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto'; // Built-in Node.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Pre-load and pre-compute static parts once at startup
const filePath = path.join(__dirname, "../../components/home.htm");
let cachedHtmlTemplate: string;
let cachedEtag: string;

try {
  cachedHtmlTemplate = fs.readFileSync(filePath, "utf8");

  // Generate ETag from file content + Bun version (changes when you update HTML or deploy)
  const contentForEtag = cachedHtmlTemplate + process.versions.bun;
  cachedEtag = `"${crypto.createHash('md5').update(contentForEtag).digest('hex')}"`;
} catch (err) {
  console.error("Failed to load home.htm:", err);
  cachedHtmlTemplate = "<h1>Home template missing</h1>";
  cachedEtag = '"missing"';
}

// Home route - HTML with smart caching
router.get('', (_req, res) => {
  try {
    // Inject dynamic value (Bun version)
    const rendered = cachedHtmlTemplate
      .replace("{title}", "Home | Ecom API Hub")
      .replaceAll("{bunVersion}", process.versions.bun || "unknown");

    // Set caching headers
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=3600', // 30 days + revalidate 1 hour
      'ETag': cachedEtag,
    });

    return res.send(rendered);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ message: msg });
  }
});

export default router;
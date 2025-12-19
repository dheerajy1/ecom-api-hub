import { Router } from 'express';

const router = Router();

// Home route - HTML
router.get('', async (req, res) => {
  try {
    res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express + Bun ${process.versions.bun} on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
        <link rel="icon" href="/favicon.ico">
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api/docs">API Docs</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Ecom API Hub, Express + Bun ${process.versions.bun} on Vercel 🚀</h1>
        <p>Complete foundational structure, type safety layer, deployment readiness, and basic login authentication for the ecom-api-hub backend..</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return res.status(500).json({ message: msg });
  }
})

export default router;

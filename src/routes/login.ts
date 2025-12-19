import type { Request, Response } from "express";
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router();

// login

router.get('/', async (_req: Request, res: Response) => {
  try {
    return res.sendFile(path.join(__dirname, '../..', 'components', 'login.htm'))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return res.status(500).json({ success: false, statusCode: 500, message: msg });
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (
      username === process.env.OPENAPI_USER &&
      password === process.env.OPENAPI_PASS
    ) {
      res.cookie("auth", "ok", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === "production",
      });

      return res.redirect("/");
    }

    return res.status(401).send("Invalid credentials");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return res.status(500).json({ success: false, statusCode: 500, message: msg });
  }
})

export default router;

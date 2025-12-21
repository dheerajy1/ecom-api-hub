import type { Request, Response } from "express";
import { Router } from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { Login } from "../../components/Login.js";

const router = Router();

// login

router.get("/", async (_req: Request, res: Response) => {
  try {
    const html = renderToString(React.createElement(Login, { title: "Login | Ecom API Hub" }));

    const rendered = "<!DOCTYPE html>" + html

    return res.type("html").send(rendered);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return res
      .status(500)
      .json({ success: false, statusCode: 500, message: msg });
  }
});

router.post("/", async (req: Request, res: Response) => {
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

    return res.status(401).json({ error: "Invalid credentials" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return res
      .status(500)
      .json({ success: false, statusCode: 500, message: msg });
  }
});

export default router;
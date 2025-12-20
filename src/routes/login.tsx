import type { Request, Response } from "express";
import { Router } from "express";
import { Lock, User } from "lucide-react";
import React from "react";
import { renderToString } from "react-dom/server";

const router = Router();

type Props = {
  title: string;
};

function Login({ title }: Props): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/login.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <div className="login-body">
          <div className="login-container">
            <div className="header">
              <div className="logo">ECOM</div>
              <h2>Ecom Server API Login</h2>
            </div>
            <form method="POST">
              <div className="input-group">
                <User className="icon" />
                <input name="username" placeholder="Username" required />
              </div>
              <div className="input-group">
                <Lock className="icon" />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit">Sign In</button>
            </form>
            <div className="footer">
              Secure access to portal / API documentation
            </div>
            <footer>
              <p>Developer: Dheeraj</p>
              <p>
                <a href="https://dheerajy1.hashnode.dev/">
                  dheerajy1.hashnode.dev
                </a>
              </p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

// login

router.get("/", async (_req: Request, res: Response) => {
  try {
    const html = renderToString(<Login title="Login | Ecom API Hub" />);

    return res.type("html").send("<!DOCTYPE html>" + html);
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

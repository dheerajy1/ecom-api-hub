import { Lock, User } from "lucide-react";
import React from "react";

type Props = {
  title: string;
};

export function Login({ title }: Props): React.ReactElement {
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
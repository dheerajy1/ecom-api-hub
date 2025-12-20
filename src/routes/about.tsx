import { Router } from "express";
import { renderToString } from "react-dom/server";

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

type Props = {
  title: string;
  heading: string;
  description: string;
};

function About({ title, heading, description }: Props): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="stylesheet" href="/style.css" />
      </head>

      <body>
        <div className="container about">
          <h1 className="about-title">{heading}</h1>

          <p className="about-text">{description}</p>
        </div>
      </body>
    </html>
  );
}

// about
router.get("/", async (_req, res) => {
  try {
    const html = renderToString(
      <About
        title={ABOUT_CONTENT.title}
        heading={ABOUT_CONTENT.heading}
        description={ABOUT_CONTENT.description}
      />
    );

    return res.type("html").send("<!DOCTYPE html>" + html);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ message: msg });
  }
});

export default router;

import { Router } from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { About } from "../../components/about.js";

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

// about
router.get("/", async (_req, res) => {
  try {
    const html = renderToString(React.createElement(
      About, {
      title: ABOUT_CONTENT.title,
      heading: ABOUT_CONTENT.heading,
      description: ABOUT_CONTENT.description,
    }));

    return res.type("html").send("<!DOCTYPE html>" + html);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ message: msg });
  }
});

export default router;

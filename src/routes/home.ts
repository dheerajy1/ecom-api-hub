import { Router } from "express";
import { renderToString } from "react-dom/server";

const router = Router();

import React from "react";
import { HomePage } from "../../components/home.js";

router.get("", (_req, res) => {
  try {
    const html = renderToString(React.createElement(HomePage, { bunVersion: process.versions.bun }));

    return res.type("html").send("<!DOCTYPE html>" + html);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ message: msg });
  }
});

export default router;

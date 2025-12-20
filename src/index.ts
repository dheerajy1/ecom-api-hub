import { OpenAPIHandler } from "@orpc/openapi/node";
import { onError } from "@orpc/server";
import { apiReference } from "@scalar/express-api-reference";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { connectDB } from "./lib/mongo.js";
import { apiRateLimit, openApiAccess, serverGate } from "./middleware/index.js";
import { generateOpenAPISpec } from "./orpc/openapi.js";
import { orpcRouter } from "./orpc/router.js";
import { aboutRouter, healthzRouter, homeRouter, loginRouter } from "./routes/index.js";

const app = express();

// ===============================================
// Core middleware
// ===============================================

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================================
// Database connection
// ===============================================

app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err: unknown) {
    console.error("DB init failed:", err);
    res.status(503).json({
      success: false,
      status: 503,
      message: "Database unavailable",
    });
  }
});

// ===============================================
// CORS
// ===============================================

app.use(
  cors({
    origin: [
      "https://r9k0j6rn-3000.inc1.devtunnels.ms",
      "http://localhost:3000",
    ],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Client-Id",
      "X-Client-Secret",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    optionsSuccessStatus: 204,
  })
);

// ===============================================
// Static assets
// ===============================================

app.use(express.static("public"));

// ===============================================
// Rate limit
// ===============================================

app.set("trust proxy", 1);

app.use("/api", apiRateLimit);

// ===============================================
// Docs login (ONLY public thing)
// ===============================================

app.use("/login", loginRouter);

// ===============================================
// GLOBAL SERVER GATE (ABSOLUTE)
// ===============================================

app.use((req, res, next) => {
  // 1. Internal Next.js frontend → always allowed
  if (serverGate(req)) {
    return next();
  }

  // 2. Allow login page itself (avoid infinite redirect)
  if (req.path.startsWith("/login")) {
    return next();
  }

  // 3. Logged-in browser (cookie)
  if (req.cookies?.auth === "ok") {
    return next();
  }

  // 4. EVERYTHING ELSE → redirect to login
  return res.redirect("/login");
});

// ===============================================
// OpenAPI JSON (PROTECTED)
// ===============================================

app.get("/api/openapi.json", openApiAccess, async (_req, res) => {
  const spec = await generateOpenAPISpec();
  res.json(spec);
});

// ===============================================
// API Docs (Scalar UI) — PROTECTED
// ===============================================

app.use(
  "/api/docs",
  apiReference({
    url: "/api/openapi.json",
  })
);

// ===============================================
// HTML routes (PROTECTED)
// ===============================================

app.use("/", homeRouter);
app.use("/about", aboutRouter);

// ===============================================
// Health check (PROTECTED)
// ===============================================

app.use("/healthz", healthzRouter);

// ===============================================
// oRPC REST handler (PROTECTED)
// ===============================================

const orpcHandler = new OpenAPIHandler(orpcRouter, {
  interceptors: [
    onError((_error: unknown) => {
      // optional logging
      // console.error("[oRPC error]", error);
    }),
  ],
});

app.use(async (req, res, next) => {
  const result = await orpcHandler.handle(req, res, {
    // prefix: "/api",

    context: {
      headers: req.headers,
    },
  });

  if (result.matched) {
    return;
  }

  next();
});

// ===============================================
// Global error handler
// ===============================================

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const msg = err instanceof Error ? err.stack : 'Something went wrong!';

  console.error(`Global Error - ${msg}`);
  res.status(500).json({
    success: false,
    statusCode: 500,
    error: "Something went wrong",
  });
});

export default app;

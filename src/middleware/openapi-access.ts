import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const AuthHeaderSchema = z
  .string()
  .startsWith("Basic ", "Invalid Authorization header format");

function verifyBasicAuth(req: Request): boolean {
  const user = process.env.OPENAPI_USER;
  const pass = process.env.OPENAPI_PASS;

  if (!user || !pass) return false;

  const authHeader = req.headers.authorization;
  if (!authHeader) return false;

  try {
    const parsed = AuthHeaderSchema.parse(authHeader);
    const encoded = parsed.split(" ")[1];
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");

    // Split only on the FIRST colon to handle passwords with colons
    const colonIndex = decoded.indexOf(":");
    if (colonIndex === -1) return false;

    const u = decoded.substring(0, colonIndex);
    const p = decoded.substring(colonIndex + 1);

    const isValid = u === user && p === pass;

    return isValid;
  } catch {
    return false;
  }
}

export function openApiAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. Browser access via docs login cookie
  if (req.cookies?.auth === "ok") {
    return next();
  }

  // 2. Machine access via Basic Auth
  if (verifyBasicAuth(req)) {
    return next();
  }

  // Otherwise deny
  res.setHeader("WWW-Authenticate", 'Basic realm="OpenAPI"');
  return res.status(401).json({
    success: false,
    statusCode: 401,
    error: "Unauthorized OpenAPI access",
  });
}
import type { Request } from "express";
import { z } from "zod";
import { env } from "../lib/env.js";

// Header schema validation
const headerSchema = z.object({
  "x-client-id": z.string(),
  "x-client-secret": z.string(),
});

export function serverGate(req: Request): boolean {
  try {

    // Parse and validate headers
    const parsedHeaders = headerSchema.parse(req.headers);

    const clientId = parsedHeaders["x-client-id"];
    const clientSecret = parsedHeaders["x-client-secret"];

    return (
      clientId === env.CLIENT_ID &&
      clientSecret === env.CLIENT_SECRET
    );
  } catch  {

    // Zod validation failed or headers missing
    // console.log(`Server gate error`, err) (err: unknown)
    return false;
  }
}
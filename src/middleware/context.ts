import { withAuthHeadersSchema, withNoAuthHeadersSchema } from "@/types/index.js";
import { ORPCError, os } from "@orpc/server";
import type { IncomingHttpHeaders } from "node:http";

/**
 * Protected routes (requires Bearer token)
 * Auth middleware for oRPC procedures
 *
 * - Reads Authorization header
 * - Verifies token via dummyjson.com (same as before)
 * - Injects `user` into context
 */

export const withAuth = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .use(async ({ context, next }) => {
    // Validate headers from context using Zod
    const parseResult = withAuthHeadersSchema.safeParse(context.headers);

    if (!parseResult.success) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Missing required headers",
      });
    }

    const { authorization: authHeader, } = parseResult.data;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Reuse the SAME external verification you already had
    const verifyRes = await fetch("https://dummyjson.com/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!verifyRes.ok) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Invalid or expired token",
      });
    }

    const user = await verifyRes.json();

    return next({
      context: {
        user: {
          id: String(user.id),
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
        },
      },
    });
  })
  .errors({
    UNAUTHORIZED: {
      status: 401,
    },
    FORBIDDEN: {
      status: 403,
    },
    INTERNAL_ERROR: {
      status: 500,
    },
    RATE_LIMITED: { status: 429 }
  });

// ===============================================
// Public routes (no auth required)
// ===============================================

export const withNoAuth = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .use(async ({ context, next }) => {
    const parseResult = withNoAuthHeadersSchema.safeParse(context.headers);

    if (!parseResult.success) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Missing required headers",
      });
    }

    return next();
  })
  // auto-attached to ALL public routes
  .errors({
    BAD_REQUEST: { status: 400, },
    CONFLICT: { status: 409, },
    RATE_LIMITED: { status: 429, },
    INTERNAL_ERROR: { status: 500, },
  });

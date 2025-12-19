import { v1Router } from "@/orpc/v1/router.js";

/**
 * Root oRPC router
 *
 * This object is the single source of truth for:
 * - routing
 * - OpenAPI generation
 * - handler matching
 */
export const orpcRouter = {
  v1: v1Router,
};

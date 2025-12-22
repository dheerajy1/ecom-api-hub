import { ORPCError } from "@orpc/server";

/**
 * Centralized oRPC → HTTP error mapper
 * This replaces per-route try/catch + send()
 */
export function mapORPCError(error: unknown) {
  // Default fallback
  let statusCode = 500;
  let message = "Something went wrong";

  // oRPC-native errors
  if (error instanceof ORPCError) {
    switch (error.code) {
      case "UNAUTHORIZED":
        statusCode = 401;
        message = "Unauthorized";
        break;

      case "FORBIDDEN":
        statusCode = 403;
        message = "Forbidden";
        break;

      case "NOT_FOUND":
        statusCode = 404;
        message = "Resource not found";
        break;

      case "BAD_REQUEST":
        statusCode = 400;
        message = error.message || "Bad request";
        break;

      default:
        statusCode = 500;
        message = error.message || "Internal server error";
    }
  }

  // Custom domain errors (thrown as Error("CODE"))
  if (error instanceof Error) {
    switch (error.message) {
      case "UNAUTHORIZED":
        statusCode = 401;
        message = "No token provided";
        break;

      case "INVALID_TOKEN":
      case "AUTH_VERIFICATION_FAILED":
        statusCode = 401;
        message = "Invalid or expired token";
        break;

      case "CART_NOT_FOUND":
        statusCode = 404;
        message = "Cart not found!";
        break;
    }
  }

  return {
    statusCode,
    body: {
      success: false,
      statusCode,
      error: message,
    },
  };
}

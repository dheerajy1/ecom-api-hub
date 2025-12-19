import { orpcRouter } from "@/orpc/router.js";
import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

export async function generateOpenAPISpec() {
  const generator = new OpenAPIGenerator({
    schemaConverters: [
      new ZodToJsonSchemaConverter(),
    ],
  });

  return generator.generate(orpcRouter, {
    info: {
      title: "Ecom API",
      version: "1.0.0",
      description: "E-commerce API powered by oRPC",
    },
    components: {
      headers: {
        RateLimitLimit: {
          schema: { type: "integer" },
          description: "Maximum number of requests allowed",
        },
        RateLimitRemaining: {
          schema: { type: "integer" },
          description: "Requests remaining in the window",
        },
        RateLimitReset: {
          schema: { type: "integer" },
          description: "Unix timestamp when the limit resets",
        },
        ClientIdTest: {
          schema: { type: "number" },
          description: "Internal client identifier",
        },
      },
      securitySchemes: {
        ClientId: {
          type: "apiKey",
          in: "header",
          name: "X-Client-Id",
          description: "Internal client identifier",
        },
        ClientSecret: {
          type: "apiKey",
          in: "header",
          name: "X-Client-Secret",
          description: "Internal client secret",
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  });
}

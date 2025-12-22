import z from "zod";

// Env schema validation
export const envSchema = z.object({
    CLIENT_ID: z
        .string()
        .trim()
        .min(1, { message: "CLIENT_ID is required and cannot be empty" })
        .length("nextjs-frontend".length, "CLIENT_ID must match expected length")
        .describe("Client identifier"),
    CLIENT_SECRET: z
        .string()
        .trim()
        .min(1, { message: "CLIENT_SECRET is required and cannot be empty" })
        .length(44, "CLIENT_SECRET must be 32 bytes base64 (openssl rand -base64 32)")
        .describe("Client secret"),
    // ... other env vars
});
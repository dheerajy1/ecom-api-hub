import { z } from "zod";

// =========================
// Schema for required auth headers
// =========================

export const withAuthHeadersSchema = z.object({
    authorization: z
        .string()
        .regex(/^Bearer .+/, "Must be a valid Bearer token")
        .describe("JWT Bearer token"),
    "x-client-id": z
        .string()
        .trim()
        .min(1, { message: "x-client-id is required and cannot be empty" })
        .length("nextjs-frontend".length, "x-client-id must match expected length")
        .describe("Client identifier"),
    "x-client-secret": z
        .string()
        .trim()
        .min(1, { message: "x-client-secret is required and cannot be empty" })
        .length(44, "x-client-secret must be 32 bytes base64 (openssl rand -base64 32)")
        .describe("Client secret"),
});

export const withNoAuthHeadersSchema = z.object({
    "x-client-id": z
        .string()
        .trim()
        .min(1, { message: "x-client-id is required and cannot be empty" })
        .length("nextjs-frontend".length, "CLIENT_ID must match expected length")
        .describe("Client identifier"),
    "x-client-secret": z
        .string()
        .trim()
        .min(1, { message: "x-client-secret is required and cannot be empty" })
        .length(44, "CLIENT_SECRET must be 32 bytes base64 (openssl rand -base64 32)")
        .describe("Client secret"),
});

// =========================
// LOGIN REQUEST
// =========================
export const LoginRequestSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const LoginInputSchema = z.object({
    headers: withNoAuthHeadersSchema,
    body: LoginRequestSchema,
})

// =========================
// LOGIN RESPONSE SUCCESS 
// =========================
export const LoginResponseSchema = z.object({
    success: z.literal(true),
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        token: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
        }),
        user: z.object({
            id: z.number(),
            username: z.string(),
            email: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            gender: z.enum(["male", "female"]),
            image: z.string(),
        }),
    }),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// =========================
// LOGOUT REQUEST
// =========================
export const LogoutRequestSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const LogoutInputSchema = z.object({
    headers: withNoAuthHeadersSchema,
    // body: LoginRequestSchema,
})
// =========================
// SIGNUP REQUEST
// =========================
export const SignupRequestSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const SignupInputSchema = z.object({
    headers: withNoAuthHeadersSchema,
    body: SignupRequestSchema,
})

// =========================
// SIGNUP RESPONSE SUCCESS 
// =========================
export const SignupResponseSchema = z.object({
    success: z.literal(true),
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        userId: z.number(),
    }),
});

// =========================
// REFRESH TOKEN REQUEST
// =========================

export const RefreshTokenInputSchema = z.object({
    headers: z.object({
        authorization: z
            .string()
            .regex(/^Bearer .+/, "Must be a valid Bearer token")
            .describe("JWT Bearer token"),
        "x-client-id": z
            .string()
            .trim()
            .min(1, { message: "x-client-id is required and cannot be empty" })
            .length("nextjs-frontend".length, "x-client-id must match expected length")
            .describe("Client identifier"),
        "x-client-secret": z
            .string()
            .trim()
            .min(1, { message: "x-client-secret is required and cannot be empty" })
            .length(44, "x-client-secret must be 32 bytes base64 (openssl rand -base64 32)")
            .describe("Client secret"),
    }),
})

// =========================
// REFRESH TOKEN RESPONSE SUCCESS
// =========================
export const RefreshTokenResponseSchema = z.object({
    success: z.literal(true),
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        token: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
        }),
    }),
});

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

// =========================
// ERROR RESPONSE
// =========================
export const AuthErrorResponseSchema = z.object({
    success: z.literal(false),
    statusCode: z.number(),
    error: z.string(),
});

export type AuthErrorResponse = z.infer<typeof AuthErrorResponseSchema>;

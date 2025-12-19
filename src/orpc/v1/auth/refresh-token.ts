import { withNoAuth } from "@/middleware/index.js";
import { RefreshTokenInputSchema, RefreshTokenResponseSchema } from "@/types/index.js";
import { ORPCError } from "@orpc/server";

/**
 * POST /api/v1/auth/user/refresh-token
 *
 * Public route (no user auth),
 * but requires refresh token in Authorization header
 */
export const refreshToken = withNoAuth
    .route({
        method: "POST",
        path: "/api/v1/auth/user/refresh-token",
        summary: "Refresh access token",
        description: "Refreshes the user access token using refresh token",
        inputStructure: "detailed",
    })
    .input(RefreshTokenInputSchema)
    .output(RefreshTokenResponseSchema)
    .handler(async ({ context }) => {
        const authHeader = context.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ORPCError("UNAUTHORIZED", {
                message: "Session expired, please login again",
            });
        }

        const refreshToken = authHeader.split(" ")[1];

        const response = await fetch("https://dummyjson.com/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: refreshToken,
            },
            body: JSON.stringify({
                refreshToken,
                expiresInMins: 60,
            }),
        });

        const data: {
            accessToken?: string;
            refreshToken?: string;
        } = await response.json();

        if (!data.accessToken) {
            throw new ORPCError("UNAUTHORIZED", {
                message: "Session expired, please login again",
            });
        }

        return {
            success: true,
            statusCode: 200,
            message: "Successfully refreshed access token!",
            data: {
                token: {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken!,
                },
            },
        };
    });

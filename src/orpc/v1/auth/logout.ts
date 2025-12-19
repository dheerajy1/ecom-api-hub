import { withNoAuth } from "@/middleware/index.js";
import { LogoutInputSchema } from "@/types/index.js";
import * as z from "zod";

/**
 * POST /api/v1/auth/user/logout
 *
 * Public route
 */
export const logout = withNoAuth
    .route({
        method: "POST",
        path: "/api/v1/auth/user/logout",
        summary: "Logout user",
        description: "Clears refresh token and logs user out",
        inputStructure: "detailed",
    })
    .input(LogoutInputSchema)
    .output(
        z.object({
            success: z.literal(true),
            message: z.string(),
        })
    )
    .handler(async ({ context }) => {
        // Fire-and-forget DummyJSON cleanup (optional) , input
        if (context?.headers?.cookie?.includes("refreshToken=")) {
            fetch("https://dummyjson.com/auth/refresh", {
                method: "DELETE",
                headers: {
                    Cookie: context.headers.cookie,
                },
            }).catch(() => { });
        }

        // Just return the object — ORPC will serialize it
        return {
            success: true,
            message: "Logged out successfully",
        };
    });

import { ORPCError } from "@orpc/server";
import { withNoAuth } from "../../../middleware/index.js";
import User from "../../../models/user.js";
import { LoginInputSchema, LoginResponseSchema } from "../../../types/index.js";

/**
 * POST /api/v1/auth/user/login
 *
 * Public route (no auth middleware)
 */

export const login = withNoAuth
    .route({
        method: "POST",
        path: "/api/v1/auth/user/login",
        summary: "Login / Authenticate user and return tokens",
        description: "Authenticate a user and return access/refresh tokens",
        inputStructure: "detailed",
    })
    .input(LoginInputSchema)
    .output(LoginResponseSchema)
    .handler(async ({ input }) => {
        const { username, password } = input.body;

        // 1. Search user in dummyjson
        const searchRes = await fetch(
            `https://dummyjson.com/users/search?q=${username}`
        );
        const searchData = await searchRes.json();
        const user = searchData.users?.[0];

        if (!user || user.username !== username) {
            throw new ORPCError("UNAUTHORIZED", {
                message: "Invalid credentials",
            });
        }

        // 2. Check local DB
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            throw new ORPCError("CONFLICT", {
                message: "User does not exist, please signup",
            });
        }

        // 3. Login via dummyjson
        const loginRes = await fetch("https://dummyjson.com/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                expiresInMins: 1440,
            }),
        });

        const loginData = await loginRes.json();

        if (!loginData?.accessToken) {
            throw new ORPCError("UNAUTHORIZED", {
                message: "Invalid credentials",
            });
        }

        // 4. Success response (same shape as before)
        return {
            success: true,
            statusCode: 200,
            message: "Login successful",
            data: {
                token: {
                    accessToken: loginData.accessToken,
                    refreshToken: loginData.refreshToken,
                },
                user: {
                    id: loginData.id,
                    username: loginData.username,
                    email: loginData.email,
                    firstName: loginData.firstName,
                    lastName: loginData.lastName,
                    gender: loginData.gender,
                    image: loginData.image,
                },
            },
        };
    });

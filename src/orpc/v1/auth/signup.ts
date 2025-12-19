import { withNoAuth } from "@/middleware/index.js";
import Cart from "@/models/cart.js";
import User from "@/models/user.js";
import { SignupInputSchema, SignupResponseSchema } from "@/types/index.js";
import { ORPCError } from "@orpc/server";

/**
 * POST /api/v1/auth/user/signup
 *
 * Public route
 */
export const signup = withNoAuth
    .route({
        method: "POST",
        path: "/api/v1/auth/user/signup",
        summary: "Create a new user account",
        description: "Create a new user account using dummyjson validation",
        inputStructure: "detailed",
    })
    .input(SignupInputSchema)
    .output(SignupResponseSchema)
    .handler(async ({ input }) => {
        const { username, password } = input.body;

        // 1. Validate against dummyjson
        const searchRes = await fetch(
            `https://dummyjson.com/users/search?q=${username}`
        );
        const searchData = await searchRes.json();

        const dummyUser = searchData.users?.[0] as
            | { id: number; username: string; password: string }
            | undefined;

        if (
            !dummyUser ||
            dummyUser.username !== username ||
            dummyUser.password !== password
        ) {
            throw new ORPCError("UNAUTHORIZED", {
                message: "Invalid credentials",
            });
        }

        // 2. Check if already exists locally
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new ORPCError("CONFLICT", {
                message: "User already exists",
            });
        }

        // 3. Create user
        await User.create({
            username,
            password,
            dummyUserId: dummyUser.id,
        });

        // 4. Create empty cart
        await Cart.create({
            userId: dummyUser.id,
        });

        return {
            success: true,
            statusCode: 201,
            message: "Signup successful",
            data: {
                userId: dummyUser.id,
            },
        };
    });

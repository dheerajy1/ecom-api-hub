import { login } from "@/orpc/v1/auth/login.js";
import { logout } from "@/orpc/v1/auth/logout.js";
import { refreshToken } from "@/orpc/v1/auth/refresh-token.js";
import { signup } from "@/orpc/v1/auth/signup.js";

/**
 * Auth routes (public)
 *
 * Maps to:
 * /api/v1/auth/user/*
 */
export const authRouter = {
    user: {
        login,
        refreshToken,
        signup,
        logout,
    },
};

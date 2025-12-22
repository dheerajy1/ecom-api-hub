import { login } from "./auth/login.js";
import { logout } from "./auth/logout.js";
import { refreshToken } from "./auth/refresh-token.js";
import { signup } from "./auth/signup.js";

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

import { envSchema } from "../types/global.types.js";

export const env = envSchema.parse(process.env);
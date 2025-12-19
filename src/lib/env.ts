// src/config/env.ts or src/lib/env.ts
import { envSchema } from "@/types/index.js";

export const env = envSchema.parse(process.env);
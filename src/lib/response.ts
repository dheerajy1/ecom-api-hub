import type { Response } from "express";
import type { ZodType } from "zod";

interface SendResponseProps<T> {
  res: Response;
  status: number;
  schema: ZodType<T>;
  payload: T;
}

export function send<T>({
  res,
  status,
  schema,
  payload,
}: SendResponseProps<T>) {
  try {
    // Contract enforcement
    schema.parse(payload);

    return res.status(status).json(payload);
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Internal server error";

    console.error("RESPONSE SCHEMA MISMATCH", err);

    // Fail fast in dev
    if (process.env.NODE_ENV !== "production") {
      throw err;
    }

    // Safe fallback in prod
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: msg,
    });
  }
}

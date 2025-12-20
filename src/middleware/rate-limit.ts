import rateLimit from "express-rate-limit";

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 60,
  standardHeaders: true,  // adds RateLimit headers
  legacyHeaders: false,   // disables X-RateLimit-* legacy headers
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      statusCode: 429,
      error: "Too many requests",
    });
  },
});

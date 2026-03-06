import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || "5"), // 5 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Please try again later.",
  },
});

export const signupLimiter = rateLimit({
  windowMs: parseInt(process.env.SIGNUP_RATE_LIMIT_WINDOW_MS || "3600000"), // 1 hour
  max: parseInt(process.env.SIGNUP_RATE_LIMIT_MAX || "10"),
  message: {
    error: "Too many signup attempts. Try again later.",
  },
});

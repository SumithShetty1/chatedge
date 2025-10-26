import rateLimit from "express-rate-limit";

// ============= STRICT RATE LIMITING ============= //
export const strictChatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // Maximum 3 requests per minute per user
  message: { 
    message: "Too many chat requests. Please wait a minute before sending another message." 
  },
  standardHeaders: true, // Uses IP by default
  legacyHeaders: false
});

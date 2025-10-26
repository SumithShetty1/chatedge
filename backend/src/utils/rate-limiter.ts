import rateLimit from "express-rate-limit";

// ============= STRICT RATE LIMITING ============= //
export const strictChatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 6, // Maximum 6 requests per minute
  message: { 
    message: "Too many chat requests. Please wait a minute before sending another message." 
  },
  standardHeaders: true, // Uses IP by default
  legacyHeaders: false
});

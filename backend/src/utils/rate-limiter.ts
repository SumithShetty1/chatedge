import rateLimit from "express-rate-limit";

// ============= EXPRESS RATE LIMITER ============= //
// Rate limiter middleware for Express routes
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Maximum 10 requests per minute
  message: { 
    message: "Too many requests. Please wait a moment before trying again." 
  },
  standardHeaders: true, // Uses IP by default
  legacyHeaders: false
});


// ============ WEBSOCKET RATE LIMITER ============= //
// In-memory map to track user message counts and timestamps
const userRateMap = new Map();

// Periodic cleanup of old entries in the userRateMap
setInterval(() => {
  const now = Date.now();

  // Remove entries older than 5 minutes
  for (const [userId, data] of userRateMap.entries()) {
    if (now - data.timestamp > 5 * 60 * 1000) {
      userRateMap.delete(userId);
    }
  }
}, 5 * 60 * 1000);

// WebSocket rate limiter function
export function wsRateLimiter(socket) {
    // Get user ID from socket
    const userId = socket.user.id;
    const now = Date.now();

    // Initialize user data if not present
    if (!userRateMap.has(userId)) {
        userRateMap.set(userId, { count: 0, timestamp: now });
    }

    // Retrieve user data
    const userData = userRateMap.get(userId);

    // Reset count if time window has passed
    if (now - userData.timestamp > 60 * 1000) {
        userData.count = 0;
        userData.timestamp = now;
    }

    // Check if user has exceeded rate limit
    if (userData.count >= 6) {
        socket.emit("rate-limit", {
            message: "Too many chat requests. Please wait a minute before sending another message."
        });
        return false; // BLOCK request
    }

    userData.count++;
    return true; // ALLOW request
}

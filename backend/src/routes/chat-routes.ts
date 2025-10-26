import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteChats, generateChatCompletion, sendChatsToUser } from "../controllers/chat-controllers.js";
import { strictChatLimiter } from "../utils/rate-limiter.js";

// Create chat-specific router instance with all routes protected by JWT
const chatRoutes = Router();

// ============= Protected Chat Routes (All require valid JWT) ============= //

// Generate new chat completion (AI response)
chatRoutes.post("/new", validate(chatCompletionValidator), verifyToken, strictChatLimiter,  generateChatCompletion);

// Get all user's chat history
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);

// Delete all user's chats
chatRoutes.delete("/delete", verifyToken, deleteChats);

export default chatRoutes;

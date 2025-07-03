import { Router } from "express";
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";

// Create main router instance
const appRouter = Router();

// ============= Route Mounting ============= //

// All user-related routes will be prefixed with '/user'
// Example: domain/api/v1/user
appRouter.use("/user", userRoutes);

// All chat-related routes will be prefixed with '/chat'
// Example: domain/api/v1/chat
appRouter.use("/chat", chatRoutes);

export default appRouter;

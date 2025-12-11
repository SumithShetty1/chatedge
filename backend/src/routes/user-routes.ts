import { Router } from "express";
import { getAllUsers, userLogin, userLogout, userSignup, verifyUser } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
import { rateLimiter } from "../utils/rate-limiter.js";

// Create user-specific router instance
const userRoutes = Router();

// ============= Public Routes (No Authentication Required) ============= //

// Get all users
userRoutes.get("/", getAllUsers);

// User registration with validation middleware
userRoutes.post("/signup", rateLimiter, validate(signupValidator), userSignup);

// User login with validation middleware
userRoutes.post("/login", rateLimiter, validate(loginValidator), userLogin);


// ============= Protected Routes (Require Valid JWT) ============= //

// Check authentication status (protected by token verification)
userRoutes.get("/auth-status", verifyToken, verifyUser);

// User logout (protected by token verification)
userRoutes.get("/logout", verifyToken, userLogout);

export default userRoutes;

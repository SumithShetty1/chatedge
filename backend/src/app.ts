import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Load environment variables from .env file
config();

// Create Express application instance
const app = express();

// ============= Middleware Configuration ============= //

// Enable CORS with specific origin and credentials
app.use(cors({origin: process.env.CORS_ORIGIN, credentials: true}))

// Parse JSON bodies in requests
app.use(express.json());

// Parse cookies with secret from environment variables
app.use(cookieParser(process.env.COOKIE_SECRET));

// HTTP request logging - only in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============= Route Configuration ============= //

// Mount main router with API version prefix
app.use("/api/v1", appRouter)


export default app;

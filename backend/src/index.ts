import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./sockets/index.js";
import { verifySocketToken } from "./utils/token-manager.js";

// Connections and Listeners
// Server configuration constants
const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Create WebSocket server
export const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
});

// Middleware to verify socket tokens
io.use(verifySocketToken);

// Register socket event handlers
registerSocketHandlers(io);

// Database connection then start both HTTP + WebSocket
connectToDatabase()
    .then(() => {
        httpServer.listen(PORT, () =>
            console.log("HTTP + WebSocket Server Running & Connected To Database")
        );
    })
    .catch(err => console.log(err));

import User from "../models/User.js";
import ChatSession from "../models/ChatSession.js";
import Message from "../models/Message.js";
import { configureGroq } from "../config/groq-config.js";
import { wsRateLimiter } from "../utils/rate-limiter.js";

// Type definition for chat messages
type GroqMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

// Handles chat-related WebSocket events
export const chatSocketHandler = (socket) => {
    socket.on("chat:new", async ({ message }) => {
        try {
            // Apply WebSocket rate limiting
            const allowed = wsRateLimiter(socket);
            if (!allowed) return;

            // Validate incoming message
            if (!message || typeof message !== "string" || message.trim() === "") {
                return socket.emit("chat:error", {
                    message: "Message is required"
                });
            }
            // Extract user ID from verified socket token
            const userId = socket.user.id;

            // Verify authenticated user
            const user = await User.findById(userId);

            // If user not found, emit error
            if (!user) {
                return socket.emit("chat:error", {
                    message: "User not found or authentication failed"
                });
            }

            // Find or create chat session for user
            let chatSession = await ChatSession.findOne({ userId }).sort({ updatedAt: -1 });

            // If no session exists, create a new one
            if (!chatSession) {
                chatSession = await ChatSession.create({
                    userId,
                    title: message.substring(0, 50) + "..."
                });
            } else {
                await ChatSession.findByIdAndUpdate(chatSession._id, {
                    title: message.substring(0, 50) + "...",
                    updatedAt: new Date()
                });
            }

            // Retrieve recent messages for context
            const recentMessages = await Message.find({ sessionId: chatSession._id })
                .sort({ timestamp: -1 })
                .limit(8);

            // Construct chat history for AI prompt
            const chats: GroqMessage[] = [
                {
                    role: "system",
                    content:
                        "You are ChatEdge, an intelligent AI assistant. Never claim that the user previously told you this or that it was discussed earlier."
                },
                ...recentMessages.reverse().map(({ role, content }) => ({
                    role: role as "user" | "assistant" | "system",
                    content
                })),
                { content: message, role: "user" }
            ];

            // Initialize GROQ client
            const groq = configureGroq();

            // Create streaming chat completion request
            const stream = await groq.chat.completions.create({
                messages: chats,
                model: "llama-3.1-8b-instant",
                stream: true
            });

            // Stream AI response tokens back to client
            let finalAIResponse = "";

            // Handle streaming response
            for await (const chunk of stream) {
                // Extract token from chunk
                const token = chunk.choices?.[0]?.delta?.content || "";

                // Append token to final response and emit to client
                if (token) {
                    finalAIResponse += token;
                    socket.emit("assistant:token", token);
                }
            }

            // Save user message and AI response to database
            await Message.insertMany([
                {
                    sessionId: chatSession._id,
                    role: "user",
                    content: message
                },
                {
                    sessionId: chatSession._id,
                    role: "assistant",
                    content: finalAIResponse
                }
            ]);

            // Update chat session's updatedAt timestamp
            await ChatSession.findByIdAndUpdate(chatSession._id, {
                updatedAt: new Date()
            });

            // Notify client that response is complete
            socket.emit("assistant:done", {
                content: finalAIResponse,
                role: "assistant"
            });

        } catch (error) {
            console.error("WebSocket Chat Error:", error);
            socket.emit("chat:error", { message: "Something went wrong" });
        }
    });
};

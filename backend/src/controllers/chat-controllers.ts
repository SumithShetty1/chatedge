import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import ChatSession from "../models/ChatSession.js";
import Message from "../models/Message.js";
import { configureGroq } from "../config/groq-config.js";

// Type definition for chat messages
type GroqMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

// Controller for generating AI chat completions
export const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;

    try {
        const userId = res.locals.jwtData.id;

        // Verify authenticated user
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: "User not registered OR Token malfunctioned" });


        // Find or create chat session for user
        let chatSession = await ChatSession.findOne({ userId }).sort({ updatedAt: -1 });

        if (!chatSession) {
            // Create first chat session for user
            chatSession = await ChatSession.create({
                userId,
                title: message.substring(0, 50) + "..." // Auto-generate title from first message
            });
        } else {
            // Update title with latest user message
            await ChatSession.findByIdAndUpdate(chatSession._id, {
                title: message.substring(0, 50) + "...",
                updatedAt: new Date()
            });
        }

        // Get recent messages from Message collection
        const recentMessages = await Message.find({ sessionId: chatSession._id })
            .sort({ timestamp: -1 })
            .limit(8);

        // Prepare chat history from user's previous chats
        const chats: GroqMessage[] = [
            {
                role: "system",
                content: "You are ChatEdge, an intelligent AI assistant. Never claim that the user previously told you this or that it was discussed earlier."
            },
            ...recentMessages.reverse().map(({ role, content }) => ({
                role: role as 'user' | 'assistant' | 'system',
                content
            })),
            { content: message, role: "user" }
        ];

        // Initialize Groq client
        const groq = configureGroq();

        // Call Groq API with chat history
        const chatResponse = await groq.chat.completions.create({
            messages: chats,
            model: "llama-3.1-8b-instant",
        });

        // Extract assistant's response
        const assistantMessage = {
            content: chatResponse.choices[0]?.message?.content || "",
            role: "assistant"
        };

        // Save messages to Message collection
        await Message.insertMany([
            {
                sessionId: chatSession._id,
                role: "user",
                content: message
            },
            {
                sessionId: chatSession._id,
                role: "assistant",
                content: assistantMessage.content
            }
        ]);

        // Update session timestamp
        await ChatSession.findByIdAndUpdate(chatSession._id, {
            updatedAt: new Date()
        });

        // Return only AI response
        return res.status(200).json({
            assistantMessage: assistantMessage
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Controller to fetch user's chat history
export const sendChatsToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.jwtData.id;

        // Verify authenticated user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }

        // Verify user ID matches token
        if (user._id.toString() !== userId) {
            return res.status(401).send("Permissions didn't match");
        }

        // Find user's most recent chat session
        const chatSession = await ChatSession.findOne({ userId }).sort({ updatedAt: -1 });

        if (!chatSession) {
            // No chats yet for this user
            return res.status(200).json({ message: "OK", chats: [] });
        }

        // Get messages from Message collection
        const messages = await Message.find({ sessionId: chatSession._id })
            .sort({ timestamp: 1 }); // Oldest first for proper chat order

        const chats = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        return res.status(200).json({ message: "OK", chats });

    } catch (error) {
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

// Controller to clear user's chat history
export const deleteChats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.jwtData.id;

        // Verify authenticated user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }

        // Verify user ID matches token
        if (user._id.toString() !== userId) {
            return res.status(401).send("Permissions didn't match");
        }

        // Find user's chat session
        const chatSession = await ChatSession.findOne({ userId }).sort({ updatedAt: -1 });

        if (chatSession) {
            // Delete all messages for this session
            await Message.deleteMany({ sessionId: chatSession._id });
            
            // Reset chat session title and timestamps
            await ChatSession.findByIdAndUpdate(chatSession._id, {
                title: "New Chat",
                updatedAt: new Date()
            });
        }

        return res.status(200).json({ message: "OK" });

    } catch (error) {
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

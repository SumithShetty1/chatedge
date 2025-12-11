import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import ChatSession from "../models/ChatSession.js";
import Message from "../models/Message.js";

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

import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
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
        // Verify authenticated user
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) return res.status(401).json({ message: "User not registered OR Token malfunctioned" });

        // Prepare chat history from user's previous chats
        const chats: GroqMessage[] = [
            {
                role: "system",
                content: "You are ChatEdge, an intelligent AI assistant. Never claim that the user previously told you this or that it was discussed earlier."
            },
            ...user.chats.map(({ role, content }) => ({
                role: role as 'user' | 'assistant' | 'system',
                content
            })),
        ];

        // Add new user message to chat history
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });

        // Initialize Groq client
        const groq = configureGroq();

        // Call Groq API with chat history
        const chatResponse = await groq.chat.completions.create({
            messages: chats,
            model: "llama3-8b-8192",
        });

        // Extract assistant's response
        const assistantMessage = {
            content: chatResponse.choices[0]?.message?.content || "",
            role: "assistant"
        };

        // Save assistant's response to user's chat history
        user.chats.push(assistantMessage);
        await user.save();

        // Return updated chat history
        return res.status(200).json({ chats: user.chats });
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
        // Verify authenticated user
        const user = await User.findById(res.locals.jwtData.id);

        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }

        // Verify user ID matches token
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }

        // Return user's chat history
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

// Controller to clear user's chat history
export const deleteChats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Verify authenticated user
        const user = await User.findById(res.locals.jwtData.id);

        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }

        // Verify user ID matches token
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }

        // Clear chat history
        //@ts-ignore
        user.chats = [];
        await user.save();

        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

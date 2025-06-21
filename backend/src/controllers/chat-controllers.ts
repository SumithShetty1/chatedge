import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { configureGroq } from "../config/groq-config.js";

type GroqMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;

    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) return res.status(401).json({ message: "User not registered OR Token malfunctioned" });

        // Prepare chats
        const chats: GroqMessage[] = user.chats.map(({ role, content }) => ({
            role: role as 'user' | 'assistant' | 'system',
            content
        }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });

        // Initialize Groq client
        const groq = configureGroq();

        // Call Groq API
        const chatResponse = await groq.chat.completions.create({
            messages: chats,
            model: "llama3-8b-8192",
        });

        const assistantMessage = {
            content: chatResponse.choices[0]?.message?.content || "",
            role: "assistant"
        };

        user.chats.push(assistantMessage);
        await user.save();

        return res.status(200).json({ chats: user.chats });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

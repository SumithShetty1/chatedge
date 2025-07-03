import mongoose from "mongoose";
import { randomUUID } from "crypto";

// Schema definition for chat messages
const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID(),  // Auto-generate UUID for each chat
    },
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required:true,
    },
});

// Schema definition for user data
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    chats: [chatSchema],
});

// Create and export User model from schema
export default mongoose.model("User", userSchema);

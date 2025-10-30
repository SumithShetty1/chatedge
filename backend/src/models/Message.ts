import mongoose from "mongoose";
import { randomUUID } from "crypto";

const messageSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID(),
    },
    sessionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ChatSession', 
        required: true 
    },
    role: { 
        type: String, 
        required: true, 
        enum: ['user', 'assistant', 'system'] 
    },
    content: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

// Create and export Message model
export default mongoose.model("Message", messageSchema);

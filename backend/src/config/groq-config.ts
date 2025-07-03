import Groq from "groq-sdk";

// Creates and configures a Groq client instance with API key
export const configureGroq = () => {
    // Initialize Groq SDK with API key from environment variables
    return new Groq({
        apiKey: process.env.GROQ_API_KEY
    });
}

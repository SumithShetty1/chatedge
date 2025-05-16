import Groq from "groq-sdk";

export const configureGroq = () => {
    return new Groq({
        apiKey: process.env.GROQ_API_KEY
    });
}

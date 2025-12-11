import { chatSocketHandler } from "./chat-socket-handler.js";

// Registers all socket event handlers
export const registerSocketHandlers = (io) => {
    io.on("connection", (socket) => {
        console.log("New WebSocket user connected:", socket.user.id);
        chatSocketHandler(socket);
    });
};

import { chatSocketHandler } from "./chat-socket-handler.js";

// Registers all socket event handlers
export const registerSocketHandlers = (io) => {
    io.on("connection", (socket) => {
        // Ensure the socket is authenticated
        if (!socket.user) {
            console.log("Unauthenticated socket blocked.");
            return socket.disconnect();
        }

        console.log("New WebSocket user connected:", socket.user.id);
        chatSocketHandler(socket);
    });
};

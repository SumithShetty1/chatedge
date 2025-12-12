import { io, Socket } from "socket.io-client";
import EventEmitter from "eventemitter3";

// EventEmitter instance to relay socket events
export const chatEvents = new EventEmitter();

// Singleton Socket instance
let socket: Socket | null = null;

// Function to get or create the Socket.IO connection
export const getSocket = () => {
  if (!socket) {

    // Initialize Socket.IO client with auth token
    socket = io(
      import.meta.env.VITE_API_BASE_URL.replace("/api/v1", ""),
      {
        transports: ["websocket"],
        withCredentials: true
      }
    );

    // Set up socket event listeners
    // Handle incoming assistant tokens
    socket.on("assistant:token", (token) => {
      chatEvents.emit("token", token);
    });

    // Handle assistant completion
    socket.on("assistant:done", (data) => {
      chatEvents.emit("done", data);
    });

    // Handle assistant errors
    socket.on("assistant:error", (data) => {
      chatEvents.emit("error", data);
    });

    // Handle rate limit events
    socket.on("rate-limit", (data) => {
      chatEvents.emit("rate-limit", data);
    });
  }

  return socket;
};

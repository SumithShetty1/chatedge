import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Button, IconButton, Typography, CircularProgress } from "@mui/material";
import red from '@mui/material/colors/red';
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from 'react-icons/io';
import { deleteUserChats, getUserChat } from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { getSocket } from "../helpers/socket";
import { useChatStream } from "../hooks/useChatStream";
import type { Socket } from "socket.io-client";

// Type definition for chat messages
type Message = {
  role: "user" | "assistant";
  content: string
};

// Main chat interface component with message history and input
const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize WebSocket connection when user is authenticated
  useEffect(() => {
    if (auth?.isLoggedIn) {
      const s = getSocket();
      setSocket(s);
    }
  }, [auth?.isLoggedIn]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle incoming chat stream tokens
  const handleToken = (token: string) => {
    setChatMessages(prev => {
      const updated = [...prev];
      const last = updated[updated.length - 1];

      if (last?.role === "assistant") {
        // Prevent duplicate token concatenations
        const newContent = last.content + token;

        // If content already contains this new form, ignore it
        if (newContent.endsWith(last.content + token) && last.content.endsWith(token)) {
          return updated; // ignore duplicate
        }

        last.content = newContent;
      }

      return [...updated];
    });
  };

  // Handle errors during chat streaming
  const handleError = (data: { message: string }) => {
    setChatMessages(prev => {
      const updated = [...prev];

      // Remove last two messages: assistant placeholder and user message
      updated.pop();
      const userMessage = updated.pop();

      // Restore user message in input box for resubmission
      if (inputRef.current && userMessage?.role === "user") {
        inputRef.current.value = userMessage.content;
      }

      return updated;
    });

    setIsLoading(false);
    toast.error(data.message);
  };

  // Specific handler for rate limit errors
  const handleRateLimit = handleError;

  // Set up chat stream event handlers
  useChatStream(
    handleToken,
    () => setIsLoading(false),
    handleError,
    handleRateLimit
  );

  // Handles message submission
  const handleSubmit = (content?: string) => {
    const messageContent = content || inputRef.current?.value as string;
    if (!messageContent.trim()) return;

    // Ensure socket is connected
    if (!socket) {
      toast.error("Connecting... Please wait.");
      return;
    }

    // Clear input
    if (inputRef.current) inputRef.current.value = "";

    setIsLoading(true);

    // Add user message and assistant placeholder to chat
    setChatMessages(prev => {
      const updated = [...prev];

      // Avoid duplicate assistant placeholders
      const last = updated[updated.length - 1];
      if (last?.role === "assistant" && last.content === "") return updated;

      return [
        ...updated,
        { role: "user", content: messageContent },
        { role: "assistant", content: "" }
      ];
    });

    // Send to WebSocket
    socket.emit("chat:new", { message: messageContent });
  };

  // Clears all chat history
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      setIsLoading(false);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    }
    catch (err) {
      console.log(err);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  }

  // Loads chat history on component mount
  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth?.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChat().then((data) => {
        setChatMessages([...data.chats]);
        toast.success("Successfully loaded chats", { id: "loadchats" });
      }).catch((err) => {
        console.error(err);
        toast.error("Loading Failed", { id: "loadchats" });
      });
    }
  }, [auth]);

  // Redirects unauthenticated users to login
  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth]);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "calc(100vh - 110px)",
        mt: { md: 3, xs: 3.5, sm: 3 },
        gap: 3,
      }}
    >
      <Box sx={{
        display: { md: "flex", xs: "none", sm: "none" },
        flex: 0.2,
        flexDirection: "column",
      }}>
        <Box
          ref={chatContainerRef}
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: 'white',
              color: 'black',
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]}
            {auth?.user?.name.split(" ")[1] ? auth.user.name.split(" ")[1][0] : ""}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask some questions related to Knowledge, Business, Advices, Education, etc. But avoid sharing personal information
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: 'auto',
              color: 'white',
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear conversation
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flex: { md: 0.8, xs: 1, sm: 1 }, flexDirection: 'column', px: 3 }}>
        <Typography sx={{
          textAlign: "center",
          fontSize: "30px",
          color: "white",
          mx: "auto",
          fontWeight: "600",
        }}
        >
          Model - Llama 3.1-8B Instant
        </Typography>

        <Box
          ref={chatContainerRef}
          sx={{
            width: "100%",
            height: { md: "70vh", sm: "70vh", xs: "67vh" },
            borderRadius: 3,
            mx: 'auto',
            display: 'flex',
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: 'auto',
            scrollBehavior: "smooth",
          }}
        >
          {/* Render all chat messages */}
          {chatMessages.map((chat, index) => (
            //@ts-ignore
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>

        <div style={{
          width: "100%",
          borderRadius: 8,
          backgroundColor: "rgb(17,27,39)",
          display: "flex",
          margin: "auto",
          alignItems: "center",
        }}>
          <input
            ref={inputRef}
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: '20px',
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "18px",
            }}
            placeholder="Type your message..."
          />

          <IconButton
            onClick={() => handleSubmit()}
            disabled={isLoading}
            sx={{
              color: isLoading ? "gray" : "white",
              mx: 1
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : <IoMdSend />}
          </IconButton>

          <IconButton
            onClick={handleDeleteChats}
            disabled={isLoading}
            sx={{
              color: red[300],
              mr: 1,
              display: { md: 'none', xs: 'flex', sm: 'flex' },
              ":hover": {
                color: red.A400,
              }
            }}
            title="Clear conversation"
          >
            <MdDelete />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;

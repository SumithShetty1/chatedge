import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Button, IconButton, Typography, CircularProgress } from "@mui/material";
import red from '@mui/material/colors/red';
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from 'react-icons/io';
import { deleteUserChats, getUserChat, sendChatRequest } from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

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
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Auto-retry for rate limiting
  useEffect(() => {
    if (pendingMessage) {
      const timer = setTimeout(() => {
        handleSubmit(pendingMessage);
      }, 60000); // Retry after 60 seconds
      return () => clearTimeout(timer);
    }
  }, [pendingMessage, isLoading]);

  // Handles sending new chat messages
  const handleSubmit = async (content?: string) => {
    const messageContent = content || inputRef.current?.value as string;

    if (!messageContent.trim()) return;

    // Clear input if this is a new message (not auto-retry)
    if (!content && inputRef.current) {
      inputRef.current.value = "";
    }

    const newMessage: Message = { role: "user", content: messageContent };
    setChatMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    // Safety timeout - reset loading after 70 seconds max
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 70000);

    try {
      const chatData = await sendChatRequest(messageContent);
      setChatMessages([...chatData.chats]);
      setPendingMessage(null); // Clear pending message on success
      setIsLoading(false);
      clearTimeout(safetyTimeout);
    } catch (error: any) {
      // Remove the user message that failed to send
      setChatMessages(prev => prev.slice(0, -1));

      if (error.message.includes("Rate limit exceeded")) {
        // Set up auto-retry after 60 seconds
        setPendingMessage(messageContent);
        // Just continue showing "AI is thinking..."
      } else {
        setIsLoading(false);
        toast.error(error.message);
      }
    }
  };

  // Clears all chat history
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      setPendingMessage(null);
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
        height: "100%",
        mt: 3,
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
          mb: 2,
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
            height: "60vh",
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

          {/* Loading indicator */}
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mx: 2, my: 1 }}>
              <CircularProgress size={20} sx={{ color: "white" }} />
              <Typography sx={{ color: "white", ml: 2 }}>
                AI is thinking...
              </Typography>
            </Box>
          )}
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
              padding: '30px',
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

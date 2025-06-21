import React from "react";
import { Box, Avatar } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';

function extractCodeFromString(message: string) {
    if (message.includes("```")) {
        const blocks = message.split("```");
        return blocks;
    }
}

function isCodeBlock(str: string) {
    if (str.includes("=") || str.includes(";") || str.includes("[") || str.includes("]") || str.includes("{") || str.includes("}") || str.includes("#") || str.includes("//")) {
        return true;
    }

    return false;
}

const ChatItem = ({
    content,
    role,
}: {
    content: string;
    role: "user" | "assistant";
}) => {
    const messageBlocks = extractCodeFromString(content);
    const auth = useAuth();
    return role === "assistant" ? (
        <Box sx={{ display: "flex", p: 2, bgcolor: "#004d5612", my: 2, gap: 2 }}>
            <Avatar sx={{ ml: "0" }}>
                <img src="openai.png" alt="openai" width={"30px"} />
            </Avatar>
            <Box>
                {!messageBlocks && (
                    <Box sx={{ fontSize: "20px", color: "white" }}>
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </Box>
                )}
                {messageBlocks && messageBlocks.length && messageBlocks.map((block) => isCodeBlock(block) ? (
                    <SyntaxHighlighter language="javascript" style={coldarkCold}>
                        {block}
                    </SyntaxHighlighter>
                ) : (
                    <Box sx={{ fontSize: "20px", color: "white" }}>
                        <ReactMarkdown>{block}</ReactMarkdown>
                    </Box>
                )
                )}
            </Box>
        </Box>
    ) : (
        <Box sx={{ display: "flex", p: 2, bgcolor: "#004d56", gap: 2, my: 2 }}>
            <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
                {auth?.user?.name[0]}
                {auth?.user?.name.split(" ")[1] ? auth.user.name.split(" ")[1][0] : ""}
            </Avatar>
            <Box>
                {!messageBlocks && (
                    <Box sx={{ fontSize: "20px", color: "white" }}>
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </Box>
                )}
                {messageBlocks && messageBlocks.length && messageBlocks.map((block) => isCodeBlock(block) ? (
                    <SyntaxHighlighter language="javascript" style={coldarkCold}>
                        {block}
                    </SyntaxHighlighter>
                ) : (
                    <Box sx={{ fontSize: "20px", color: "white" }}>
                        <ReactMarkdown>{block}</ReactMarkdown>
                    </Box>
                )
                )}
            </Box>
        </Box>
    );
};

export default ChatItem;

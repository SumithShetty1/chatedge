import { Box, Avatar } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';

// Extracts code blocks from message using triple backticks
function extractCodeFromString(message: string) {
    if (message.includes("```")) {
        const blocks = message.split("```");
        return blocks;
    }
}

// Detects if a string contains code-like patterns
function isCodeBlock(str: string) {
    if (str.includes("=") || str.includes(";") || str.includes("[") || str.includes("]") || str.includes("{") || str.includes("}") || str.includes("#") || str.includes("//")) {
        return true;
    }

    return false;
}

// Chat message component with code highlighting support
const ChatItem = ({
    content,
    role,
    isLoading
}: {
    content: string;
    role: "user" | "assistant";
    isLoading?: boolean;
}) => {
    const messageBlocks = extractCodeFromString(content);
    const auth = useAuth();

    // Loading indicator for assistant messages
    if (role === "assistant" && isLoading && content === "") {
        return (
            <Box sx={{
                display: "flex",
                p: 2,
                bgcolor: "#004d5612",
                my: 1,
                gap: 2,
                borderRadius: 2,
            }}>
                <Avatar sx={{ ml: "0", bgcolor: "white" }}>
                    <img src="chatedge-logo.png" alt="Logo" width={"30px"} />
                </Avatar>

                <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
                    <span className="dot-typing"></span>
                    <span className="dot-typing" style={{ animationDelay: "0.2s" }}></span>
                    <span className="dot-typing" style={{ animationDelay: "0.4s" }}></span>
                </Box>
            </Box>
        );
    }

    return role === "assistant" ? (
        // Assistant message styling (different background)
        <Box sx={{ display: "flex", p: 2, bgcolor: "#004d5612", my: 1, gap: 2, borderRadius: 2, }}>
            {/* Assistant avatar with logo */}
            <Avatar sx={{ ml: "0", bgcolor: "white" }}>
                <img src="chatedge-logo.png" alt="Logo" width={"30px"} />
            </Avatar>

            {/* Message content container */}
            <Box>
                {/* Render simple message if no code blocks */}
                {!messageBlocks && (
                    <Box sx={{ fontSize: "18px", color: "white" }}>
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </Box>
                )}

                {/* Render parsed message with code highlighting */}
                {messageBlocks && messageBlocks.length && messageBlocks.map((block) => isCodeBlock(block) ? (
                    <SyntaxHighlighter language="javascript" style={coldarkCold}>
                        {block}
                    </SyntaxHighlighter>
                ) : (
                    <Box sx={{ fontSize: "18px", color: "white" }}>
                        <ReactMarkdown>{block}</ReactMarkdown>
                    </Box>
                )
                )}
            </Box>
        </Box>
    ) : (
        // User message styling
        <Box sx={{ display: "flex", p: 2, bgcolor: "#004d56", gap: 2, my: 2, borderRadius: 2, }}>
            {/* User avatar with initials */}
            <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
                {auth?.user?.name[0]}
                {auth?.user?.name.split(" ")[1] ? auth.user.name.split(" ")[1][0] : ""}
            </Avatar>

            {/* Message content container */}
            <Box>
                {/* Render simple message if no code blocks */}
                {!messageBlocks && (
                    <Box sx={{ fontSize: "18px", color: "white" }}>
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </Box>
                )}

                {/* Render parsed message with code highlighting */}
                {messageBlocks && messageBlocks.length && messageBlocks.map((block) => isCodeBlock(block) ? (
                    <SyntaxHighlighter language="javascript" style={coldarkCold}>
                        {block}
                    </SyntaxHighlighter>
                ) : (
                    <Box sx={{ fontSize: "18px", color: "white" }}>
                        <ReactMarkdown>{block}</ReactMarkdown>
                    </Box>
                )
                )}
            </Box>
        </Box>
    );
};

export default ChatItem;

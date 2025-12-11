import axios from "axios";

// Handles user login with email and password
export const loginUser = async (email: string, password: string) => {
    const res = await axios.post("/user/login", { email, password });

    if (res.status === 429) {
        // Handle rate limit specifically
        throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
    }

    if (res.status !== 200) {
        throw new Error("Unable to login");
    }

    const data = await res.data;

    // Store JWT token in local storage for session management
    localStorage.setItem("ws_token", data.token);

    return data;
};

// Registers new user with name, email and password
export const signupUser = async (name: string, email: string, password: string) => {
    const res = await axios.post("/user/signup", { name, email, password });

    if (res.status === 429) {
        // Handle rate limit specifically
        throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
    }

    if (res.status !== 201) {
        throw new Error("Unable to Signup");
    }

    const data = await res.data;

    // Store JWT token in local storage for session management
    localStorage.setItem("ws_token", data.token);

    return data;
};

// Checks if user session is still valid
export const checkAuthStatus = async () => {
    const res = await axios.get("/user/auth-status");

    if (res.status !== 200) {
        throw new Error("Unable to authenticate");
    }

    const data = await res.data;
    return data;
}

// Fetches all user's chat history
export const getUserChat = async () => {
    const res = await axios.get("/chat/all-chats");

    if (res.status !== 200) {
        throw new Error("Unable to get chat");
    }

    const data = await res.data;
    return data;
}

// Clears all user's chat history
export const deleteUserChats = async () => {
    const res = await axios.delete("/chat/delete");

    if (res.status !== 200) {
        throw new Error("Unable to delete chat");
    }

    const data = await res.data;
    return data;
}

// Logs out current user and clears session
export const logoutUser = async () => {
    const res = await axios.get("/user/logout");

    if (res.status !== 200) {
        throw new Error("Unable to delete chat");
    }

    const data = await res.data;
    return data;
}

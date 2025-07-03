import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { compare, hash } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

// Controller to get all users from database
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get all users
        const users = await User.find();
        return res.status(200).json({ message: "OK", users })
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

// Controller for user registration/signup
export const userSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // user signup
        const { name, email, password } = req.body;
        const existinUser = await User.findOne({ email });

        // Check if user already exists
        if (existinUser) {
            return res.status(401).send("User already registered");
        }

        // Hash password before saving
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Clear any existing cookies
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: process.env.COOKIE_DOMAIN,
            httpOnly: true,
            signed: true,
        });

        // Create JWT token valid for 7 days
        const token = createToken(user._id.toString(), user.email, "7d");

        // Set cookie expiration to 7 days
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        // Set secure HTTP-only cookie with token
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: process.env.COOKIE_DOMAIN,
            expires,
            httpOnly: true,
            signed: true,
        });

        // Return success response with user details (excluding password)
        return res.status(201).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

// Controller for user login authentication
export const userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // user login
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(401).send("User not registered");
        }

        // Verify password matches hashed version
        const isPasswordCorrect = await compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(403).send("Incorrect Password");
        }

        // Clear any existing cookies
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: process.env.COOKIE_DOMAIN,
            httpOnly: true,
            signed: true,
        });

        // Create JWT token valid for 7 days
        const token = createToken(user._id.toString(), user.email, "7d");

        // Set cookie expiration to 7 days
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        // Set secure HTTP-only cookie with token
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: process.env.COOKIE_DOMAIN,
            expires,
            httpOnly: true,
            signed: true,
        });

        // Return success response with user details (excluding password)
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

// Controller to verify user authentication status
export const verifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // user token check
        const user = await User.findById(res.locals.jwtData.id);

        // Check if user exists and token is valid
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }

        // Verify token matches user ID
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }

        // Return user details if verification passes
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

// Controller for user logout functionality
export const userLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // user token check
        const user = await User.findById(res.locals.jwtData.id);

        // Verify user exists and token is valid
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }

        // Verify token matches user ID
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }

        // Clear authentication cookie
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: process.env.COOKIE_DOMAIN,
            httpOnly: true,
            signed: true,
        });

        // Return success response
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

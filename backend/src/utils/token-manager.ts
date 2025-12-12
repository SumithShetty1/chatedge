import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import signature from "cookie-signature";
import { COOKIE_NAME } from "./constants.js";

// Creates a JWT token with user ID and email payload
export const createToken = (id: string, email: string, expiresIn: string) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,   // Sets token expiration time
    });

    return token;
};

// Middleware to verify JWT token from cookies
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    // Extract token from signed cookies
    const token = req.signedCookies[`${COOKIE_NAME}`];

    // Check if token exists and is not empty
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token Not Received" });
    }

    // Verify token asynchronously
    return new Promise<void>((resolve, reject) => {
        return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
            if (err) {
                reject(err.message);
                return res.status(401).json({ message: "Token Expired" });
            } else {
                resolve();
                res.locals.jwtData = success;   // Attach decoded token data to response
                return next();  // Proceed to next middleware
            }
        });
    });
};

// Middleware to verify JWT token from Socket.IO handshake cookies
export const verifySocketToken = (socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie;

        // Check if cookies are present
        if (!cookieHeader) {
            return next(new Error("No cookies attached to WebSocket handshake"));
        }

        const cookies = cookie.parse(cookieHeader);

        const signedCookie = cookies[COOKIE_NAME];

        // Check if the auth cookie is present
        if (!signedCookie) {
            return next(new Error("Auth cookie missing"));
        }

        // Remove "s:" prefix if present
        const raw = signedCookie.startsWith("s:")
            ? signedCookie.slice(2)
            : signedCookie;

        const unsigned = signature.unsign(raw, process.env.COOKIE_SECRET);

        // Check if unsigning was successful
        if (!unsigned) {
            return next(new Error("Invalid signed cookie"));
        }

        // Verify JWT token
        const decoded = jwt.verify(unsigned, process.env.JWT_SECRET);

        // Attach decoded token data to socket object
        socket.user = decoded;

        next();
    } catch (err) {
        next(new Error("Invalid or expired token"));
    }
};

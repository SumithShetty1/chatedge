import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
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
    if(!token || token.trim() === "") {
        return res.status(401).json({message: "Token Not Received"});
    }

        // Verify token asynchronously
    return new Promise<void>((resolve, reject) => {
        return jwt.verify(token, process.env.JWT_SECRET, (err, success)=>{
            if(err) {
                reject(err.message);
                return res.status(401).json({message: "Token Expired"});
            } else {
                resolve();
                res.locals.jwtData = success;   // Attach decoded token data to response
                return next();  // Proceed to next middleware
            }
        });
    });
};

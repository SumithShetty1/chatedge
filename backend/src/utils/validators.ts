import { NextFunction, Request, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";

// Middleware to run validation chains and handle errors
export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Execute each validation in sequence
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;  // Stop at first validation error
            }
        }

        // Check for validation errors
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();  // Proceed if no errors
        }

        // Return validation errors with 422 status
        return res.status(422).json({ errors: errors.array() });
    };
};

// Validation rules for login endpoint
export const loginValidator = [
    body("email").trim().isEmail().withMessage("Email is required"),    // Validate email format
    body("password").trim().isLength({ min: 6 }).withMessage("Password should contain atleast 6 characters"), // Validate password length
];

// Validation rules for signup endpoint (includes login validations)
export const signupValidator = [
    body("name").notEmpty().withMessage("Name is required"),    // Validate name presence
    ...loginValidator,  // Include all login validations
];

// Validation rules for chat completion endpoint
export const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Message is required"),  // Validate message presence
];

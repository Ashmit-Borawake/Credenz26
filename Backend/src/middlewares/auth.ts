import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

interface JwtPayload {
    username: string
    isJunior:boolean
    email:string
    userType:string
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check for token in Authorization header or cookies
        const authHeader = req.headers['authorization'];
        const token = req.cookies?.token || authHeader?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ error: "Access denied. No token provided." });
        }

        console.log(token)

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET is missing in environment variables");
            return res.status(500).json({ error: "Internal server error" });
        }

        console.log("Verifying token with secret:", secret)
        
        const decoded = jwt.verify(token, secret) as JwtPayload;
        
        console.log("Verified token with secret:", secret)

        console.log("decoded",decoded)
        if (!decoded) {
            return res.status(400).json({ error: "Invalid token payload" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(407).json({ error: "Invalid or expired token" });
    }
};

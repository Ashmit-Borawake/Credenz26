import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    username: string
    isJunior:boolean
    email:boolean
    userType:string
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Authorizing roles:", allowedRoles);
      const authHeader = req.headers['authorization'];
      const token = req.cookies?.token || authHeader?.split(' ')[1];

      if (!token) {
        return res.status(400).json({ error: "Access denied. No token provided." });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ error: "JWT secret missing" });
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;

      console.log("Decoded JWT:", decoded);

      if (!decoded || !decoded.userType) {
        return res.status(400).json({ error: "Invalid token" });
      }

      if (!allowedRoles.includes(decoded.userType)) {
        return res.status(403).json({ error: "You are not authorized" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(407).json({ error: "Invalid or expired token" });
    }
  };
};

import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { NextFunction, Request, Response } from "express";

// Extend Express Request type to include userId
interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const userMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];

    console.log(req.route?.path);
    console.log(token);

    if (!token) {
        res.status(403).json({ message: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as { role: string; userId: string };
        req.userId = decoded.userId; // ✅ Now properly typed without `any`
        next(); // ✅ Ensure next() is always called
    } catch (e) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

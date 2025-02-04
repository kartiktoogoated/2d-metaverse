import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { NextFunction, Request, Response } from "express";

const sendUnauthorizedResponse = (res: Response, status: number = 403) => {
    res.status(status).json({ message: "Unauthorized" });
};

const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_PASSWORD) as { userId: string };
    } catch {
        return null;
    }
};

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {    
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];

    if (!token) return sendUnauthorizedResponse(res, 401); 

    const decoded = verifyToken(token);
    if (!decoded) return sendUnauthorizedResponse(res, 401); 

    req.userId = decoded.userId; 
    next();
};

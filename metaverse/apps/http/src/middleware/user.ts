import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { Request, Response, NextFunction } from "express";

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  console.log("Auth route:", req.route?.path);
  console.log("Token:", token);

  if (!token) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_PASSWORD) as {
      userId: string;
      role: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("JWT verify failed:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

import cors from "cors";
import { Request, Response, NextFunction } from "express";

export const corsMiddleware = cors({
  origin: "http://localhost:5173", // Your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies/auth headers
});

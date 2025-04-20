import cors from "cors";

export const corsMiddleware = cors({
  origin: [
    "http://kartiktoogoated.s3-website-us-east-1.amazonaws.com", 
    "http://localhost:5173", 
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
});

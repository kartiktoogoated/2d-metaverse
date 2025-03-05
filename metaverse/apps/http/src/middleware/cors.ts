import cors from "cors";

export const corsMiddleware = cors({
  origin: [
    "http://kartiktoogoated.s3-website-us-east-1.amazonaws.com", // ✅ S3 Fron>
    "http://localhost:5173", // ✅ Local Development
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // ✅ Allow cookies & auth tokens
});

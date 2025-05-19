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

/*import cors from "cors";

export const corsMiddleware = cors({

  origin: ["https://meta2d.me", "https://www.meta2d.me"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization"
  ],
  exposedHeaders: ["Authorization"],
  optionsSuccessStatus: 200
}); */

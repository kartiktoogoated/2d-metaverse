import express from "express";
import { router } from "./routes/v1"; // Make sure this path is correct
import { chatbotRouter } from "./chatbot";
import { corsMiddleware } from "./middleware/cors";
import 'dotenv/config'; // Ensure environment variables are loaded

const app = express();

app.use(corsMiddleware);
app.use(express.json());

// Mount the main API router at /api/v1
app.use("/api/v1", router);

// Optionally, if you have a separate chatbot route:
app.use("/api/v1/chatbot", chatbotRouter);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on AWS at http://18.215.159.145:${PORT}`);
});

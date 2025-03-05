import express from "express";
import { router } from "./routes/v1"; // ✅ Import main API router
import { chatbotRouter } from "./chatbot"; // ✅ Import chatbot separately
import { corsMiddleware } from "./middleware/cors"; // ✅ Import CORS middleware

const app = express();

app.use(corsMiddleware); // ✅ Apply CORS middleware globally
app.use(express.json()); // ✅ Parse JSON requests

// ✅ Register Main API Routes
app.use("/api/v1", router);

// ✅ Register Chatbot Route
app.use("/api/v1/chatbot", chatbotRouter); // ✅ This ensures that chatbot.ts works

// ✅ Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on AWS at http://18.215.159.145:${PORT}`);
});

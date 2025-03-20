import express from "express";
import { router } from "./routes/v1"; // ✅ Correct import of routes
import { chatbotRouter } from "./chatbot";
import { corsMiddleware } from "./middleware/cors";
import 'dotenv/config';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use("/api/v1", router);  // ✅ This ensures /api/v1/livekit is accessible
app.use("/api/v1/chatbot", chatbotRouter);

app._router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    console.log(`Route found: ${r.route.path}`);
  }
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on AWS at http://18.215.159.145:${PORT}`);
});

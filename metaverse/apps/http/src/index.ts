import express from "express";
import "dotenv/config";
import { router as apiRouter } from "./routes/v1";
import { chatbotRouter } from "./chatbot";
import { corsMiddleware } from "./middleware/cors";
import { info } from "./utils/logger";

const app = express();
app.use(corsMiddleware);
app.use(express.json());

app.use("/api/v1", apiRouter);
app.use("/api/v1/chatbot", chatbotRouter);

info("Registered routes:");
app._router.stack.forEach((layer: any) => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(",");
    info(`  ${methods} ${layer.route.path}`);
  }
});

const PORT = process.env.PORT ?? 3002;
const BASE = process.env.API_BASE_URL ?? "http://localhost";
app.listen(PORT, () => {
  info(`Server running at ${BASE}:${PORT}`);
});

export { app };

import { Router, Request, Response } from "express";
import { info, warn, error } from "./utils/logger";

export const chatbotRouter = Router();

chatbotRouter.get("/test", (_req: Request, res: Response) => {
  info("Chatbot test route hit");
  res.json({ message: "Chatbot API is working!" });
});

chatbotRouter.post(
  "/run",
  async (req: Request, res: Response): Promise<void> => {
    const { input, chatbot_name = "metaverse", username = "kartiktoogoated", conversation_id = null } =
      req.body;

    if (!input) {
      warn("Chatbot /run called without input");
      res.status(400).json({ error: "Input is required" });
      return;
    }

    try {
      info(`Calling VectorShift API (chatbot=${chatbot_name}, user=${username})`);
      const response = await fetch("https://api.vectorshift.ai/api/chatbots/run", {
        method: "POST",
        headers: {
          "Api-Key": process.env.VECTORSHIFT_API_KEY ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, chatbot_name, username, conversation_id }),
      });

      if (!response.ok) {
        error(`VectorShift API responded with ${response.status}`);
        res.status(502).json({ error: "Bad response from chatbot service" });
        return;
      }

      const data = await response.json();
      info("VectorShift API call successful");
      res.json(data);
    } catch (err: any) {
      error(`Error calling VectorShift API: ${err.message}`);
      res.status(500).json({ error: "Failed to call chatbot." });
    }
  }
);

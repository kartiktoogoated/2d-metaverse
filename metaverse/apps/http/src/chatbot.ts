import { Router, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const chatbotRouter = Router();

// ✅ Add a Test Route
chatbotRouter.get("/test", (req: Request, res: Response) => {
  res.json({ message: "Chatbot API is working!" });
});

// ✅ Proxy Request to VectorShift API (Run Chatbot)
chatbotRouter.post("/run", async (req: Request, res: Response): Promise<void> => {
  try {
    const { input, chatbot_name, username, conversation_id } = req.body;

    const response = await fetch("https://api.vectorshift.ai/api/chatbots/run", {
      method: "POST",
      headers: {
        "Api-Key": process.env.VECTORSHIFT_API_KEY ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        chatbot_name: chatbot_name || "metaverse",
        username: username || "kartiktoogoated",
        conversation_id: conversation_id || null,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Error calling VectorShift API:", error);
    res.status(500).json({ error: "Failed to call chatbot." });
  }
});

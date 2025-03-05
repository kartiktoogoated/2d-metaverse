import express from "express";
import { router } from "./routes/v1";
import { corsMiddleware } from "./middleware/cors"; // ✅ Import CORS Middlewa>

const app = express();

app.use(corsMiddleware); // ✅ Apply CORS Middleware

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1", router);

// ✅ Set Correct Port for AWS Deployment
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on AWS at http://18.215.159.145:${PORT}`);
});
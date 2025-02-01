import express from "express";
import { router } from "./routes/v1";

const app = express();

app.use("/api/v1", router)

app.listen(3000)
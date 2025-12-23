import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import path from "path";
import helmet from "helmet";

//router imports
import documentRouter from "./routes/document.routes";
import authRouter from "./routes/auth.routes";

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(cors({ origin: ["http://localhost:5173","https://document-saver.vercel.app"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable ETag for API endpoints to prevent 304 responses
app.set("etag", false);

//file upload static folder
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes

app.use("/core-api/documents", documentRouter);
app.use("/core-api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("कागजातSack server is running");
});

export default app;

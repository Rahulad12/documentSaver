import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import helmet from "helmet";

//router imports
import documentRouter from "./routes/document.routes";
import authRouter from "./routes/auth.routes";
import { multerErrorHandler } from "./middlewares/multerError.middleware";

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://document-saver.vercel.app",
      "http://localhost:5174",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multerErrorHandler);

// Disable ETag for API endpoints to prevent 304 responses
app.set("etag", false);

// Routes
app.use("/core-api/documents", documentRouter);
app.use("/core-api/auth", authRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "कागजातSack server is running",
    status: "ok",
  });
});

export default app;

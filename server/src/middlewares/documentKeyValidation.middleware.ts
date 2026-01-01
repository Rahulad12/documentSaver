import { Request, Response, NextFunction } from "express";
import User from "@/models/Users";
import logger from "@/utils/logger";

export const validateDocumentAccessKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get key from body (for POST requests) or headers (for GET requests)
    const documentAccessKey =
      req.body?.documentAccessKey ||
      req.headers["x-document-access-key"];

    const userId = req.user?.sub;

    if (!documentAccessKey) {
      return res.status(400).json({
        success: false,
        message: "Document access key is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      logger.warn("User not found", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.documentAccessKey !== documentAccessKey) {
      logger.warn("Invalid document access key for user", userId);
      return res.status(401).json({
        success: false,
        message: "Invalid document access key",
      });
    }

    next();
  } catch (error) {
    logger.error("Error validating document access key", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

import logger from "@/utils/logger";
import { Request, Response } from "express";

/**
 * Controller just returns a success message
 * All decryption and file serving is handled by decryptAndServeFile middleware
 */
const serveDocumentById = async (req: Request, res: Response) => {
  // This controller is a placeholder - actual work is done in the middleware
  logger.info("Document served successfully");
};

export default serveDocumentById;

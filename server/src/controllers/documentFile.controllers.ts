import Document from "@/models/Document";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { decryptFile } from "@/utils/encryption.util";
import logger from "@/utils/logger";

const serveDocumentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  logger.info("Serving document", id);
  try {
    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Ownership check (VERY IMPORTANT)
    if (doc.userId.toString() !== req.user?.sub) {
      return res.status(403).json({ message: "Access denied" });
    }

    const absolutePath = path.join(process.cwd(), doc.fileUrl);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Decrypt the file
    const decryptedBuffer = await decryptFile(absolutePath);

    const ext = path.extname(absolutePath).toLowerCase();

    // Set proper content type and headers
    res.setHeader("Content-Disposition", "inline");

    // Remove .enc extension for content type detection
    const originalExt = ext.replace(".enc", "");

    if (originalExt === ".pdf") {
      res.setHeader("Content-Type", "application/pdf");
    } else if ([".jpg", ".jpeg"].includes(originalExt)) {
      res.setHeader("Content-Type", "image/jpeg");
    } else if (originalExt === ".png") {
      res.setHeader("Content-Type", "image/png");
    } else if (originalExt === ".webp") {
      res.setHeader("Content-Type", "image/webp");
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
    }
    logger.info("File served successfully");
    // Send decrypted buffer
    res.status(200).send(decryptedBuffer);
  } catch (error) {
    logger.error("Error serving document:", error);
    console.error("Error serving document:", error);
    res.status(500).json({ message: "Failed to serve document" });
  }
};

export default serveDocumentById;

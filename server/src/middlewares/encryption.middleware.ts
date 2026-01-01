import { Request, Response, NextFunction } from "express";
import { encryptFile } from "@/utils/encryption.util";
import fs from "fs/promises";
import logger from "@/utils/logger";
import crypto from "crypto";
import https from "https";
import Document from "@/models/Document";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Middleware to encrypt uploaded files
 * Should be used after multer middleware
 */
export const encryptUploadedFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Encryption middleware called");
  console.log("Request file:", req.file?.originalname);
  console.log("Request body:", req.body);
  if (!req.file) {
    console.log("No file uploaded");
    return next();
  }
  try {
    const originalPath = req.file.path;
    const encryptedPath = `${originalPath}.enc`;

    // Encrypt the file
    await encryptFile(originalPath, encryptedPath);
    logger.info("File encrypted successfully");
    // Delete the original unencrypted file
    await fs.unlink(originalPath);

    // Update req.file to point to encrypted file
    req.file.path = encryptedPath;
    req.file.filename = `${req.file.filename}.enc`;

    next();
  } catch (error) {
    console.log("Error encrypting uploaded file:", error);

    // Clean up the original file if it still exists
    try {
      if (req.file?.path) {
        await fs.unlink(req.file.path);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up file:", cleanupError);
    }
    console.error("Failed to encrypt uploaded file");
    return res.status(500).json({
      success: false,
      message: "Failed to encrypt uploaded file",
    });
  }
};

/**
 * Decrypt buffer using AES-256-GCM
 */
const decryptBuffer = (encryptedBuffer: Buffer): Buffer => {
  const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");

  // Extract IV (first 16 bytes)
  const iv = encryptedBuffer.subarray(0, IV_LENGTH);

  // Extract auth tag (last 16 bytes)
  const authTag = encryptedBuffer.subarray(
    encryptedBuffer.length - AUTH_TAG_LENGTH
  );

  // Extract encrypted data (everything in between)
  const encrypted = encryptedBuffer.subarray(
    IV_LENGTH,
    encryptedBuffer.length - AUTH_TAG_LENGTH
  );

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};

/**
 * Download file from URL
 */
const downloadFile = (url: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks)));
        response.on("error", reject);
      })
      .on("error", reject);
  });
};

/**
 * Get file MIME type based on extension
 */
const getContentType = (mimeType: string): string => {
  const mimeMap: { [key: string]: string } = {
    "image/jpeg": "image/jpeg",
    "image/png": "image/png",
    "image/webp": "image/webp",
    "application/pdf": "application/pdf",
    "application/msword": "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel": "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };

  return mimeMap[mimeType] || "application/octet-stream";
};

/**
 * Middleware to decrypt and serve document files from Cloudinary
 */
export const decryptAndServeFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query;
  const { side } = req.query;
  const fileSide = (side as string) || "front";
  logger.info("Decrypting and serving document", id, "side:", fileSide);

  try {
    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Ownership check (VERY IMPORTANT)
    if (doc.userId.toString() !== req.user?.sub) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get the appropriate file URL and MIME type based on side
    let fileUrl: string;
    let mimeType: string;
    if (fileSide === "back") {
      fileUrl = doc.fileUrlBack;
      mimeType = doc.mimeTypeBack || doc.mimeTypeFront;
    } else {
      fileUrl = doc.fileUrlFront;
      mimeType = doc.mimeTypeFront;
    }

    if (!fileUrl) {
      return res.status(404).json({ message: "File not found" });
    }

    // Download encrypted file from Cloudinary
    const downloadUrl = fileUrl.startsWith("http")
      ? fileUrl
      : `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/${fileUrl}`;

    const encryptedBuffer = await downloadFile(downloadUrl);

    // Decrypt the file
    const decryptedBuffer = decryptBuffer(encryptedBuffer);

    // Set proper content type and headers
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Content-Type", getContentType(mimeType));

    logger.info("File served successfully");
    // Send decrypted buffer
    res.status(200).send(decryptedBuffer);
  } catch (error) {
    logger.error("Error serving document:", error);
    console.error("Error serving document:", error);
    res.status(500).json({ message: "Failed to serve document" });
  }
};

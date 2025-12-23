import { Request, Response, NextFunction } from "express";
import { encryptFile } from "@/utils/encryption.util";
import fs from "fs/promises";

/**
 * Middleware to encrypt uploaded files
 * Should be used after multer middleware
 */
export const encryptUploadedFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("encryptUploadedFile");
  if (!req.file) {
    console.log("No file uploaded");
    return next();
  }
  console.log(req.file);
  try {
    const originalPath = req.file.path;
    const encryptedPath = `${originalPath}.enc`;

    // Encrypt the file
    const file = await encryptFile(originalPath, encryptedPath);
    console.log(file);
    // Delete the original unencrypted file
    await fs.unlink(originalPath);

    // Update req.file to point to encrypted file
    req.file.path = encryptedPath;
    req.file.filename = `${req.file.filename}.enc`;

    next();
  } catch (error) {
    console.error("Error encrypting uploaded file:", error);

    // Clean up the original file if it still exists
    try {
      if (req.file?.path) {
        await fs.unlink(req.file.path);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up file:", cleanupError);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to encrypt uploaded file",
    });
  }
};

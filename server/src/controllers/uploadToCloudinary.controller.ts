import cloudinary from "@/config/cloudinary.config";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypt buffer using AES-256-GCM
 */
const encryptBuffer = (buffer: Buffer): Buffer => {
  const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  
  // Return IV + encrypted data + auth tag
  return Buffer.concat([iv, encrypted, authTag]);
};

export const uploadToCloudinary = (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    try {
      // Encrypt the file buffer before uploading
      const encryptedBuffer = encryptBuffer(file.buffer);

      cloudinary.uploader
        .upload_stream(
          {
            folder: "document",
            resource_type: "auto", // image, pdf, doc
            access_mode: "authenticated", // private by default
          },
          (error, result) => {
            if (error) return reject(error);

            resolve({
              id: result?.public_id,
              url: result?.secure_url,
              format: result?.format,
              bytes: result?.bytes,
            });
          }
        )
        .end(encryptedBuffer);
    } catch (error) {
      reject(error);
    }
  });
};

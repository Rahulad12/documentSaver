import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import logger from "./logger";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 16 bytes for AES
const AUTH_TAG_LENGTH = 16; // 16 bytes for GCM auth tag

/**
 * Get the encryption key from environment variables
 * @returns Buffer containing the encryption key
 * @throws Error if encryption key is not configured or invalid
 */
export const getEncryptionKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      "ENCRYPTION_KEY is not configured in environment variables"
    );
  }

  // Convert hex string to buffer
  const keyBuffer = Buffer.from(key, "hex");

  if (keyBuffer.length !== 32) {
    throw new Error(
      "ENCRYPTION_KEY must be 32 bytes (64 hex characters) for AES-256"
    );
  }

  return keyBuffer;
};

/**
 * Encrypt a file using AES-256-GCM
 * @param inputPath Path to the file to encrypt
 * @param outputPath Path where encrypted file will be saved
 * @returns Promise that resolves when encryption is complete
 */
export const encryptFile = async (
  inputPath: string,
  outputPath: string
): Promise<void> => {
  logger.info("Encrypting file:", inputPath);
  logger.info("Output path:", outputPath);
  console.log(inputPath);
  console.log(outputPath);
  try {
    // Read the file
    const fileBuffer = await fs.readFile(inputPath);

    // Generate a random IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // Get encryption key
    const key = getEncryptionKey();

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt the file
    const encrypted = Buffer.concat([
      cipher.update(fileBuffer),
      cipher.final(),
    ]);
    logger.info("Encrypted file:", encrypted);
    console.log(encrypted);
    // Get the auth tag
    const authTag = cipher.getAuthTag();
    console.log(authTag);
    logger.info("Auth tag:", authTag);
    // Combine IV + encrypted data + auth tag
    const result = Buffer.concat([iv, encrypted, authTag]);
    console.log(result);

    // Write encrypted file
    await fs.writeFile(outputPath, result);
  } catch (error) {
    console.error("Error encrypting file:", error);
    throw new Error(`Failed to encrypt file: ${error}`);
  }
};

/**
 * Decrypt a file using AES-256-GCM
 * @param inputPath Path to the encrypted file
 * @returns Promise that resolves with decrypted file buffer
 */
export const decryptFile = async (inputPath: string): Promise<Buffer> => {
  try {
    // Read the encrypted file
    const encryptedBuffer = await fs.readFile(inputPath);

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

    // Get encryption key
    const key = getEncryptionKey();

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    // Decrypt the file
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted;
  } catch (error) {
    console.error("Error decrypting file:", error);
    throw new Error(`Failed to decrypt file: ${error}`);
  }
};

/**
 * Generate a random encryption key (for setup/initialization)
 * @returns Hex-encoded 32-byte key
 */
export const generateEncryptionKey = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

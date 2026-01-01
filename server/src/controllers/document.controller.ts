import Document, { type IDocument } from "@/models/Document";
import logger from "@/utils/logger";
import { Request, Response } from "express";
import { uploadToCloudinary } from "./uploadToCloudinary.controller";

export const uploadDocument = async (req: Request, res: Response) => {
  logger.info("Uploading document");

  // Check if files are present (front and back)
  if (!req.files || typeof req.files !== "object") {
    return res.status(400).json({
      success: false,
      message: "No files uploaded",
    });
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Get front file (required)
  const frontFile = files.front?.[0];
  if (!frontFile) {
    return res.status(400).json({
      success: false,
      message: "Front file is required",
    });
  }

  // Get back file (optional)
  const backFile = files.back?.[0];
  try {
    // Upload front file to Cloudinary
    const uploadedFront: any = await uploadToCloudinary(frontFile);
    const frontUrl = uploadedFront.url;
    const trimmedFrontUrl = frontUrl.split("raw")[1];

    // Upload back file if provided
    let trimmedBackUrl = trimmedFrontUrl;
    if (backFile) {
      const uploadedBack: any = await uploadToCloudinary(backFile);
      const backUrl = uploadedBack.url;
      trimmedBackUrl = backUrl.split("raw")[1];
    }

    await Document.create({
      userId: req.user?.sub,
      title: req.body.title,
      description: req.body.description,
      documentType: req.body.documentType,
      documentNumber: req.body.documentNumber,
      documentIssuedAt: req.body.documentIssuedAt,
      documentExpiryAt: req.body.documentExpiryAt,
      fileUrlFront: trimmedFrontUrl,
      fileUrlBack: trimmedBackUrl,
      mimeTypeFront: frontFile.mimetype,
      mimeTypeBack: backFile?.mimetype,
    });

    logger.info("Document uploaded successfully");
    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
    });
  } catch (error) {
    logger.error("Error uploading document", error);
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyDocuments = async (req: Request, res: Response) => {
  logger.info("Fetching documents for user", req.user?.sub);
  try {
    const docs = await Document.find({ userId: req.user?.sub })
      .select("-__v -updatedAt")
      .sort({ createdAt: -1 });
    if (docs.length === 0) {
      logger.warn("No documents found for this user", req.user?.sub);
      return res.status(404).json({
        success: false,
        message: "No documents found for this user",
      });
    }
    logger.info("Documents fetched successfully", docs);
    res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      data: docs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const getDocumentById = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const doc = await Document.findById(req.params.id).select(
      "-__v -updatedAt"
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Document fetched successfully",
      data: doc,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

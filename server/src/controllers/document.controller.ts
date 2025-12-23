import Document, { type IDocument } from "@/models/Document";
import logger from "@/utils/logger";
import { Request, Response } from "express";

export const uploadDocument = async (req: Request, res: Response) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }
  const { filename } = req.file;
  req.body.fileUrl = `/uploads/${filename}`;
  try {
    const doc = await Document.create({
      userId: req.user?.sub,
      title: req.body.title,
      description: req.body.description,
      documentType: req.body.documentType,
      documentNumber: req.body.documentNumber,
      documentIssuedAt: req.body.documentIssuedAt,
      documentExpiryAt: req.body.documentExpiryAt,
      fileUrl: req.body.fileUrl,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: doc,
    });
  } catch (error) {
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

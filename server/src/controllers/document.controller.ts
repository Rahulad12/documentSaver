import Document, { type IDocument } from "@/models/Document";
import { Request, Response } from "express";
import { request } from "node:http";

export const uploadDocument = async (req: Request, res: Response) => {
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
  try {
    const docs = await Document.find({ userId: req.user?.sub })
      .select("-__v -updatedAt")
      .sort({ createdAt: -1 });
    if (docs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No documents found for this user",
      });
    }
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

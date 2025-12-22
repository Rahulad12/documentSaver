import Document from "@/models/Document";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

const serveDocumentById = async (req: Request, res: Response) => {
  const { id } = req.params;

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

    const ext = path.extname(absolutePath).toLowerCase();

    // Set proper content type and headers
    res.setHeader("Content-Disposition", "inline");

    if (ext === ".pdf") {
      res.setHeader("Content-Type", "application/pdf");
    } else if ([".jpg", ".jpeg"].includes(ext)) {
      res.setHeader("Content-Type", "image/jpeg");
    } else if (ext === ".png") {
      res.setHeader("Content-Type", "image/png");
    } else if (ext === ".webp") {
      res.setHeader("Content-Type", "image/webp");
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
    }

    res.status(200).sendFile(absolutePath);
  } catch (error) {
    console.error("Error serving document:", error);
    res.status(500).json({ message: "Failed to serve document" });
  }
};

export default serveDocumentById;

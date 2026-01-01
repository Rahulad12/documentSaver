import mongoose from "mongoose";

export interface IDocument extends mongoose.Document {
  userId: string;
  title: string;
  description: string;
  documentType:
    | "citizenship"
    | "nid"
    | "passport"
    | "license"
    | "academic"
    | "other";
  documentNumber: string;
  documentIssuedAt: Date;
  documentExpiryAt: Date;
  fileUrlFront: string;
  fileUrlBack: string;
  mimeTypeFront: string;
  mimeTypeBack?: string;
}

const DocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    documentType: {
      type: String,
      enum: ["citizenship", "nid", "passport", "license", "academic", "other"],
      required: true,
    },
    documentNumber: {
      type: String,
      required: false,
    },
    documentIssuedAt: {
      type: Date,
      required: false,
    },
    documentExpiryAt: {
      type: Date,
      required: false,
    },

    fileUrlFront: {
      type: String,
      required: true,
    },
    fileUrlBack: {
      type: String,
      required: false,
    },
    mimeTypeFront: {
      type: String,
      required: true,
    },
    mimeTypeBack: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Document = mongoose.model<IDocument>("Document", DocumentSchema);
export default Document;

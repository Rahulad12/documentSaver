import {
  getDocumentById,
  getMyDocuments,
  uploadDocument,
} from "@/controllers/document.controller";
import { Authenticate } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/upload.middleware";
import { encryptUploadedFile } from "@/middlewares/encryption.middleware";
import express from "express";
import { validateDocumentRequest } from "@/utils/ValidatorDefinations";
import { validate } from "@/middlewares/validate";
import serveDocumentById from "@/controllers/documentFile.controllers";

const documentRouter = express.Router();

documentRouter.post(
  "/",
  Authenticate,
  upload.single("document"),
  encryptUploadedFile,
  validateDocumentRequest,
  validate,
  uploadDocument
);

documentRouter.get("/file/:id", Authenticate, serveDocumentById);

documentRouter.get("/", Authenticate, getMyDocuments);

documentRouter.get("/:id", Authenticate, getDocumentById);

export default documentRouter;

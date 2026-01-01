import {
  getDocumentById,
  getMyDocuments,
  uploadDocument,
} from "@/controllers/document.controller";
import { Authenticate } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/upload.middleware";
import express from "express";
import { validateDocumentRequest } from "@/utils/ValidatorDefinations";
import { validate } from "@/middlewares/validate";
import serveDocumentById from "@/controllers/documentFile.controllers";
import { decryptAndServeFile } from "@/middlewares/encryption.middleware";
import { validateDocumentAccessKey } from "@/middlewares/documentKeyValidation.middleware";

const documentRouter = express.Router();

documentRouter.post(
  "/",
  Authenticate,
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  validateDocumentRequest,
  validate,
  uploadDocument
);

documentRouter.get(
  "/file",
  Authenticate,
  decryptAndServeFile,
  serveDocumentById
);

documentRouter.get("/", Authenticate, validateDocumentAccessKey, getMyDocuments);

documentRouter.get("/:id", Authenticate, validateDocumentAccessKey, getDocumentById);

export default documentRouter;

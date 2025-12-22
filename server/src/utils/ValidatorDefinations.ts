import { body } from "express-validator";

export const validateUserRegisterRequest = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
export const validateUserLoginRequest = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const validateDocumentRequest = [
  body("title").notEmpty().withMessage("Title is required"),
  body("documentType").notEmpty().withMessage("Document type is required"),
  body().custom((_, { req }) => {
    if (!req.file) {
      throw new Error("Document file is required");
    }
    return true;
  }),
];

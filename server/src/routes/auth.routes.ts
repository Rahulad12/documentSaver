import express from "express";
import { login, register, getProfile } from "../controllers/auth.controller";
import { Authenticate } from "../middlewares/auth.middleware";
import {
  validateUserLoginRequest,
  validateUserRegisterRequest,
} from "@/utils/ValidatorDefinations";
import { validate } from "@/middlewares/validate";

const authRouter = express.Router();

authRouter.post("/register", validateUserRegisterRequest, validate, register);
authRouter.post("/login", validateUserLoginRequest, validate, login);
authRouter.get("/profile/:id", Authenticate, getProfile);

export default authRouter;

import User from "@/models/Users";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "@/utils/tokenGenerator";
import logger from "@/utils/logger";
import crypto from "crypto";

// Generate a random access key for documents
const generateAccessKey = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  logger.info("Registering user", email);
  try {
    let user = await User.findOne({
      email,
    });
    if (user) {
      logger.warn("User already exists", email);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const documentAccessKey = generateAccessKey();

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      documentAccessKey,
    });

    logger.info("User registered successfully", user);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      documentAccessKey: documentAccessKey,
    });
  } catch (error) {
    logger.error("Error registering user", error);
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  logger.info("Logging in user", email);
  console.log(email, password);
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      logger.warn("User not found", email);
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn("Invalid credentials", email);
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    logger.info("User logged in successfully", user);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      profile: {
        id: user._id,
      },
      access_token: generateToken(user),
    });
  } catch (error) {
    logger.error("Error logging in user", error);
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    logger.info("Fetching user profile", req.user?.sub);
    const user = await User.findById(req.user?.sub).select(
      "-password -__v -createdAt -updatedAt -_id -documentAccessKey"
    );
    if (!user) {
      logger.warn("User not found", req.user?.sub);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    logger.info("User profile fetched successfully", user);
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    logger.error("Error fetching user profile", error);
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

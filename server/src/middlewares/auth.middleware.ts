import { JwtTokenPayload } from "@/types";
import logger from "@/utils/logger";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const Authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    logger.info("User not authenticated , no token or valid token");
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    logger.info("User authenticated successfully");
    req.user = decoded as JwtTokenPayload;
    next();
  } catch {
    logger.info("User not authenticated , no token or valid token");
    return res.status(401).json({ message: "Not authorized" });
  }
};

import { JwtTokenPayload } from "@/types";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const Authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const token = req?.cookies?.access_token;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = decoded as JwtTokenPayload;
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized" });
  }
};

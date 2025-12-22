import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
      };
    }
  }
}

export interface JwtTokenPayload extends JwtPayload {
  sub: string;
  email: string;
}

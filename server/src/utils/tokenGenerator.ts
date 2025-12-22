import { IUser } from "@/models/Users";
import jwt from "jsonwebtoken";

export const generateToken = (user: IUser) => {
  const secrete_key: string | undefined = process.env.JWT_SECRET;
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    secrete_key as string,
    {
      expiresIn: "30d",
    }
  );
};

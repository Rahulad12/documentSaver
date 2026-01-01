import mongoose, { Schema } from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  documentAccessKey: string;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    documentAccessKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const User = mongoose.model<IUser>("User", UserSchema);
export default User;

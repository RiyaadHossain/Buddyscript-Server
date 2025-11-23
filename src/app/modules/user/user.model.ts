import { USER_ROLES } from "@/enums/user.js";
import type { IUser, UserMethods, UserModel } from "./user.interface.js";
import { Schema, model } from "mongoose";


// Step 1: Define Schema
const userSchema = new Schema<IUser, UserModel, UserMethods>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    toJSON: { virtuals: true },
  }
);

// Step 2: Create Model
export const User = model<IUser, UserModel>(
  "User",
  userSchema
);

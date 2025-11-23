import type { IUser } from "./user.interface.js";
import { Schema, model } from "mongoose";


// Step 1: Define Schema
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
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
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
      unique: true,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
);

// Step 2: Create Model
export const User = model<IUser>(
  "User",
  userSchema
);

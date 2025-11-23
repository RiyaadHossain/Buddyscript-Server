import type { Types } from "mongoose";

interface IComment {
  author: Types.ObjectId;
  post: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { IComment };

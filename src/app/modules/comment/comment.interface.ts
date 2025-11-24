import type { Types } from "mongoose";

interface IComment {
  author: Types.ObjectId;
  post: Types.ObjectId;
  text: string;
  parentComment?: Types.ObjectId;
  repliesCount: number;
  likesCount: number;
  reactions: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

interface ICommentPayload {
  post: string;
  text: string;
  parentComment?: string;
}

export type { IComment, ICommentPayload };

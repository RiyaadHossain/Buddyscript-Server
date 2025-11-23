import type { Types } from "mongoose";

export enum ENUM_POST_PRIVACY {
  PUBLIC = "public",
  FRIENDS_ONLY = "friends_only",
  PRIVATE = "private",
}

interface IPost {
  author: Types.ObjectId;
  text?: string;
  imageUrl?: string;
  privacy: ENUM_POST_PRIVACY;
  likesCount: number;
  commentsCount: number;
  reactions: Record<string, number>;
  firstComment: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type { IPost };

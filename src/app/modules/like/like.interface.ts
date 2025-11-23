import type { Types } from "mongoose";

export enum ENUM_REACTION_TYPE {
  LIKE = "like",
  LOVE = "love",
  HAHA = "haha",
  WOW = "wow",
  SAD = "sad",
  ANGRY = "angry",
}

export enum TARGET_TYPE {
  POST = "Post",
  COMMENT = "Comment",
  REPLY = "Reply",
}

export interface ILike {
  likedBy: Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: TARGET_TYPE;
  reaction: ENUM_REACTION_TYPE;
}

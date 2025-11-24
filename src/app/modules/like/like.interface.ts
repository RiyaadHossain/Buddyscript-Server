import type { Types } from "mongoose";

export enum ENUM_REACTION_TYPE {
  LIKE = "like",
  LOVE = "love",
  HAHA = "haha",
  WOW = "wow",
  SAD = "sad",
  ANGRY = "angry",
}

export enum ENUM_TARGET_TYPE {
  POST = "post",
  COMMENT = "comment",
  REPLY = "reply",
}

export interface ILike {
  likedBy: Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: ENUM_TARGET_TYPE;
  reaction: ENUM_REACTION_TYPE;
}

import {
  ENUM_REACTION_TYPE,
  ENUM_TARGET_TYPE,
  type ILike,
} from "@/app/modules/like/like.interface.js";
import { model, Schema } from "mongoose";

const likeSchema = new Schema<ILike>(
  {
    likedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: {
      type: String,
      enum: Object.values(ENUM_TARGET_TYPE),
      required: true,
    },

    reaction: {
      type: String,
      enum: Object.values(ENUM_REACTION_TYPE),
      default: ENUM_REACTION_TYPE.LIKE,
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.index({ likedBy: 1, targetId: 1, targetType: 1 }, { unique: true });

export const Like = model("Like", likeSchema);

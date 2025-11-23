import {
  ENUM_POST_PRIVACY,
  type IPost,
} from "@/app/modules/post/post.interfaces.js";
import mongoose, { Schema } from "mongoose";

const postSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    imageUrl: { type: String },
    privacy: {
      type: String,
      enum: Object.keys(ENUM_POST_PRIVACY),
      default: ENUM_POST_PRIVACY.PUBLIC,
    },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    reactions: { type: Map, of: Number, default: {} },
    firstComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", postSchema);

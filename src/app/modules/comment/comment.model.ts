import type { IComment } from "@/app/modules/comment/comment.interface.js";
import { Schema, model } from "mongoose";

const commentSchema = new Schema<IComment>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    text: { type: String, required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment" },
    repliesCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    reactions: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

export const Comment = model<IComment>("Comment", commentSchema);

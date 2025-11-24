import { Like } from "@/app/modules/like/like.model.js";
import { Post } from "@/app/modules/post/post.model.js";
import { Comment } from "@/app/modules/comment/comment.model.js";
import { User } from "@/app/modules/user/user.model.js";
import {
  ENUM_REACTION_TYPE,
  TARGET_TYPE,
} from "@/app/modules/like/like.interface.js";

const resolveUserId = async (user: any) => {
  if (!user) return null;
  if (user._id) return user._id;
  if (user.email) {
    const found = await User.findOne({ email: user.email }).select("_id");
    return found?._id || null;
  }
  return null;
};

const like = async (payload: any, user: any) => {
  const authorId = await resolveUserId(user);
  if (!authorId) throw new Error("Unable to determine user");

  const targetType = payload.targetType || TARGET_TYPE.POST;
  const reaction = payload.reaction || ENUM_REACTION_TYPE.LIKE;

  const existing = await Like.findOne({
    likedBy: authorId,
    targetId: payload.targetId,
    targetType,
  });

  // If exists and same reaction -> idempotent
  if (existing) {
    if (existing.reaction === reaction) return existing;

    // reaction changed -> update reactions map counts on target (if post)
    const oldReaction = existing.reaction;
    existing.reaction = reaction;
    await existing.save();

    if (targetType === TARGET_TYPE.POST) {
      await Post.findByIdAndUpdate(payload.targetId, {
        $inc: {
          [`reactions.${oldReaction}`]: -1,
          [`reactions.${reaction}`]: 1,
        },
      });
      return existing;
    }

    await Comment.findByIdAndUpdate(payload.targetId, {
      $inc: {
        [`reactions.${oldReaction}`]: -1,
        [`reactions.${reaction}`]: 1,
      },
    });

    return existing;
  }

  // create new like
  const created = await Like.create({
    likedBy: authorId,
    targetId: payload.targetId,
    targetType,
    reaction,
  });

  if (targetType === TARGET_TYPE.POST) {
    await Post.findByIdAndUpdate(payload.targetId, {
      $inc: { likesCount: 1, [`reactions.${reaction}`]: 1 },
    });
    return created;
  }

  await Comment.findByIdAndUpdate(payload.targetId, {
    $inc: { likesCount: 1, [`reactions.${reaction}`]: 1 },
  });

  return created;
};

const unlike = async (
  payload: { targetId: string; targetType?: TARGET_TYPE },
  user: any
) => {
  const authorId = await resolveUserId(user);
  if (!authorId) throw new Error("Unable to determine user");

  const targetType = payload.targetType || TARGET_TYPE.POST;

  const deleted = await Like.findOneAndDelete({
    likedBy: authorId,
    targetId: payload.targetId,
    targetType,
  });
  if (!deleted) return false;

  if (targetType === TARGET_TYPE.POST) {
    // decrement counts for post
    await Post.findByIdAndUpdate(payload.targetId, {
      $inc: { likesCount: -1, [`reactions.${deleted.reaction}`]: -1 },
    });

    // ensure non-negative likesCount
    const post = await Post.findById(payload.targetId).select(
      "likesCount reactions"
    );
    if (post && post.likesCount && post.likesCount < 0) {
      post.likesCount = 0;
      await post.save();
    }
    return true;
  }

  // decrement counts for comment
  await Comment.findByIdAndUpdate(payload.targetId, {
    $inc: { likesCount: -1, [`reactions.${deleted.reaction}`]: -1 },
  });

  const comment = await Comment.findById(payload.targetId).select(
    "likesCount reactions"
  );
  if (comment && comment.likesCount && comment.likesCount < 0) {
    comment.likesCount = 0;
    await comment.save();
  }

  return true;
};

export const LikeService = {
  like,
  unlike,
};

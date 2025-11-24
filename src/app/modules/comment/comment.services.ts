import { Comment } from "@/app/modules/comment/comment.model.js";
import { User } from "@/app/modules/user/user.model.js";
import { Post } from "@/app/modules/post/post.model.js";
import { paginationHelpers } from "@/helpers/pagination-helper.js";
import type { IPaginationOptions } from "@/interfaces/pagination.js";
import type { ICommentPayload } from "@/app/modules/comment/comment.interface.js";

const getComments = async (postId: string, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const total = await Comment.countDocuments({ post: postId });
  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "firstName lastName email");

  return {
    meta: { page, limit, total },
    data: comments,
  };
};

const createComment = async (payload: ICommentPayload, user: any) => {
  let authorId = null;
  if (user?.email) {
    const found = await User.findOne({ email: user.email }).select("_id");
    authorId = found?._id;
  }

  if (!authorId) throw new Error("Unable to determine comment author");

  const post = await Post.findById(payload.post);
  if (!post) throw new Error("Post not found");

  // If it's a reply, ensure parent comment exists
  let parent = null;
  if (payload.parentComment) {
    parent = await Comment.findById(payload.parentComment);
    if (!parent) throw new Error("Parent comment not found");

    // Increment parent's repliesCount
    parent.repliesCount += 1;
    await parent.save();
  }

  const created = await Comment.create({
    author: authorId,
    post: payload.post,
    text: payload.text,
    parentComment: payload.parentComment || null,
  });

  // increment commentsCount and set firstComment if missing
  post.commentsCount += 1;
  if (!post.firstComment) post.firstComment = created._id;
  await post.save();

  return created;
};

const deleteComment = async (id: string, user: any) => {
  const comment = await Comment.findById(id);
  if (!comment) throw new Error("Comment not found");

  const authorId = comment.author?.toString?.();
  let userId = null;
  if (user.email) {
    const found = await User.findOne({ email: user.email }).select("_id");
    userId = found?._id;
  }

  if (!userId || authorId !== userId.toString())
    throw new Error("You are not authorized to delete this comment");

  const postId = comment.post as any;
  await Comment.deleteMany({ parentComment: id }); // delete replies
  const deletedComment = await Comment.findByIdAndDelete(id);

  if (deletedComment?.parentComment)
    await Comment.findByIdAndUpdate(deletedComment.parentComment, {
      $inc: { repliesCount: -1 },
    });

  const post = await Post.findById(postId);
  if (post) {
    post.commentsCount = Math.max(0, post.commentsCount - 1);

    // if deleted comment was firstComment, set to latest comment or null
    if (post.firstComment && post.firstComment.toString() === id) {
      const latest = await Comment.findOne({ post: postId })
        .sort({ createdAt: -1 })
        .select("_id");
      post.firstComment = latest ? latest._id : null;
    }
    await post.save();
  }

  return deletedComment;
};

export const CommentService = {
  getComments,
  createComment,
  deleteComment,
};

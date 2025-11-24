import { Post } from "@/app/modules/post/post.model.js";
import { paginationHelpers } from "@/helpers/pagination-helper.js";
import type { IPaginationOptions } from "@/interfaces/pagination.js";
import { User } from "@/app/modules/user/user.model.js";
import { uploadToImgBB } from "@/helpers/fileUploader.js";
import { Like } from "@/app/modules/like/like.model.js";
import { TARGET_TYPE } from "@/app/modules/like/like.interface.js";
import { Comment } from "@/app/modules/comment/comment.model.js";
import { buildCommentTree } from "@/app/modules/post/post.helper.js";

const getPosts = async (options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const sort: Record<string, number> = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  const total = await Post.countDocuments();
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "firstName lastName email")
    .populate("firstComment");

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: posts,
  };
};

const createPost = async (payload: any, user: any) => {
  let authorId = null;
  if (user?.email) {
    const found = await User.findOne({ email: user.email }).select("_id");
    authorId = found?._id;
  }

  if (!authorId) throw new Error("Unable to determine post author");

  payload.imageUrl = uploadToImgBB(payload.image);

  const created = await Post.create({ ...payload, author: authorId });
  return created;
};

const deletePost = async (id: string, user: any) => {
  const post = await Post.findById(id);
  if (!post) throw new Error("Post not found");

  const authorId = post.author?.toString?.();
  const userId = (await User.findOne({ email: user?.email }).select("_id"))
    ?._id;

  if (!userId || authorId !== userId.toString())
    throw new Error("You are not authorized to delete this post");

  const deletedPost = await Post.findByIdAndDelete(id);
  return deletedPost;
};

const getLikes = async (postId: string) => {
  const likes = await Like.find({
    targetId: postId,
    targetType: TARGET_TYPE.POST,
  }).populate("likedBy", "firstName lastName email");

  return likes;
};

const getComments = async (postId: string) => {
  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: 1 }) // oldest to newest helps tree building
    .populate("author", "firstName lastName email");

  return buildCommentTree(comments);
};

export const PostService = {
  getPosts,
  createPost,
  deletePost,
  getLikes,
  getComments,
};

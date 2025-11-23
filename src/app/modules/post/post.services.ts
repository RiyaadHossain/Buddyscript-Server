import { PostModel } from "@/app/modules/post/post.model.js";
import { paginationHelpers } from "@/helpers/pagination-helper.js";
import type { IPaginationOptions } from "@/interfaces/pagination.js";
import { User } from "@/app/modules/user/user.model.js";
import { uploadToImgBB } from "@/helpers/fileUploader.js";

const getPosts = async (options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const sort: Record<string, number> = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  const total = await PostModel.countDocuments();
  const posts = await PostModel.find()
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

  const created = await PostModel.create({ ...payload, author: authorId });
  return created;
};

const deletePost = async (id: string, user: any) => {
  const post = await PostModel.findById(id);
  if (!post) throw new Error("Post not found");

  const authorId = post.author?.toString?.();
  const userId = (await User.findOne({ email: user?.email }).select("_id"))
    ?._id;

  if (!userId || authorId !== userId.toString())
    throw new Error("You are not authorized to delete this post");

  const deletedPost = await PostModel.findByIdAndDelete(id);
  return deletedPost;
};

export const PostService = {
  getPosts,
  createPost,
  deletePost,
};

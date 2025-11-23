import { PostService } from "@/app/modules/post/post.services.js";
import catchAsync from "@/shared/catch-async.js";
import sendResponse from "@/shared/send-response.js";
import type { Request, Response } from "express";

const getPosts = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, any>;
  const page = query["page"] ? Number(query["page"]) : 1;
  const limit = query["limit"] ? Number(query["limit"]) : 10;
  const { meta, data } = await PostService.getPosts({ page, limit });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Posts retrieved successfully",
    meta,
    data,
  });
});

const createPost = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  if (req.file) payload.image = req.file.path;

  const data = await PostService.createPost(payload, user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Post created successfully",
    data,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const user = req.user;
  await PostService.deletePost(id, user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Post deleted successfully",
    data: null,
  });
});

export const PostController = {
  getPosts,
  createPost,
  deletePost,
};

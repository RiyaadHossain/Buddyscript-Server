import { CommentService } from "@/app/modules/comment/comment.services.js";
import catchAsync from "@/shared/catch-async.js";
import sendResponse from "@/shared/send-response.js";
import type { Request, Response } from "express";

const getComments = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, any>;
  const postId = query["post"] as string;
  const page = query["page"] ? Number(query["page"]) : 1;
  const limit = query["limit"] ? Number(query["limit"]) : 10;

  const { meta, data } = await CommentService.getComments(postId, {
    page,
    limit,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comments retrieved successfully",
    meta,
    data,
  });
});

const createComment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as { post: string; text: string };
  const user = req.user;
  const data = await CommentService.createComment(payload, user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment created successfully",
    data,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const user = req.user;
  await CommentService.deleteComment(id, user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment deleted successfully",
    data: null,
  });
});

export const CommentController = {
  getComments,
  createComment,
  deleteComment,
};

import { LikeService } from "@/app/modules/like/like.services.js";
import catchAsync from "@/shared/catch-async.js";
import sendResponse from "@/shared/send-response.js";
import type { Request, Response } from "express";

const like = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as {
    targetId: string;
    targetType?: string;
    reaction?: string;
  };
  const user = req.user;
  const data = await LikeService.like(payload as any, user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Liked successfully",
    data,
  });
});

const unlike = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as { targetId: string; targetType?: string };
  const user = req.user;
  const data = await LikeService.unlike(payload as any, user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: data ? "Unliked successfully" : "No like found",
    data,
  });
});

export const LikeController = {
  like,
  unlike,
};

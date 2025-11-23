import { userSearchAndFilterFields } from "@/app/modules/user/user.constants.js";
import { UserService } from "@/app/modules/user/user.services.js";
import paginationFields from "@/constants/pagination.js";
import catchAsync from "@/shared/catch-async.js";
import pick from "@/shared/pick.js";
import sendResponse from "@/shared/send-response.js";
import { type Request, type Response } from "express";
import status from "http-status";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const searchableFields = pick(req.query, userSearchAndFilterFields);
  const data = await UserService.getAllUsers(paginationOptions, searchableFields);

  const responseData = {
    statusCode: status.OK,
    success: true,
    message: "Users retrieved successfully",
    data: data.users,
    meta: data.meta,
  };
  sendResponse(res, responseData);
});

export const UserController = {
  getAllUsers,
};

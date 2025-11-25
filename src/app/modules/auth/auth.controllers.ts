import { AuthService } from "@/app/modules/auth/auth.services.js";
import catchAsync from "@/shared/catch-async.js";
import sendResponse from "@/shared/send-response.js";
import type { Request, Response } from "express";

const signup = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const data = await AuthService.signup(payload);

  const responseData = {
    statusCode: 200,
    success: true,
    message: "Signup successful",
    data,
  };
  sendResponse(res, responseData);
});

const login = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const data = await AuthService.login(payload);

  const responseData = {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data,
  };
  sendResponse(res, responseData);
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const data = await AuthService.forgetPassword(payload);

  const responseData = {
    statusCode: 200,
    success: true,
    message: "Check your email for password reset instructions",
    data,
  };
  return sendResponse(res, responseData);
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const data = await AuthService.resetPassword(payload);
  const responseData = {
    statusCode: 200,
    success: true,
    message: "Password reset successful",
    data,
  };
  sendResponse(res, responseData);
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await AuthService.getMe(user);
  
  const responseData = {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  };

  sendResponse(res, responseData);
});

export const AuthController = {
  signup,
  login,
  forgetPassword,
  resetPassword,
  getMe,
};

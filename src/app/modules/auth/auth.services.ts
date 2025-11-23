import type { IUser } from "@/app/modules/user/user.interface.js";
import { User } from "@/app/modules/user/user.model.js";
import configs from "@/configs/index.js";
import { sendEmail } from "@/helpers/emailSender.js";
import { jwtHelpers } from "@/helpers/jwt-helper.js";
import { resetPasswordTemplate } from "@/views/emailTemplates.js";
import type { LoginPayload } from "@modules/auth/auth.interface.js";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

const signup = async (payload: IUser) => {
  const userExists = await User.findOne({ email: payload.email });
  if (userExists) throw new Error("User with this email already exists");

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  payload.password = hashedPassword;

  const newUser = await User.create(payload);
  return newUser;
};

const login = async (payload: LoginPayload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw new Error("Invalid email or password");

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");

  const token = jwtHelpers.createToken(
    { email: user.email },
    configs.JWT_SECRET as string,
    configs.JWT_EXPIRES_IN as string
  );

  return { token, user };
};

const forgetPassword = async (payload: any) => {
  const email = payload.email;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User with this email does not exist");

  const resetToken = randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await user.save();

  const resetPasswordUrl = `${configs.CLIENT_URL}?token=${resetToken}`;
  sendEmail({
    to: user.email,
    subject: "Password Reset Request", html: resetPasswordTemplate(resetPasswordUrl)})

};

const resetPassword = async (payload: any) => {
  const { token, newPassword } = payload;
  
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) throw new Error("Invalid or expired password reset token");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return true;
};

export const AuthService = {
  signup,
  forgetPassword,
  login,
  resetPassword,
};

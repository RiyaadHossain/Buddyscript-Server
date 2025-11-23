import z from "zod/v3";

const signupSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters long" }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  }),
});

const forgetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().nonempty({ message: "Token is required" }),
  }),
});

export const AuthValidation = {
  signupSchema,
  forgetPasswordSchema,
  loginSchema,
  resetPasswordSchema,
};

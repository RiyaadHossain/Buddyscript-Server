import z from "zod/v3";
import {
  ENUM_REACTION_TYPE,
  TARGET_TYPE,
} from "@/app/modules/like/like.interface.js";

const likeSchema = z.object({
  body: z.object({
    targetId: z.string().nonempty({ message: "Target id is required" }),
    targetType: z
      .string()
      .optional()
      .refine((v) => !v || Object.values(TARGET_TYPE).includes(v as any), {
        message: "Invalid target type",
      }),
    reaction: z
      .string()
      .optional()
      .refine(
        (v) => !v || Object.values(ENUM_REACTION_TYPE).includes(v as any),
        {
          message: "Invalid reaction",
        }
      ),
  }),
});

const unlikeSchema = z.object({
  body: z.object({
    targetId: z.string().nonempty({ message: "Target id is required" }),
    targetType: z
      .string()
      .optional()
      .refine((v) => !v || Object.values(TARGET_TYPE).includes(v as any), {
        message: "Invalid target type",
      }),
  }),
});

export const LikeValidation = {
  likeSchema,
  unlikeSchema,
};

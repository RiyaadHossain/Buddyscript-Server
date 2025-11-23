import z from "zod/v3";

const createCommentSchema = z.object({
  body: z.object({
    post: z.string().nonempty({ message: "Post id is required" }),
    text: z.string().min(1, { message: "Text is required" }),
  }),
});

const deleteCommentSchema = z.object({
  params: z.object({
    id: z.string().nonempty({ message: "Comment id is required" }),
  }),
});

export const CommentValidation = {
  createCommentSchema,
  deleteCommentSchema,
};

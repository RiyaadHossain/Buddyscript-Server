import z from "zod/v3";

const createPostSchema = z.object({
  body: z.object({
    text: z.string().optional(),
    imageUrl: z.string().url().optional(),
  }),
});


const deletePostSchema = z.object({
  params: z.object({
    id: z.string().nonempty({ message: "Post id is required" }),
  }),
});

export const PostValidation = {
  createPostSchema,
  deletePostSchema,
};

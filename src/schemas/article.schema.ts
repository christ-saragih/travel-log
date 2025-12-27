import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cover_image_url: z
    .string()
    .url("Cover image must be a valid URL")
    .min(1, "Cover image URL is required"),
  category: z.string().optional(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

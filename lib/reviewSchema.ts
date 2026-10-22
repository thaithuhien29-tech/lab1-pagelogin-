import { z } from "zod";

export const reviewSchema = z.object({
  product_id: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(500),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

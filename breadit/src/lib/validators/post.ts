import { z } from 'zod';

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must contain at least 3 characters' })
    .max(128, { message: 'Title must not contain over 128 characters' }),
  subredditId: z.string(),
  content: z.any()
});

export type PostCreationRequest = z.infer<typeof PostValidator>;

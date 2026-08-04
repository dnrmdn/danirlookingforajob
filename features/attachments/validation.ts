import { z } from 'zod';

export const createAttachmentMetadataSchema = z.object({
  filename: z.string().min(1, 'Filename cannot be empty').trim(),
  mimeType: z.string().optional(),
  size: z.number().int().positive().optional(),
});

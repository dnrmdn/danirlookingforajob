import { z } from 'zod';

export const createReminderSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').trim(),
  reminderDate: z.string().datetime('Must be a valid ISO datetime string'),
  completed: z.boolean().default(false).optional(),
});

export const updateReminderSchema = createReminderSchema.partial();

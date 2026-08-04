import { z } from 'zod';
import { createReminderSchema, updateReminderSchema } from './validation';

export type CreateReminderRequest = z.infer<typeof createReminderSchema>;
export type UpdateReminderRequest = z.infer<typeof updateReminderSchema>;

export interface ReminderResponse {
  id: string;
  title: string;
  reminderDate: string;
  completed: boolean;
  applicationId: string | null;
  createdAt: string;
  updatedAt: string;
}

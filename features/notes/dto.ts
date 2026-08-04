import { z } from 'zod';
import { createNoteSchema, updateNoteSchema } from './validation';

export type CreateNoteRequest = z.infer<typeof createNoteSchema>;
export type UpdateNoteRequest = z.infer<typeof updateNoteSchema>;

export interface NoteResponse {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

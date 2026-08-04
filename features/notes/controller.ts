import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { NoteQueryService } from './query.service';
import { NoteCommandService } from './command.service';
import { createNoteSchema, updateNoteSchema } from './validation';
import { NoteMapper } from './mapper';
import { apiResponse } from '@/lib/shared/api-response';
import { ValidationError } from '@/lib/shared/errors';

const queryService = new NoteQueryService();
const commandService = new NoteCommandService();

export class NoteController {
  static async getByApplication(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = await requireAuth();
      const notes = await queryService.getNotesForApplication(userId, params.id);
      const responseData = notes.map(NoteMapper.toResponse);
      return apiResponse.success(responseData);
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async create(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = await requireAuth();
      const body = await req.json();

      const validationResult = createNoteSchema.safeParse(body);
      if (!validationResult.success) {
        throw new ValidationError("Invalid note data", validationResult.error.flatten().fieldErrors);
      }

      const created = await commandService.createNote(userId, params.id, validationResult.data);
      return apiResponse.success(NoteMapper.toResponse(created), "Note created successfully", undefined, 201);
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string; noteId: string } }) {
    try {
      const userId = await requireAuth();
      const body = await req.json();

      const validationResult = updateNoteSchema.safeParse(body);
      if (!validationResult.success) {
        throw new ValidationError("Invalid note data", validationResult.error.flatten().fieldErrors);
      }

      const updated = await commandService.updateNote(userId, params.id, params.noteId, validationResult.data);
      return apiResponse.success(NoteMapper.toResponse(updated), "Note updated successfully");
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async delete(req: NextRequest, { params }: { params: { id: string; noteId: string } }) {
    try {
      const userId = await requireAuth();
      await commandService.deleteNote(userId, params.id, params.noteId);
      return apiResponse.success(null, "Note deleted successfully");
    } catch (error) {
      return apiResponse.error(error);
    }
  }
}

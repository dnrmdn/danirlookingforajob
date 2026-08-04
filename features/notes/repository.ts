import { prisma } from '@/lib/db/prisma';
import { NoteEntity } from './domain/entity';
import { Note } from '@prisma/client';

export class NoteRepository {
  private mapToEntity(model: Note): NoteEntity {
    return {
      id: model.id,
      content: model.content,
      applicationId: model.applicationId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  async findById(id: string): Promise<NoteEntity | null> {
    const note = await prisma.note.findFirst({
      where: { id, deletedAt: null },
    });
    return note ? this.mapToEntity(note) : null;
  }

  async findByApplicationId(applicationId: string): Promise<NoteEntity[]> {
    const notes = await prisma.note.findMany({
      where: { applicationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return notes.map(this.mapToEntity);
  }
}

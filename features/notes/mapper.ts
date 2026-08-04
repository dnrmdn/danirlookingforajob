import { NoteEntity } from './domain/entity';
import { NoteResponse } from './dto';

export class NoteMapper {
  static toResponse(entity: NoteEntity): NoteResponse {
    return {
      id: entity.id,
      content: entity.content,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}

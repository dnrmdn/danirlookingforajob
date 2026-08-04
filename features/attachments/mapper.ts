import { AttachmentEntity } from './domain/entity';
import { AttachmentResponse } from './dto';

export class AttachmentMapper {
  static toResponse(entity: AttachmentEntity): AttachmentResponse {
    return {
      id: entity.id,
      filename: entity.filename,
      url: entity.url,
      mimeType: entity.mimeType,
      size: entity.size,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}

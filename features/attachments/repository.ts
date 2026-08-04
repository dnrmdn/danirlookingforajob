import { prisma } from '@/lib/db/prisma';
import { AttachmentEntity } from './domain/entity';
import { Attachment } from '@prisma/client';

export class AttachmentRepository {
  private mapToEntity(model: Attachment): AttachmentEntity {
    return {
      id: model.id,
      filename: model.filename,
      url: model.url,
      mimeType: model.mimeType,
      size: model.size,
      applicationId: model.applicationId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  async findById(id: string): Promise<AttachmentEntity | null> {
    const attachment = await prisma.attachment.findFirst({
      where: { id, deletedAt: null },
    });
    return attachment ? this.mapToEntity(attachment) : null;
  }

  async findByApplicationId(applicationId: string): Promise<AttachmentEntity[]> {
    const attachments = await prisma.attachment.findMany({
      where: { applicationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return attachments.map(this.mapToEntity);
  }
}

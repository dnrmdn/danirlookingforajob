import { prisma } from '@/lib/db/prisma';
import { AttachmentEntity } from './domain/entity';
import { AttachmentRepository } from './repository';
import { ApplicationRepository } from '../applications/repository';
import { NotFoundError, AppError } from '@/lib/shared/errors';
import { DomainEventBus } from '../activity/listener';
import { storageService } from '../storage/service';

export class AttachmentCommandService {
  private repository: AttachmentRepository;
  private appRepository: ApplicationRepository;

  constructor() {
    this.repository = new AttachmentRepository();
    this.appRepository = new ApplicationRepository();
  }

  async uploadAttachment(
    userId: string,
    applicationId: string,
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    size: number
  ): Promise<AttachmentEntity> {
    const app = await this.appRepository.findById(userId, applicationId);
    if (!app) {
      throw new NotFoundError('Application not found');
    }

    // 1. Upload to storage provider
    const url = await storageService.upload(fileBuffer, filename, mimeType);

    try {
      // 2. Save record in database
      const attachment = await prisma.attachment.create({
        data: {
          applicationId,
          filename,
          url,
          mimeType,
          size,
        },
      });

      // 3. Emit Domain Event
      DomainEventBus.emit('attachment.uploaded', {
        userId,
        applicationId,
        attachmentId: attachment.id,
      });

      return (await this.repository.findById(attachment.id))!;
    } catch (error) {
      // If DB fails, attempt to rollback storage upload
      await storageService.delete(url).catch(() => {});
      throw new AppError('Failed to save attachment metadata to database', 500);
    }
  }

  async deleteAttachment(userId: string, applicationId: string, attachmentId: string): Promise<void> {
    const app = await this.appRepository.findById(userId, applicationId);
    if (!app) {
      throw new NotFoundError('Application not found');
    }

    const existing = await this.repository.findById(attachmentId);
    if (!existing || existing.applicationId !== applicationId) {
      throw new NotFoundError('Attachment not found');
    }

    // 1. Delete from storage provider
    await storageService.delete(existing.url);

    // 2. Delete record (soft delete)
    await prisma.attachment.update({
      where: { id: attachmentId },
      data: { deletedAt: new Date() },
    });
  }
}

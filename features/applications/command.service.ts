import { prisma } from '@/lib/db/prisma';
import { CreateApplicationRequest, UpdateApplicationRequest } from './dto';
import { ApplicationEntity } from './domain/entity';
import { ApplicationRepository } from './repository';
import { DomainEventBus } from '../activity/listener';
import { NotFoundError } from '@/lib/shared/errors';

export class ApplicationCommandService {
  private repository: ApplicationRepository;

  constructor() {
    this.repository = new ApplicationRepository();
  }

  async createApplication(userId: string, data: CreateApplicationRequest): Promise<ApplicationEntity> {
    // Uses Prisma Transaction to ensure atomicity
    const app = await prisma.$transaction(async (tx) => {
      const created = await tx.application.create({
        data: {
          userId,
          position: data.position,
          company: data.company,
          location: data.location,
          salary: data.salary,
          description: data.description,
          url: data.url,
          status: data.status,
          source: data.source,
          method: data.method,
          appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
          interviewAt: data.interviewAt ? new Date(data.interviewAt) : null,
        },
      });

      return created;
    });

    // Dispatch domain event after successful transaction
    DomainEventBus.emit('application.created', {
      userId,
      applicationId: app.id,
      data: { position: app.position, company: app.company },
    });

    // Re-fetch via repository to return mapped entity
    return (await this.repository.findById(userId, app.id))!;
  }

  async updateApplication(userId: string, id: string, data: UpdateApplicationRequest): Promise<ApplicationEntity> {
    const existing = await this.repository.findById(userId, id);
    if (!existing) {
      throw new NotFoundError('Application not found');
    }

    const app = await prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: { id },
        data: {
          ...data,
          appliedAt: data.appliedAt !== undefined ? (data.appliedAt ? new Date(data.appliedAt) : null) : undefined,
          interviewAt: data.interviewAt !== undefined ? (data.interviewAt ? new Date(data.interviewAt) : null) : undefined,
        },
      });

      return updated;
    });

    // Check if status changed for activity log
    if (data.status && data.status !== existing.status) {
      DomainEventBus.emit('application.status_changed', {
        userId,
        applicationId: id,
        from: existing.status,
        to: data.status,
      });
    }

    return (await this.repository.findById(userId, app.id))!;
  }

  async deleteApplication(userId: string, id: string): Promise<void> {
    const existing = await this.repository.findById(userId, id);
    if (!existing) {
      throw new NotFoundError('Application not found');
    }

    // Soft delete
    await prisma.application.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

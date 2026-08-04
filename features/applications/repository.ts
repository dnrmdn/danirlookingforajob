import { prisma } from '@/lib/db/prisma';
import { ApplicationEntity } from './domain/entity';
import { Application, Prisma } from '@prisma/client';

export class ApplicationRepository {
  private mapToEntity(model: Application): ApplicationEntity {
    return {
      id: model.id,
      userId: model.userId,
      position: model.position,
      company: model.company,
      location: model.location,
      salary: model.salary,
      description: model.description,
      url: model.url,
      status: model.status,
      source: model.source,
      method: model.method,
      appliedAt: model.appliedAt,
      interviewAt: model.interviewAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  async findById(userId: string, id: string): Promise<ApplicationEntity | null> {
    const app = await prisma.application.findFirst({
      where: { id, userId, deletedAt: null },
    });
    return app ? this.mapToEntity(app) : null;
  }

  async findAllCursor(
    userId: string,
    take: number,
    cursor?: string,
    status?: string
  ): Promise<{ data: ApplicationEntity[]; nextCursor: string | null; total: number }> {
    const where: Prisma.ApplicationWhereInput = {
      userId,
      deletedAt: null,
      ...(status ? { status: status as any } : {}),
    };

    const total = await prisma.application.count({ where });

    const applications = await prisma.application.findMany({
      take: take + 1, // Fetch one extra to determine if there's a next page
      where,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' }, // Need consistent ordering
    });

    let nextCursor: string | null = null;
    if (applications.length > take) {
      const nextItem = applications.pop();
      nextCursor = nextItem!.id;
    }

    return {
      data: applications.map(this.mapToEntity.bind(this)),
      nextCursor,
      total,
    };
  }
}

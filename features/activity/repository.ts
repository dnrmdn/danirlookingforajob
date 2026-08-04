import { prisma } from '@/lib/db/prisma';

export interface CreateActivityLogParams {
  entityType: string;
  entityId: string;
  action: string;
  userId: string;
  metadata?: any;
}

export class ActivityRepository {
  async create(data: CreateActivityLogParams) {
    return prisma.activityLog.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        userId: data.userId,
        metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : null,
      },
    });
  }

  async findByEntity(entityType: string, entityId: string) {
    return prisma.activityLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

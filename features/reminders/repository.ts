import { prisma } from '@/lib/db/prisma';
import { ReminderEntity } from './domain/entity';
import { Reminder } from '@prisma/client';

export class ReminderRepository {
  private mapToEntity(model: Reminder): ReminderEntity {
    return {
      id: model.id,
      title: model.title,
      reminderDate: model.reminderDate,
      completed: model.completed,
      userId: model.userId,
      applicationId: model.applicationId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  async findById(userId: string, id: string): Promise<ReminderEntity | null> {
    const reminder = await prisma.reminder.findFirst({
      where: { id, userId, deletedAt: null },
    });
    return reminder ? this.mapToEntity(reminder) : null;
  }

  async findByApplicationId(userId: string, applicationId: string): Promise<ReminderEntity[]> {
    const reminders = await prisma.reminder.findMany({
      where: { applicationId, userId, deletedAt: null },
      orderBy: { reminderDate: 'asc' },
    });
    return reminders.map(this.mapToEntity);
  }

  async findAllByUser(userId: string): Promise<ReminderEntity[]> {
    const reminders = await prisma.reminder.findMany({
      where: { userId, deletedAt: null },
      orderBy: { reminderDate: 'asc' },
    });
    return reminders.map(this.mapToEntity);
  }
}

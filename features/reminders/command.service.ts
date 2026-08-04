import { prisma } from '@/lib/db/prisma';
import { CreateReminderRequest, UpdateReminderRequest } from './dto';
import { ReminderEntity } from './domain/entity';
import { ReminderRepository } from './repository';
import { ApplicationRepository } from '../applications/repository';
import { NotFoundError } from '@/lib/shared/errors';
import { DomainEventBus } from '../activity/listener';

export class ReminderCommandService {
  private repository: ReminderRepository;
  private appRepository: ApplicationRepository;

  constructor() {
    this.repository = new ReminderRepository();
    this.appRepository = new ApplicationRepository();
  }

  async createReminder(userId: string, applicationId: string, data: CreateReminderRequest): Promise<ReminderEntity> {
    const app = await this.appRepository.findById(userId, applicationId);
    if (!app) {
      throw new NotFoundError('Application not found');
    }

    const reminder = await prisma.$transaction(async (tx) => {
      return tx.reminder.create({
        data: {
          userId,
          applicationId,
          title: data.title,
          reminderDate: new Date(data.reminderDate),
          completed: data.completed,
        },
      });
    });

    DomainEventBus.emit('reminder.created', {
      userId,
      applicationId,
      reminderId: reminder.id,
    });

    return (await this.repository.findById(userId, reminder.id))!;
  }

  async updateReminder(userId: string, reminderId: string, data: UpdateReminderRequest): Promise<ReminderEntity> {
    const existing = await this.repository.findById(userId, reminderId);
    if (!existing) {
      throw new NotFoundError('Reminder not found');
    }

    const updated = await prisma.$transaction(async (tx) => {
      return tx.reminder.update({
        where: { id: reminderId },
        data: {
          title: data.title,
          reminderDate: data.reminderDate ? new Date(data.reminderDate) : undefined,
          completed: data.completed,
        },
      });
    });

    return (await this.repository.findById(userId, updated.id))!;
  }

  async deleteReminder(userId: string, reminderId: string): Promise<void> {
    const existing = await this.repository.findById(userId, reminderId);
    if (!existing) {
      throw new NotFoundError('Reminder not found');
    }

    await prisma.reminder.update({
      where: { id: reminderId },
      data: { deletedAt: new Date() },
    });
  }
}

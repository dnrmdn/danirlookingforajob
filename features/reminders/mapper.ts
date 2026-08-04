import { ReminderEntity } from './domain/entity';
import { ReminderResponse } from './dto';

export class ReminderMapper {
  static toResponse(entity: ReminderEntity): ReminderResponse {
    return {
      id: entity.id,
      title: entity.title,
      reminderDate: entity.reminderDate.toISOString(),
      completed: entity.completed,
      applicationId: entity.applicationId,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}

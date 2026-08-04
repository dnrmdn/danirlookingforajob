import { ReminderRepository } from './repository';
import { ApplicationRepository } from '../applications/repository';
import { NotFoundError } from '@/lib/shared/errors';
import { ReminderEntity } from './domain/entity';

export class ReminderQueryService {
  private repository: ReminderRepository;
  private appRepository: ApplicationRepository;

  constructor() {
    this.repository = new ReminderRepository();
    this.appRepository = new ApplicationRepository();
  }

  async getRemindersForApplication(userId: string, applicationId: string): Promise<ReminderEntity[]> {
    // Verify ownership
    const app = await this.appRepository.findById(userId, applicationId);
    if (!app) {
      throw new NotFoundError('Application not found');
    }

    return this.repository.findByApplicationId(userId, applicationId);
  }

  async getAllUserReminders(userId: string): Promise<ReminderEntity[]> {
    return this.repository.findAllByUser(userId);
  }
}

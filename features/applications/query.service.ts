import { ApplicationRepository } from './repository';
import { ApplicationEntity } from './domain/entity';
import { NotFoundError } from '@/lib/shared/errors';

export class ApplicationQueryService {
  private repository: ApplicationRepository;

  constructor() {
    this.repository = new ApplicationRepository();
  }

  async getApplication(userId: string, id: string): Promise<ApplicationEntity> {
    const app = await this.repository.findById(userId, id);
    if (!app) {
      throw new NotFoundError('Application not found');
    }
    return app;
  }

  async listApplications(userId: string, take: number, cursor?: string, status?: string) {
    return this.repository.findAllCursor(userId, take, cursor, status);
  }
}

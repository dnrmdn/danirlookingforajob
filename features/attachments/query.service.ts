import { AttachmentRepository } from './repository';
import { ApplicationRepository } from '../applications/repository';
import { NotFoundError } from '@/lib/shared/errors';
import { AttachmentEntity } from './domain/entity';

export class AttachmentQueryService {
  private repository: AttachmentRepository;
  private appRepository: ApplicationRepository;

  constructor() {
    this.repository = new AttachmentRepository();
    this.appRepository = new ApplicationRepository();
  }

  async getAttachmentsForApplication(userId: string, applicationId: string): Promise<AttachmentEntity[]> {
    const app = await this.appRepository.findById(userId, applicationId);
    if (!app) {
      throw new NotFoundError('Application not found');
    }

    return this.repository.findByApplicationId(applicationId);
  }
}

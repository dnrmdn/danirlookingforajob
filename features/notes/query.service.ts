import { NoteRepository } from './repository';
import { ApplicationRepository } from '../applications/repository';
import { NotFoundError } from '@/lib/shared/errors';
import { NoteEntity } from './domain/entity';

export class NoteQueryService {
  private repository: NoteRepository;
  private appRepository: ApplicationRepository;

  constructor() {
    this.repository = new NoteRepository();
    this.appRepository = new ApplicationRepository();
  }

  async getNotesForApplication(userId: string, applicationId: string): Promise<NoteEntity[]> {
    // Verify ownership
    const app = await this.appRepository.findById(userId, applicationId);
    if (!app) {
      throw new NotFoundError('Application not found');
    }

    return this.repository.findByApplicationId(applicationId);
  }
}

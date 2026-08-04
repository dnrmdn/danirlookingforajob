import { prisma } from '@/lib/db/prisma';
import { CreateNoteRequest, UpdateNoteRequest } from './dto';
import { NoteEntity } from './domain/entity';
import { NoteRepository } from './repository';
import { ApplicationRepository } from '../applications/repository';
import { NotFoundError } from '@/lib/shared/errors';
import { DomainEventBus } from '../activity/listener';

export class NoteCommandService {
  private repository: NoteRepository;
  private appRepository: ApplicationRepository;

  constructor() {
    this.repository = new NoteRepository();
    this.appRepository = new ApplicationRepository();
  }

  async createNote(userId: string, applicationId: string, data: CreateNoteRequest): Promise<NoteEntity> {
    const app = await this.appRepository.findById(userId, applicationId);
    if (!app) {
      throw new NotFoundError('Application not found');
    }

    const note = await prisma.$transaction(async (tx) => {
      return tx.note.create({
        data: {
          applicationId,
          content: data.content,
        },
      });
    });

    DomainEventBus.emit('note.created', {
      userId,
      applicationId,
      noteId: note.id,
    });

    return (await this.repository.findById(note.id))!;
  }

  async updateNote(userId: string, applicationId: string, noteId: string, data: UpdateNoteRequest): Promise<NoteEntity> {
    const app = await this.appRepository.findById(userId, applicationId);
    if (!app) throw new NotFoundError('Application not found');

    const existing = await this.repository.findById(noteId);
    if (!existing || existing.applicationId !== applicationId) {
      throw new NotFoundError('Note not found');
    }

    const updated = await prisma.$transaction(async (tx) => {
      return tx.note.update({
        where: { id: noteId },
        data: { content: data.content },
      });
    });

    return (await this.repository.findById(updated.id))!;
  }

  async deleteNote(userId: string, applicationId: string, noteId: string): Promise<void> {
    const app = await this.appRepository.findById(userId, applicationId);
    if (!app) throw new NotFoundError('Application not found');

    const existing = await this.repository.findById(noteId);
    if (!existing || existing.applicationId !== applicationId) {
      throw new NotFoundError('Note not found');
    }

    await prisma.note.update({
      where: { id: noteId },
      data: { deletedAt: new Date() },
    });
  }
}

import { EventEmitter } from 'events';
import { ActivityRepository } from './repository';
import { logger } from '@/lib/shared/logger';

// Create a singleton event bus
export const DomainEventBus = new EventEmitter();

const activityRepo = new ActivityRepository();

// Listen to domain events and map them to activity logs
DomainEventBus.on('application.created', async (payload: { userId: string; applicationId: string; data: any }) => {
  try {
    await activityRepo.create({
      entityType: 'Application',
      entityId: payload.applicationId,
      action: 'CREATED',
      userId: payload.userId,
      metadata: { position: payload.data.position, company: payload.data.company },
    });
  } catch (error) {
    logger.error({ error, payload }, 'Failed to log application.created activity');
  }
});

DomainEventBus.on('application.status_changed', async (payload: { userId: string; applicationId: string; from: string; to: string }) => {
  try {
    await activityRepo.create({
      entityType: 'Application',
      entityId: payload.applicationId,
      action: 'STATUS_CHANGED',
      userId: payload.userId,
      metadata: { from: payload.from, to: payload.to },
    });
  } catch (error) {
    logger.error({ error, payload }, 'Failed to log application.status_changed activity');
  }
});

// We can add more listeners here for Notes, Reminders, etc.
// DomainEventBus.on('note.created', ...)

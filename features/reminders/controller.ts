import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ReminderQueryService } from './query.service';
import { ReminderCommandService } from './command.service';
import { createReminderSchema, updateReminderSchema } from './validation';
import { ReminderMapper } from './mapper';
import { apiResponse } from '@/lib/shared/api-response';
import { ValidationError } from '@/lib/shared/errors';

const queryService = new ReminderQueryService();
const commandService = new ReminderCommandService();

export class ReminderController {
  static async getByApplication(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = await requireAuth();
      const reminders = await queryService.getRemindersForApplication(userId, params.id);
      const responseData = reminders.map(ReminderMapper.toResponse);
      return apiResponse.success(responseData);
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async getAll(req: NextRequest) {
    try {
      const userId = await requireAuth();
      const reminders = await queryService.getAllUserReminders(userId);
      const responseData = reminders.map(ReminderMapper.toResponse);
      return apiResponse.success(responseData);
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async create(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = await requireAuth();
      const body = await req.json();

      const validationResult = createReminderSchema.safeParse(body);
      if (!validationResult.success) {
        throw new ValidationError("Invalid reminder data", validationResult.error.flatten().fieldErrors);
      }

      const created = await commandService.createReminder(userId, params.id, validationResult.data);
      return apiResponse.success(ReminderMapper.toResponse(created), "Reminder created successfully", undefined, 201);
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string; reminderId: string } }) {
    try {
      const userId = await requireAuth();
      const body = await req.json();

      const validationResult = updateReminderSchema.safeParse(body);
      if (!validationResult.success) {
        throw new ValidationError("Invalid reminder data", validationResult.error.flatten().fieldErrors);
      }

      const updated = await commandService.updateReminder(userId, params.reminderId, validationResult.data);
      return apiResponse.success(ReminderMapper.toResponse(updated), "Reminder updated successfully");
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async delete(req: NextRequest, { params }: { params: { id: string; reminderId: string } }) {
    try {
      const userId = await requireAuth();
      await commandService.deleteReminder(userId, params.reminderId);
      return apiResponse.success(null, "Reminder deleted successfully");
    } catch (error) {
      return apiResponse.error(error);
    }
  }
}

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ApplicationQueryService } from './query.service';
import { ApplicationCommandService } from './command.service';
import { createApplicationSchema, updateApplicationSchema, queryApplicationSchema } from './validation';
import { ApplicationMapper } from './mapper';
import { apiResponse } from '@/lib/shared/api-response';
import { ValidationError } from '@/lib/shared/errors';

const queryService = new ApplicationQueryService();
const commandService = new ApplicationCommandService();

export class ApplicationController {
  static async getAll(req: NextRequest) {
    try {
      const userId = await requireAuth();
      const url = new URL(req.url);
      
      const queryData = {
        cursor: url.searchParams.get('cursor') || undefined,
        take: url.searchParams.get('take') || undefined,
        status: url.searchParams.get('status') || undefined,
      };

      const validationResult = queryApplicationSchema.safeParse(queryData);
      if (!validationResult.success) {
        throw new ValidationError("Invalid query parameters", validationResult.error.flatten().fieldErrors);
      }

      const { cursor, take, status } = validationResult.data;

      const { data, nextCursor, total } = await queryService.listApplications(userId, take, cursor, status);
      
      const responseData = data.map(ApplicationMapper.toSummaryResponse);

      return apiResponse.success(responseData, "Applications retrieved successfully", {
        cursor: nextCursor,
        total,
        limit: take,
      });
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async getById(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = await requireAuth();
      const app = await queryService.getApplication(userId, params.id);
      return apiResponse.success(ApplicationMapper.toDetailResponse(app));
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const userId = await requireAuth();
      const body = await req.json();

      const validationResult = createApplicationSchema.safeParse(body);
      if (!validationResult.success) {
        throw new ValidationError("Invalid application data", validationResult.error.flatten().fieldErrors);
      }

      const created = await commandService.createApplication(userId, validationResult.data);
      return apiResponse.success(ApplicationMapper.toDetailResponse(created), "Application created successfully", undefined, 201);
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = await requireAuth();
      const body = await req.json();

      const validationResult = updateApplicationSchema.safeParse(body);
      if (!validationResult.success) {
        throw new ValidationError("Invalid application data", validationResult.error.flatten().fieldErrors);
      }

      const updated = await commandService.updateApplication(userId, params.id, validationResult.data);
      return apiResponse.success(ApplicationMapper.toDetailResponse(updated), "Application updated successfully");
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async delete(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = await requireAuth();
      await commandService.deleteApplication(userId, params.id);
      return apiResponse.success(null, "Application deleted successfully");
    } catch (error) {
      return apiResponse.error(error);
    }
  }
}

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { AnalyticsQueryService } from './query.service';
import { apiResponse } from '@/lib/shared/api-response';

const queryService = new AnalyticsQueryService();

export class AnalyticsController {
  static async getDashboardStats(req: NextRequest) {
    try {
      const userId = await requireAuth();
      const stats = await queryService.getDashboardStats(userId);
      return apiResponse.success(stats);
    } catch (error) {
      return apiResponse.error(error);
    }
  }
}

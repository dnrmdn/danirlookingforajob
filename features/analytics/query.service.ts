import { prisma } from '@/lib/db/prisma';

export interface DashboardStatsResponse {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  rejected: number;
  ghosted: number;
  recentActivity: Array<{
    id: string;
    action: string;
    entityType: string;
    createdAt: string;
  }>;
}

export class AnalyticsQueryService {
  async getDashboardStats(userId: string): Promise<DashboardStatsResponse> {
    const [
      totalApplications,
      activeApplications,
      interviewsScheduled,
      offersReceived,
      rejected,
      ghosted,
      recentActivityLogs
    ] = await Promise.all([
      prisma.application.count({ where: { userId, deletedAt: null } }),
      prisma.application.count({ where: { userId, status: { in: ['APPLYING', 'APPLIED', 'INTERVIEW'] }, deletedAt: null } }),
      prisma.application.count({ where: { userId, status: 'INTERVIEW', deletedAt: null } }),
      prisma.application.count({ where: { userId, status: 'OFFER', deletedAt: null } }),
      prisma.application.count({ where: { userId, status: 'REJECTED', deletedAt: null } }),
      prisma.application.count({ where: { userId, status: 'GHOSTED', deletedAt: null } }),
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })
    ]);

    return {
      totalApplications,
      activeApplications,
      interviewsScheduled,
      offersReceived,
      rejected,
      ghosted,
      recentActivity: recentActivityLogs.map(log => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        createdAt: log.createdAt.toISOString(),
      })),
    };
  }
}

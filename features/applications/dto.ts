import { ApplicationStatus, ApplicationSource, ApplicationMethod } from '@prisma/client';
import { z } from 'zod';
import { createApplicationSchema, updateApplicationSchema } from './validation';

export type CreateApplicationRequest = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationRequest = z.infer<typeof updateApplicationSchema>;

export interface ApplicationSummaryResponse {
  id: string;
  position: string;
  company: string;
  status: ApplicationStatus;
  source: ApplicationSource;
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDetailResponse extends ApplicationSummaryResponse {
  location: string | null;
  salary: string | null;
  description: string | null;
  url: string | null;
  method: ApplicationMethod;
  interviewAt: string | null;
}

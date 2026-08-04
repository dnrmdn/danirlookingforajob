import { ApplicationStatus, ApplicationSource, ApplicationMethod } from '@prisma/client';

export interface ApplicationEntity {
  id: string;
  userId: string;
  position: string;
  company: string;
  location: string | null;
  salary: string | null;
  description: string | null;
  url: string | null;
  status: ApplicationStatus;
  source: ApplicationSource;
  method: ApplicationMethod;
  appliedAt: Date | null;
  interviewAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

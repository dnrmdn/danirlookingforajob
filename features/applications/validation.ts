import { z } from 'zod';
import { ApplicationStatus, ApplicationSource, ApplicationMethod } from '@prisma/client';

/** Accepts ISO date-only strings: YYYY-MM-DD */
const isoDate = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  'Must be a valid date in YYYY-MM-DD format'
);

export const createApplicationSchema = z.object({
  position: z.string().min(1, 'Position is required').trim(),
  company: z.string().min(1, 'Company is required').trim(),
  location: z.string().trim().optional(),
  salary: z.string().trim().optional(),
  description: z.string().trim().optional(),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.BOOKMARKED),
  source: z.nativeEnum(ApplicationSource).default(ApplicationSource.OTHER),
  method: z.nativeEnum(ApplicationMethod).default(ApplicationMethod.OTHER),
  appliedAt: isoDate.optional().nullable(),
  interviewAt: z.string().datetime().optional().nullable(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export const queryApplicationSchema = z.object({
  cursor: z.string().optional(),
  take: z.coerce.number().min(1).max(100).default(20),
  status: z.nativeEnum(ApplicationStatus).optional(),
});

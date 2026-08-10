// ============================================================
// CareerVault — Utility Functions
// ============================================================

import { differenceInDays, format, formatDistanceToNowStrict, parseISO } from 'date-fns';
import { DURATION_COLORS, GHOSTED_THRESHOLD_DAYS } from './constants';
import { Application, ApplicationStatus } from './types';

/**
 * Generate a unique ID (simple UUID v4-like)
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy');
}

/**
 * Format a date to short format
 */
export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM');
}

/**
 * Get duration text like "3d ago", "2w ago"
 */
export function getDurationText(dateStr: string): string {
  return formatDistanceToNowStrict(parseISO(dateStr), { addSuffix: true });
}

/**
 * Get the number of days since a date
 */
export function getDaysSince(dateStr: string): number {
  return differenceInDays(new Date(), parseISO(dateStr));
}

/**
 * Get duration color class based on days elapsed
 */
export function getDurationColorClass(dateStr: string): string {
  const days = getDaysSince(dateStr);
  if (days <= DURATION_COLORS.fresh.max) return DURATION_COLORS.fresh.className;
  if (days <= DURATION_COLORS.moderate.max) return DURATION_COLORS.moderate.className;
  return DURATION_COLORS.stale.className;
}

/**
 * Check if an application is considered ghosted
 */
export function isGhosted(app: Application): boolean {
  const daysSinceUpdate = getDaysSince(app.updatedAt);
  return (
    daysSinceUpdate >= GHOSTED_THRESHOLD_DAYS &&
    !['ACCEPTED', 'REJECTED'].includes(app.status)
  );
}

/**
 * Get count of applications by status
 */
export function getStatusCounts(
  applications: Application[]
): Record<ApplicationStatus, number> {
  const counts: Record<string, number> = {};
  const allStatuses: ApplicationStatus[] = [
    'APPLIED', 'SCREENING', 'INTERVIEW', 'TEST',
    'OFFERING', 'ACCEPTED', 'REJECTED', 'GHOSTED',
  ];
  allStatuses.forEach((s) => (counts[s] = 0));
  applications.forEach((app) => {
    counts[app.status] = (counts[app.status] || 0) + 1;
  });
  return counts as Record<ApplicationStatus, number>;
}

/**
 * Get active applications (not accepted/rejected)
 */
export function getActiveApplications(applications: Application[]): Application[] {
  return applications.filter(
    (app) => !['ACCEPTED', 'REJECTED'].includes(app.status)
  );
}

/**
 * CN utility — merge class names, filtering falsy values
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Calculate response rate (applications that moved past 'applied')
 */
export function calculateResponseRate(applications: Application[]): number {
  if (applications.length === 0) return 0;
  const responded = applications.filter((app) => app.status !== 'APPLIED').length;
  return Math.round((responded / applications.length) * 100);
}

/**
 * Calculate interview rate
 */
export function calculateInterviewRate(applications: Application[]): number {
  if (applications.length === 0) return 0;
  const interviewed = applications.filter((app) =>
    ['INTERVIEW', 'TEST', 'OFFERING', 'ACCEPTED'].includes(app.status)
  ).length;
  return Math.round((interviewed / applications.length) * 100);
}

/**
 * Today's date as ISO string (date only)
 */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate user initials dynamically from name or email
 */
export function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.substring(0, 2).toUpperCase();
  }
  return 'CV';
}

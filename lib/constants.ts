// ============================================================
// CareerVault — Constants & Configuration
// ============================================================

import { ApplicationStatus, ApplicationSource, ApplicationMethod } from './types';

// ---- Status Configuration ----
export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bgClass: string; textClass: string; borderClass: string; dotColor: string }
> = {
  applied: {
    label: 'Applied',
    color: '#6366F1',
    bgClass: 'bg-indigo-500/15',
    textClass: 'text-indigo-400',
    borderClass: 'border-indigo-500/30',
    dotColor: 'bg-indigo-400',
  },
  screening: {
    label: 'Screening',
    color: '#8B5CF6',
    bgClass: 'bg-violet-500/15',
    textClass: 'text-violet-400',
    borderClass: 'border-violet-500/30',
    dotColor: 'bg-violet-400',
  },
  interview: {
    label: 'Interview',
    color: '#EC4899',
    bgClass: 'bg-pink-500/15',
    textClass: 'text-pink-400',
    borderClass: 'border-pink-500/30',
    dotColor: 'bg-pink-400',
  },
  test: {
    label: 'Test',
    color: '#F59E0B',
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    dotColor: 'bg-amber-400',
  },
  offering: {
    label: 'Offering',
    color: '#10B981',
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    dotColor: 'bg-emerald-400',
  },
  accepted: {
    label: 'Accepted',
    color: '#22C55E',
    bgClass: 'bg-green-500/15',
    textClass: 'text-green-400',
    borderClass: 'border-green-500/30',
    dotColor: 'bg-green-400',
  },
  rejected: {
    label: 'Rejected',
    color: '#EF4444',
    bgClass: 'bg-red-500/15',
    textClass: 'text-red-400',
    borderClass: 'border-red-500/30',
    dotColor: 'bg-red-400',
  },
  ghosted: {
    label: 'Ghosted',
    color: '#6B7280',
    bgClass: 'bg-gray-500/15',
    textClass: 'text-gray-400',
    borderClass: 'border-gray-500/30',
    dotColor: 'bg-gray-400',
  },
};

// Kanban column order
export const KANBAN_COLUMNS: ApplicationStatus[] = [
  'applied',
  'screening',
  'interview',
  'test',
  'offering',
  'accepted',
  'rejected',
];

// ---- Source Configuration ----
export const SOURCE_CONFIG: Record<ApplicationSource, { label: string; color: string }> = {
  linkedin: { label: 'LinkedIn', color: '#0A66C2' },
  instagram: { label: 'Instagram', color: '#E4405F' },
  jobstreet: { label: 'JobStreet', color: '#1A3764' },
  indeed: { label: 'Indeed', color: '#2164F3' },
  glassdoor: { label: 'Glassdoor', color: '#0CAA41' },
  kalibrr: { label: 'Kalibrr', color: '#1DB954' },
  website: { label: 'Website', color: '#8B5CF6' },
  referral: { label: 'Referral', color: '#F59E0B' },
  other: { label: 'Other', color: '#6B7280' },
};

// ---- Method Configuration ----
export const METHOD_CONFIG: Record<ApplicationMethod, { label: string }> = {
  email: { label: 'Email' },
  website: { label: 'Website' },
  'walk-in': { label: 'Walk-in' },
  referral: { label: 'Referral' },
  direct: { label: 'Direct' },
  recruiter: { label: 'Recruiter' },
};

// ---- Navigation Items ----
export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Applications', href: '/applications', icon: 'Briefcase' },
  { label: 'Reminders', href: '/reminders', icon: 'Bell' },
  { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
] as const;

export const SECONDARY_NAV = [
  { label: 'Settings', href: '/settings', icon: 'Settings' },
] as const;

// ---- Ghosted threshold (days) ----
export const GHOSTED_THRESHOLD_DAYS = 30;

// ---- Duration color thresholds ----
export const DURATION_COLORS = {
  fresh: { max: 7, className: 'text-emerald-400' },
  moderate: { max: 30, className: 'text-amber-400' },
  stale: { max: Infinity, className: 'text-red-400' },
} as const;

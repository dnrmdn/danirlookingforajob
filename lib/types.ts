// ============================================================
// CareerVault — Core Type Definitions
// ============================================================

export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'test'
  | 'offering'
  | 'accepted'
  | 'rejected'
  | 'ghosted';

export type ApplicationSource =
  | 'linkedin'
  | 'instagram'
  | 'jobstreet'
  | 'indeed'
  | 'glassdoor'
  | 'kalibrr'
  | 'website'
  | 'referral'
  | 'other';

export type ApplicationMethod =
  | 'email'
  | 'website'
  | 'walk-in'
  | 'referral'
  | 'direct'
  | 'recruiter';

export interface Attachment {
  id: string;
  name: string;
  type: string; // mime type
  size: number; // bytes
  url: string; // mock URL / blob URL
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  type: 'status_change' | 'note_added' | 'attachment_added' | 'reminder_set' | 'created';
  description: string;
  fromStatus?: ApplicationStatus;
  toStatus?: ApplicationStatus;
  createdAt: string;
}

export interface Reminder {
  id: string;
  applicationId: string;
  date: string; // ISO date string
  message: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Application {
  id: string;
  company: string;
  position: string;
  source: ApplicationSource;
  sourceUrl?: string;
  method: ApplicationMethod;
  status: ApplicationStatus;
  appliedDate: string; // ISO date string
  location?: string;
  salary?: string;
  notes: string[];
  attachments: Attachment[];
  activityLog: ActivityLogEntry[];
  reminder?: Reminder;
  createdAt: string;
  updatedAt: string;
}

export type NewApplication = Omit<
  Application,
  'id' | 'activityLog' | 'createdAt' | 'updatedAt'
>;

export interface FilterState {
  search: string;
  status: ApplicationStatus[];
  source: ApplicationSource[];
  method: ApplicationMethod[];
  dateRange: {
    from: string | null;
    to: string | null;
  };
}

export type ViewMode = 'kanban' | 'list';
export type SortField = 'appliedDate' | 'company' | 'status' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

// Dashboard stat card
export interface StatCard {
  label: string;
  value: number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

// Analytics
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

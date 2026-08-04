export interface ReminderEntity {
  id: string;
  title: string;
  reminderDate: Date;
  completed: boolean;
  userId: string;
  applicationId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

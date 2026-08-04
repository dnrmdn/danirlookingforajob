export interface AttachmentEntity {
  id: string;
  filename: string;
  url: string;
  mimeType: string | null;
  size: number | null;
  applicationId: string;
  createdAt: Date;
  updatedAt: Date;
}

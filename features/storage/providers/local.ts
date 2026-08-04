import { StorageProvider } from '../interface';
import { promises as fs } from 'fs';
import path from 'path';
import { env } from '@/lib/env';
import { AppError } from '@/lib/shared/errors';
import crypto from 'crypto';

export class LocalStorageProvider implements StorageProvider {
  private uploadDir = path.join(process.cwd(), 'public', 'uploads');

  constructor() {
    // Ensure directory exists
    fs.mkdir(this.uploadDir, { recursive: true }).catch(console.error);
  }

  async upload(file: Buffer, filename: string, mimeType: string): Promise<string> {
    try {
      const ext = path.extname(filename);
      const hash = crypto.randomBytes(16).toString('hex');
      const safeFilename = `${hash}${ext}`;
      const filePath = path.join(this.uploadDir, safeFilename);
      
      await fs.writeFile(filePath, file);
      
      return this.getUrl(safeFilename);
    } catch (error) {
      throw new AppError('Failed to upload file locally', 500);
    }
  }

  async delete(fileUrl: string): Promise<void> {
    try {
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, filename);
      await fs.unlink(filePath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }

  getUrl(pathStr: string): string {
    return `${env.APP_URL}/uploads/${pathStr}`;
  }
}

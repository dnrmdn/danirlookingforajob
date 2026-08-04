import { StorageProvider } from '../interface';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { AppError } from '@/lib/shared/errors';
import crypto from 'crypto';
import path from 'path';

export class SupabaseStorageProvider implements StorageProvider {
  private client: SupabaseClient;
  private bucketName: string;

  constructor() {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials missing');
    }
    this.client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    this.bucketName = env.SUPABASE_BUCKET_NAME || 'careervault-uploads';
  }

  async upload(file: Buffer, filename: string, mimeType: string): Promise<string> {
    const ext = path.extname(filename);
    const hash = crypto.randomBytes(16).toString('hex');
    const safePath = `${hash}${ext}`;

    const { data, error } = await this.client.storage
      .from(this.bucketName)
      .upload(safePath, file, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw new AppError(`Supabase upload failed: ${error.message}`, 500);
    }

    return this.getUrl(data.path);
  }

  async delete(fileUrl: string): Promise<void> {
    const urlParts = fileUrl.split('/');
    const pathStr = urlParts[urlParts.length - 1]; // highly simplified for the PoC

    const { error } = await this.client.storage
      .from(this.bucketName)
      .remove([pathStr]);

    if (error) {
      throw new AppError(`Supabase delete failed: ${error.message}`, 500);
    }
  }

  getUrl(pathStr: string): string {
    const { data } = this.client.storage
      .from(this.bucketName)
      .getPublicUrl(pathStr);
      
    return data.publicUrl;
  }
}

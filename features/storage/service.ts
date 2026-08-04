import { StorageProvider } from './interface';
import { LocalStorageProvider } from './providers/local';
import { SupabaseStorageProvider } from './providers/supabase';
import { env } from '@/lib/env';

class StorageService {
  private provider: StorageProvider;

  constructor() {
    // Factory logic: Determine which provider to use
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      this.provider = new SupabaseStorageProvider();
    } else {
      // Fallback to local storage for dev
      this.provider = new LocalStorageProvider();
    }
  }

  async upload(file: Buffer, filename: string, mimeType: string): Promise<string> {
    return this.provider.upload(file, filename, mimeType);
  }

  async delete(fileUrl: string): Promise<void> {
    return this.provider.delete(fileUrl);
  }

  getUrl(path: string): string {
    return this.provider.getUrl(path);
  }
}

// Export singleton instance
export const storageService = new StorageService();

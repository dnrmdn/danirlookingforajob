export interface StorageProvider {
  /**
   * Uploads a file buffer and returns the public URL
   */
  upload(file: Buffer, filename: string, mimeType: string): Promise<string>;

  /**
   * Deletes a file given its public URL or path
   */
  delete(fileUrl: string): Promise<void>;

  /**
   * Gets the public URL for a given path
   */
  getUrl(path: string): string;
}

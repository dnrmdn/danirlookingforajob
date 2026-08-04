import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { AttachmentQueryService } from './query.service';
import { AttachmentCommandService } from './command.service';
import { AttachmentMapper } from './mapper';
import { apiResponse } from '@/lib/shared/api-response';
import { ValidationError, AppError } from '@/lib/shared/errors';
import { requireRateLimit, uploadRateLimit } from '@/lib/shared/rate-limit';

const queryService = new AttachmentQueryService();
const commandService = new AttachmentCommandService();

export class AttachmentController {
  static async getByApplication(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = await requireAuth();
      const attachments = await queryService.getAttachmentsForApplication(userId, params.id);
      const responseData = attachments.map(AttachmentMapper.toResponse);
      return apiResponse.success(responseData);
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async upload(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = await requireAuth();
      
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      await requireRateLimit(`upload_${ip}`, uploadRateLimit);

      const formData = await req.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        throw new ValidationError("No file uploaded");
      }

      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const created = await commandService.uploadAttachment(
        userId, 
        params.id, 
        buffer, 
        file.name, 
        file.type, 
        file.size
      );

      return apiResponse.success(AttachmentMapper.toResponse(created), "Attachment uploaded successfully", undefined, 201);
    } catch (error) {
      return apiResponse.error(error);
    }
  }

  static async delete(req: NextRequest, { params }: { params: { id: string; attachmentId: string } }) {
    try {
      const userId = await requireAuth();
      await commandService.deleteAttachment(userId, params.id, params.attachmentId);
      return apiResponse.success(null, "Attachment deleted successfully");
    } catch (error) {
      return apiResponse.error(error);
    }
  }
}

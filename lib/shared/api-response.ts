import { NextResponse } from 'next/server';
import { AppError, ValidationError } from './errors';
import { logger } from './logger';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    cursor?: string | null;
    total?: number;
    limit?: number;
  };
  errors?: any;
}

export const apiResponse = {
  success: <T>(data: T, message = 'Success', meta?: ApiResponse['meta'], status = 200) => {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
        ...(meta && { meta }),
      },
      { status }
    );
  },

  error: (error: unknown) => {
    if (error instanceof ValidationError) {
      logger.warn({ err: error, details: error.details }, 'Validation Error');
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          errors: error.details,
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof AppError) {
      if (error.statusCode >= 500) {
        logger.error({ err: error }, 'App Error');
      } else {
        logger.warn({ err: error }, 'App Error');
      }
      
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          code: error.code,
        },
        { status: error.statusCode }
      );
    }

    logger.error({ err: error }, 'Unhandled Internal Error');
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  },
};

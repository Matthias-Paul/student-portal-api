import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';
import { mapHttpStatusToErrorCode } from '../utils/http-error-code';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, code, message } = this.normalizeException(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }

    const body: ApiErrorResponse = {
      success: false,
      error: { code, message },
    };

    response.status(status).json(body);
  }

  private normalizeException(exception: unknown): {
    status: number;
    code: string;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return {
          status,
          code: mapHttpStatusToErrorCode(status),
          message: exceptionResponse,
        };
      }

      const payload = exceptionResponse as Record<string, unknown>;
      const rawMessage = payload.message;
      const message = Array.isArray(rawMessage)
        ? String(rawMessage[0])
        : typeof rawMessage === 'string'
          ? rawMessage
          : exception.message;

      const code =
        typeof payload.code === 'string'
          ? payload.code
          : mapHttpStatusToErrorCode(status);

      return { status, code, message };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    };
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import {
  ApiMeta,
  ApiSuccessResponse,
} from '../interfaces/api-response.interface';

type ControllerResult =
  | ApiSuccessResponse
  | { data: unknown; meta?: ApiMeta }
  | unknown;

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse> {
    return next.handle().pipe(map((result) => this.toSuccessResponse(result)));
  }

  private toSuccessResponse(result: ControllerResult): ApiSuccessResponse {
    // Already in final envelope — don't double-wrap
    if (
      result &&
      typeof result === 'object' &&
      'success' in result &&
      (result as ApiSuccessResponse).success === true
    ) {
      return result as ApiSuccessResponse;
    }

    // Controllers can return { data, meta } for paginated lists
    if (
      result &&
      typeof result === 'object' &&
      'data' in result &&
      !('success' in result)
    ) {
      const shaped = result as { data: unknown; meta?: ApiMeta };
      return {
        success: true,
        data: shaped.data,
        ...(shaped.meta !== undefined ? { meta: shaped.meta } : {}),
      };
    }

    return {
      success: true,
      data: result,
    };
  }
}

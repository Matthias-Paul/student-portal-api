export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  nextCursor?: string | null;
  hasMore?: boolean;
  [key: string]: unknown;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorBody {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

import { ApiMeta } from '../interfaces/api-response.interface';

/** Return this from a controller when you need pagination (or other) meta. */
export function withMeta<T>(data: T, meta: ApiMeta) {
  return { data, meta };
}

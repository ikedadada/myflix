import { buildApiUrl } from './env';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message ?? `API error: ${status}`);
    this.status = status;
  }
}

const isBinaryBody = (body: unknown): boolean =>
  body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer;

export const apiClient = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const baseHeaders: HeadersInit = { ...(init?.headers ?? {}) };
  const shouldSetJson =
    !baseHeaders['Content-Type'] &&
    !baseHeaders['content-type'] &&
    (init?.body === undefined || (!isBinaryBody(init.body) && typeof init.body !== 'string'));
  const headers = shouldSetJson
    ? { 'Content-Type': 'application/json', ...baseHeaders }
    : baseHeaders;

  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers
  });

  if (!response.ok) {
    throw new ApiError(response.status);
  }
  const contentType = response.headers.get('Content-Type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  return (response.text() as unknown) as Promise<T>;
};

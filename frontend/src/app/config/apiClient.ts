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
  const hasBody = init?.body !== undefined;
  const shouldSetJson =
    hasBody &&
    !baseHeaders['Content-Type'] &&
    !baseHeaders['content-type'] &&
    (!isBinaryBody(init.body) && typeof init.body !== 'string');
  const headers = shouldSetJson
    ? { 'Content-Type': 'application/json', ...baseHeaders }
    : baseHeaders;

  let response: Response;
  try {
    response = await fetch(buildApiUrl(path), {
      ...init,
      headers,
      credentials: 'include'
    });
  } catch (error) {
    // Network / CORS failure yields a TypeError; surface as ApiError with status 0.
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
  }

  if (!response.ok) {
    throw new ApiError(response.status);
  }
  const contentType = response.headers.get('Content-Type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  return (response.text() as unknown) as Promise<T>;
};

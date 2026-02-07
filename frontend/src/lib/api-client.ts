import { env } from '@/config'

export class ApiError extends Error {
  status: number
  constructor(status: number, message?: string) {
    super(message ?? `API error: ${status}`)
    this.status = status
  }
}

const normalizeBase = (base: string): string => (base.endsWith('/') ? base : `${base}/`)

export const buildApiUrl = (path: string): string => {
  const cleanPath = path.replace(/^\/+/, '')
  return new URL(cleanPath, normalizeBase(env.apiBaseUrl)).toString()
}

const isBinaryBody = (body: unknown): boolean =>
  body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer

export const apiClient = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const baseHeaders = new Headers(init?.headers ?? {})
  const hasBody = init?.body !== undefined
  const shouldSetJson =
    hasBody &&
    !baseHeaders.has('Content-Type') &&
    !isBinaryBody(init.body) &&
    typeof init.body !== 'string'
  if (shouldSetJson) {
    baseHeaders.set('Content-Type', 'application/json')
  }

  let response: Response
  try {
    response = await fetch(buildApiUrl(path), {
      ...init,
      headers: baseHeaders,
      credentials: 'include',
    })
  } catch (error) {
    // Network / CORS failure yields a TypeError; surface as ApiError with status 0.
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error')
  }

  if (!response.ok) {
    throw new ApiError(response.status)
  }
  const contentType = response.headers.get('Content-Type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>
  }
  return response.text() as unknown as Promise<T>
}

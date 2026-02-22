export const APP_NAME = 'MYFLIX'
export const DEFAULT_PAGE_SIZE = 25
export const UPLOAD_SESSIONS_QUERY_KEY = ['uploads'] as const

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8787/api',
}

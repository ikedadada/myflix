import { useQuery } from '@tanstack/react-query'
import { UPLOAD_SESSIONS_QUERY_KEY } from '@/config'
import { apiClient } from '@/lib/api-client'
import type { UploadSession } from '@/types/upload-session'

export const useUploadSessionsQuery = () =>
  useQuery({
    queryKey: UPLOAD_SESSIONS_QUERY_KEY,
    queryFn: () => apiClient<UploadSession[]>('/uploads'),
    staleTime: 10_000,
  })

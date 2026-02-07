import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

interface ProgressResponse {
  position: number | null
}

export const usePlaybackProgress = (videoId: string) => {
  const client = useQueryClient()
  const key = ['videos', videoId, 'progress']
  const query = useQuery({
    queryKey: key,
    queryFn: () => apiClient<ProgressResponse>(`/videos/${videoId}/progress`),
    enabled: Boolean(videoId),
  })

  const mutation = useMutation({
    mutationFn: (position: number) =>
      apiClient(`/videos/${videoId}/progress`, {
        method: 'POST',
        body: JSON.stringify({ position }),
      }),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  })

  return { ...query, save: mutation.mutateAsync }
}

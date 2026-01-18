import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { VideoSummary } from '@/types/video';

export const useVideos = () =>
  useQuery({
    queryKey: ['videos'],
    queryFn: () => apiClient<VideoSummary[]>('/videos'),
    staleTime: 30_000
  });

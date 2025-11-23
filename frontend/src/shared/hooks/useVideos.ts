import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/config/apiClient';
import type { VideoSummary } from '@/shared/types/video';

export const useVideos = () =>
  useQuery({
    queryKey: ['videos'],
    queryFn: () => apiClient<VideoSummary[]>('/videos'),
    staleTime: 30_000
  });

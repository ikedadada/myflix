import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ApiUser } from '@/types/api';

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient<ApiUser>('/auth/me'),
    staleTime: 60_000,
    retry: false
  });
};

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/config/apiClient';
import type { ApiUser } from '@/shared/types/api';

export const useAuthUser = () =>
  useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient<ApiUser>('/auth/me'),
    staleTime: 60_000
  });

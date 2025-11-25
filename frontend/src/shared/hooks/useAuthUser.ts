import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/app/config/apiClient';
import { buildAccessLoginUrl } from '@/app/config/env';
import type { ApiUser } from '@/shared/types/api';

export const useAuthUser = () => {
  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient<ApiUser>('/auth/me'),
    staleTime: 60_000,
    retry: false
  });

  useEffect(() => {
    if (query.error instanceof ApiError && query.error.status === 401) {
      const login = buildAccessLoginUrl(window.location.href);
      if (login) {
        window.location.href = login;
      }
    }
  }, [query.error]);

  return query;
};

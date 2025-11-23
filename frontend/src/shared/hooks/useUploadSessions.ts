import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/config/apiClient';

interface UploadSessionDto {
  id: string;
  status: string;
  createdAt: string;
}

export const useUploadSessions = () => {
  const client = useQueryClient();
  const key = ['uploads'];

  const query = useQuery({
    queryKey: key,
    queryFn: () => apiClient<UploadSessionDto[]>('/uploads'),
    staleTime: 10_000
  });

  const create = useMutation({
    mutationFn: () =>
      apiClient<{ id: string }>('/uploads', {
        method: 'POST'
      }),
    onSuccess: () => client.invalidateQueries({ queryKey: key })
  });

  return { ...query, create: create.mutateAsync, creating: create.isPending };
};

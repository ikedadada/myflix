import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/config/apiClient';

interface UploadSessionDto {
  id: string;
  status: string;
  createdAt: string;
  objectKey: string;
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
    mutationFn: (file: File) =>
      apiClient<{ id: string; objectKey: string; status: string }>('/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream'
        },
        body: file
      }),
    onSuccess: () => client.invalidateQueries({ queryKey: key })
  });

  return { ...query, create: create.mutateAsync, creating: create.isPending };
};

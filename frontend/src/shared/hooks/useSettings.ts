import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/config/apiClient';
import type { UserSettings } from '@/shared/types/settings';

const queryKey = ['settings'];

export const useSettings = () => {
  const client = useQueryClient();

  const settingsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const payload = await apiClient<Partial<UserSettings>>('/settings');
      return {
        id: payload.id ?? 'temp',
        ownerId: payload.ownerId ?? 'current',
        theme: payload.theme ?? 'system',
        autoplay: payload.autoplay ?? true
      };
    },
    staleTime: 60_000
  });

  const updateMutation = useMutation({
    mutationFn: (input: Pick<UserSettings, 'theme' | 'autoplay'>) =>
      apiClient<UserSettings>('/settings', {
        method: 'PUT',
        body: JSON.stringify(input)
      }),
    onSuccess: () => client.invalidateQueries({ queryKey })
  });

  return { ...settingsQuery, update: updateMutation.mutateAsync, isUpdating: updateMutation.isPending };
};

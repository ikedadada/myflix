import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/app/config/apiClient';
import type { GeneratedVideoCopy, VideoTone } from '@/shared/types/video';

interface GenerateVideoCopyParams {
  file: File;
  tone: VideoTone;
  language?: string;
  userContext?: string;
}

interface GenerateVideoCopyOptions {
  endpoint?: string;
}

export const useGenerateVideoCopy = (options: GenerateVideoCopyOptions = {}) => {
  const endpoint = options.endpoint ?? '/videos/analyze';

  const mutation = useMutation({
    mutationFn: async (params: GenerateVideoCopyParams) => {
      const form = new FormData();
      form.set('video', params.file);
      form.set('tone', params.tone);
      if (params.language) form.set('language', params.language);
      if (params.userContext?.trim()) form.set('userContext', params.userContext.trim());

      return apiClient<GeneratedVideoCopy>(endpoint, {
        method: 'POST',
        body: form
      });
    }
  });

  const getErrorMessage = (error: unknown) => {
    if (error instanceof ApiError) {
      if (error.status === 0) return 'ネットワークエラーが発生しました。';
      return `生成に失敗しました (status: ${error.status})`;
    }
    return '生成に失敗しました。';
  };

  return {
    generate: mutation.mutateAsync,
    isGenerating: mutation.isPending,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
    lastResult: mutation.data ?? null
  };
};

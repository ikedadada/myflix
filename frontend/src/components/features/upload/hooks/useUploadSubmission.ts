import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useToast } from '@/components/shadcn/hooks/useToast'
import { UPLOAD_SESSIONS_QUERY_KEY } from '@/config'
import { apiClient } from '@/lib/api-client'
import type { CreateUploadSessionResponse } from '@/types/upload-session'
import type { VideoSummary } from '@/types/video'

interface UseUploadSubmissionOptions {
  file: File | null
  title: string
  description: string
  durationSeconds: number | null
  uploadThumbnailIfNeeded: () => Promise<string | null>
  onSucceededReset: () => void
}

export const useUploadSubmission = ({
  file,
  title,
  description,
  durationSeconds,
  uploadThumbnailIfNeeded,
  onSucceededReset,
}: UseUploadSubmissionOptions) => {
  const client = useQueryClient()
  const toast = useToast()

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('File is required')
      const thumbnailObjectKey = await uploadThumbnailIfNeeded()
      const upload = await apiClient<CreateUploadSessionResponse>('/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      })
      client.invalidateQueries({ queryKey: UPLOAD_SESSIONS_QUERY_KEY })
      const video = await apiClient<VideoSummary>('/videos', {
        method: 'POST',
        body: JSON.stringify({
          uploadId: upload.id,
          title: title || file.name,
          description: description || 'Uploaded video',
          durationSeconds: durationSeconds ?? 60,
          thumbnailObjectKey,
        }),
      })
      return { uploadId: upload.id, video }
    },
    onSuccess: (result) => {
      toast.success('アップロードが完了しました', {
        description: `Video ID: ${result.video.id}`,
      })
      client.invalidateQueries({ queryKey: ['videos'] })
      onSucceededReset()
    },
    onError: () => {
      toast.error('アップロードに失敗しました', {
        description: '時間をおいて再試行してください',
      })
    },
  })

  const submit = useCallback(() => {
    mutation.mutate()
  }, [mutation])

  return {
    disabled: !file || mutation.isPending,
    isPending: mutation.isPending,
    submit,
  }
}

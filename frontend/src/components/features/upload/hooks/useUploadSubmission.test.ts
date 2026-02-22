import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useUploadSubmission } from './useUploadSubmission'

const queryMocks = vi.hoisted(() => ({
  invalidateQueries: vi.fn(),
  mutationIsPending: false,
}))

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}))

const apiClientMocks = vi.hoisted(() => ({
  fn: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: queryMocks.invalidateQueries,
  }),
  useMutation: (options: {
    mutationFn: () => Promise<unknown>
    onSuccess?: (data: unknown) => void
    onError?: (error: unknown) => void
  }) => ({
    mutate: async () => {
      try {
        const result = await options.mutationFn()
        options.onSuccess?.(result)
      } catch (error) {
        options.onError?.(error)
      }
    },
    get isPending() {
      return queryMocks.mutationIsPending
    },
  }),
}))

vi.mock('@/components/shadcn/hooks/useToast', () => ({
  useToast: () => ({
    success: toastMocks.success,
    error: toastMocks.error,
  }),
}))

vi.mock('@/lib/api-client', () => ({
  apiClient: apiClientMocks.fn,
}))

describe('useUploadSubmission', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryMocks.mutationIsPending = false
  })

  it('submits upload flow and runs success side effects', async () => {
    const file = new File(['video-data'], 'sample.mp4', { type: 'video/mp4' })
    apiClientMocks.fn
      .mockResolvedValueOnce({ id: 'upload-1', objectKey: 'video.bin', status: 'uploaded' })
      .mockResolvedValueOnce({ id: 'video-1' })
    const uploadThumbnailIfNeeded = vi.fn().mockResolvedValue('thumb-1')
    const onSucceededReset = vi.fn()

    const { result } = renderHook(() =>
      useUploadSubmission({
        file,
        title: 'My Title',
        description: 'My Description',
        durationSeconds: 75,
        uploadThumbnailIfNeeded,
        onSucceededReset,
      }),
    )

    await act(async () => {
      result.current.submit()
    })

    await waitFor(() => {
      expect(uploadThumbnailIfNeeded).toHaveBeenCalledTimes(1)
      expect(apiClientMocks.fn).toHaveBeenCalledTimes(2)
      expect(queryMocks.invalidateQueries).toHaveBeenCalledTimes(2)
      expect(onSucceededReset).toHaveBeenCalledTimes(1)
      expect(toastMocks.success).toHaveBeenCalledWith('アップロードが完了しました', {
        description: 'Video ID: video-1',
      })
    })

    const [uploadPath, uploadRequest] = apiClientMocks.fn.mock.calls[0]
    expect(uploadPath).toBe('/uploads')
    expect(uploadRequest.method).toBe('POST')
    expect(uploadRequest.headers).toEqual({
      'Content-Type': 'video/mp4',
    })
    expect(uploadRequest.body).toBe(file)

    const [videoPath, videoRequest] = apiClientMocks.fn.mock.calls[1]
    expect(videoPath).toBe('/videos')
    expect(videoRequest.method).toBe('POST')
    expect(JSON.parse(videoRequest.body)).toEqual({
      uploadId: 'upload-1',
      title: 'My Title',
      description: 'My Description',
      durationSeconds: 75,
      thumbnailObjectKey: 'thumb-1',
    })
  })

  it('runs error side effects when submission fails', async () => {
    const file = new File(['video-data'], 'sample.mp4', { type: 'video/mp4' })
    apiClientMocks.fn.mockRejectedValue(new Error('failed to upload session'))
    const uploadThumbnailIfNeeded = vi.fn().mockResolvedValue(null)
    const onSucceededReset = vi.fn()

    const { result } = renderHook(() =>
      useUploadSubmission({
        file,
        title: '',
        description: '',
        durationSeconds: null,
        uploadThumbnailIfNeeded,
        onSucceededReset,
      }),
    )

    await act(async () => {
      result.current.submit()
    })

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledWith('アップロードに失敗しました', {
        description: '時間をおいて再試行してください',
      })
    })
    expect(onSucceededReset).not.toHaveBeenCalled()
    expect(queryMocks.invalidateQueries).not.toHaveBeenCalled()
    expect(apiClientMocks.fn).toHaveBeenCalledTimes(1)
  })

  it('computes disabled state from file and pending state', () => {
    const uploadThumbnailIfNeeded = vi.fn()
    const onSucceededReset = vi.fn()

    const noFile = renderHook(() =>
      useUploadSubmission({
        file: null,
        title: '',
        description: '',
        durationSeconds: null,
        uploadThumbnailIfNeeded,
        onSucceededReset,
      }),
    )
    expect(noFile.result.current.disabled).toBe(true)

    const withReadyState = renderHook(() =>
      useUploadSubmission({
        file: new File(['x'], 'sample.mp4', { type: 'video/mp4' }),
        title: '',
        description: '',
        durationSeconds: null,
        uploadThumbnailIfNeeded,
        onSucceededReset,
      }),
    )
    expect(withReadyState.result.current.disabled).toBe(false)

    queryMocks.mutationIsPending = true
    const withPending = renderHook(() =>
      useUploadSubmission({
        file: new File(['x'], 'sample.mp4', { type: 'video/mp4' }),
        title: '',
        description: '',
        durationSeconds: null,
        uploadThumbnailIfNeeded,
        onSucceededReset,
      }),
    )
    expect(withPending.result.current.disabled).toBe(true)
    expect(withPending.result.current.isPending).toBe(true)
  })
})

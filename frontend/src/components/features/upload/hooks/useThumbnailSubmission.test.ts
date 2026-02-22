import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api-client'
import { useThumbnailSubmission } from './useThumbnailSubmission'

vi.mock('@/lib/api-client', () => ({
  apiClient: vi.fn(),
}))

describe('useThumbnailSubmission', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uploads selected thumbnail and stores uploaded object key', async () => {
    vi.mocked(apiClient).mockResolvedValue({
      id: 'thumb-1',
      objectKey: 'thumbnails/sample.png',
      status: 'uploaded',
    })

    const { result } = renderHook(() => useThumbnailSubmission())
    const thumbnailFile = new File(['x'], 'sample.png', { type: 'image/png' })

    await act(async () => {
      result.current.setThumbnailBlob(thumbnailFile)
    })

    let uploadedObjectKey: string | null = null
    await act(async () => {
      uploadedObjectKey = await result.current.uploadThumbnailIfNeeded()
    })

    expect(uploadedObjectKey).toBe('thumbnails/sample.png')
    expect(apiClient).toHaveBeenCalledWith('/uploads?kind=thumbnail', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
      },
      body: expect.any(File),
    })
    await waitFor(() => {
      expect(result.current.objectKey).toBe('thumbnails/sample.png')
      expect(result.current.uploading).toBe(false)
    })
  })

  it('skips upload when thumbnail blob is not selected', async () => {
    const { result } = renderHook(() => useThumbnailSubmission())

    let uploadedObjectKey: string | null = 'placeholder'
    await act(async () => {
      uploadedObjectKey = await result.current.uploadThumbnailIfNeeded()
    })

    expect(uploadedObjectKey).toBeNull()
    expect(apiClient).not.toHaveBeenCalled()
  })
})

import { useCallback, useState } from 'react'
import { apiClient } from '@/lib/api-client'

interface ThumbnailUploadResponse {
  id: string
  objectKey: string
  status: string
}

export const useThumbnailSubmission = () => {
  const [thumbnailBlob, setThumbnailBlobState] = useState<Blob | null>(null)
  const [objectKey, setObjectKey] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const setThumbnailBlob = useCallback((blob: Blob | null) => {
    setThumbnailBlobState(blob)
    setObjectKey(null)
  }, [])

  const reset = useCallback(() => {
    setThumbnailBlobState(null)
    setObjectKey(null)
    setUploading(false)
  }, [])

  const uploadThumbnailIfNeeded = useCallback(async () => {
    if (objectKey || !thumbnailBlob) {
      return objectKey
    }

    setUploading(true)
    try {
      const res = await apiClient<ThumbnailUploadResponse>('/uploads?kind=thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': thumbnailBlob.type || 'image/png',
        },
        body: thumbnailBlob,
      })
      setObjectKey(res.objectKey)
      return res.objectKey
    } finally {
      setUploading(false)
    }
  }, [objectKey, thumbnailBlob])

  return {
    objectKey,
    reset,
    setThumbnailBlob,
    uploadThumbnailIfNeeded,
    uploading,
  }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { generateVideoThumbnail } from '@/lib/generate-video-thumbnail'

interface UseAutoThumbnailOptions {
  file: File | null
  enabled: boolean
}

interface AutoThumbnailSelectionState {
  source: 'auto'
  blob: Blob | null
  previewUrl: string | null
  fileName: string | null
  error: string | null
  generating: boolean
}

const initialState: AutoThumbnailSelectionState = {
  source: 'auto',
  blob: null,
  previewUrl: null,
  fileName: null,
  error: null,
  generating: false,
}

export const useAutoThumbnail = ({ file, enabled }: UseAutoThumbnailOptions) => {
  const selectedVideoKey = file ? `${file.name}-${file.size}-${file.lastModified}` : null
  const [current, setCurrent] = useState(initialState)
  const previewRef = useRef<string | null>(null)
  const generatedForRef = useRef<string | null>(null)

  const revokePreview = useCallback(() => {
    if (!previewRef.current) return
    URL.revokeObjectURL(previewRef.current)
    previewRef.current = null
  }, [])

  const clear = useCallback(() => {
    revokePreview()
    setCurrent((prev) => ({
      ...prev,
      blob: null,
      previewUrl: null,
      fileName: null,
      error: null,
      generating: false,
    }))
  }, [revokePreview])

  const setPreview = useCallback(
    (blob: Blob) => {
      revokePreview()
      const previewUrl = URL.createObjectURL(blob)
      previewRef.current = previewUrl
      setCurrent((prev) => ({
        ...prev,
        blob,
        previewUrl,
        fileName: '自動生成サムネイル',
      }))
    },
    [revokePreview],
  )

  useEffect(() => {
    generatedForRef.current = selectedVideoKey
    clear()
  }, [clear, selectedVideoKey])

  useEffect(
    () => () => {
      revokePreview()
    },
    [revokePreview],
  )

  useEffect(() => {
    if (!file || !selectedVideoKey) return

    if (!enabled) {
      if (current.generating) {
        setCurrent((prev) => ({ ...prev, generating: false }))
      }
      return
    }

    if (generatedForRef.current === selectedVideoKey && current.blob) {
      return
    }

    generatedForRef.current = selectedVideoKey
    const abortController = new AbortController()
    let active = true

    setCurrent((prev) => ({
      ...prev,
      error: null,
      generating: true,
    }))

    void (async () => {
      try {
        const blob = await generateVideoThumbnail(file, {
          signal: abortController.signal,
        })
        if (!active || abortController.signal.aborted) return
        setPreview(blob)
        setCurrent((prev) => ({
          ...prev,
          error: null,
          generating: false,
        }))
      } catch (error) {
        if (!active || abortController.signal.aborted) return
        if (error instanceof DOMException && error.name === 'AbortError') return
        console.error('Auto thumbnail failed', error)
        clear()
        setCurrent((prev) => ({
          ...prev,
          error: '自動サムネ生成に失敗しました（任意でアップロードしてください）',
        }))
      }
    })()

    return () => {
      active = false
      abortController.abort()
    }
  }, [clear, current.blob, current.generating, enabled, file, selectedVideoKey, setPreview])

  return {
    current,
  }
}

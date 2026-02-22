import { useCallback, useEffect, useRef, useState } from 'react'

interface UseManualThumbnailOptions {
  resetKey: string | null
}

interface ManualThumbnailSelectionState {
  source: 'manual'
  blob: File
  previewUrl: string | null
  fileName: string
  error: null
  generating: false
}

export const useManualThumbnail = ({ resetKey }: UseManualThumbnailOptions) => {
  const previewRef = useRef<string | null>(null)
  const previousResetKeyRef = useRef<string | null>(null)
  const [current, setCurrent] = useState<ManualThumbnailSelectionState | null>(null)

  const revokePreview = useCallback(() => {
    if (!previewRef.current) return
    URL.revokeObjectURL(previewRef.current)
    previewRef.current = null
  }, [])

  const clear = useCallback(() => {
    revokePreview()
    setCurrent(null)
  }, [revokePreview])

  const select = useCallback(
    (selectedFile: File | null) => {
      if (!selectedFile) {
        clear()
        return
      }

      revokePreview()
      const nextPreviewUrl = URL.createObjectURL(selectedFile)
      previewRef.current = nextPreviewUrl
      setCurrent({
        source: 'manual',
        blob: selectedFile,
        previewUrl: nextPreviewUrl,
        fileName: selectedFile.name,
        error: null,
        generating: false,
      })
    },
    [clear, revokePreview],
  )

  useEffect(() => {
    if (previousResetKeyRef.current === resetKey) return
    previousResetKeyRef.current = resetKey
    clear()
  }, [clear, resetKey])

  useEffect(
    () => () => {
      revokePreview()
    },
    [revokePreview],
  )

  return {
    current,
    clear,
    select,
  }
}

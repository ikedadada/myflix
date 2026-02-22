import { type ChangeEvent, useCallback, useEffect, useId, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui'

interface UploadStepFileCardProps {
  file: File | null
  setFile: (file: File | null) => void
  durationSeconds: number | null
  setDurationSeconds: (durationSeconds: number | null) => void
}

const readVideoDurationSeconds = async (file: File, signal: AbortSignal) => {
  const objectUrl = URL.createObjectURL(file)
  const videoEl = document.createElement('video')
  videoEl.preload = 'metadata'

  try {
    const duration = await new Promise<number | null>((resolve) => {
      const handleLoadedMetadata = () => {
        cleanup()
        resolve(Math.max(1, Math.round(videoEl.duration || 0)))
      }
      const handleError = () => {
        cleanup()
        resolve(60)
      }
      const handleAbort = () => {
        cleanup()
        resolve(null)
      }
      const cleanup = () => {
        videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata)
        videoEl.removeEventListener('error', handleError)
        signal.removeEventListener('abort', handleAbort)
      }

      videoEl.addEventListener('loadedmetadata', handleLoadedMetadata)
      videoEl.addEventListener('error', handleError)
      signal.addEventListener('abort', handleAbort)

      if (signal.aborted) {
        cleanup()
        resolve(null)
        return
      }

      videoEl.src = objectUrl
      videoEl.load()
    })
    return duration
  } finally {
    videoEl.removeAttribute('src')
    videoEl.load()
    URL.revokeObjectURL(objectUrl)
  }
}

export const UploadStepFileCard = ({
  file,
  setFile,
  durationSeconds,
  setDurationSeconds,
}: UploadStepFileCardProps) => {
  const inputId = useId()
  const durationAbortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      durationAbortControllerRef.current?.abort()
    }
  }, [])

  const handleInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      durationAbortControllerRef.current?.abort()
      const selectedFile = event.target.files?.[0] ?? null

      if (!selectedFile) {
        setFile(null)
        setDurationSeconds(null)
        return
      }

      const durationAbortController = new AbortController()
      durationAbortControllerRef.current = durationAbortController

      setFile(selectedFile)
      setDurationSeconds(null)

      try {
        const detectedDuration = await readVideoDurationSeconds(
          selectedFile,
          durationAbortController.signal,
        )
        if (detectedDuration == null) return

        setDurationSeconds(detectedDuration)
      } finally {
        if (durationAbortControllerRef.current === durationAbortController) {
          durationAbortControllerRef.current = null
        }
      }
    },
    [setDurationSeconds, setFile],
  )

  return (
    <Card className='border-border/80'>
      <CardHeader className='pb-3'>
        <div className='flex flex-col gap-1'>
          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            ステップ 1
          </p>
          <CardTitle className='text-xl'>動画ファイルを選択</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-2 pt-0'>
        <Input
          key={file ? `${file.name}-${file.size}-${file.lastModified}` : 'empty-file'}
          id={inputId}
          type='file'
          accept='video/*'
          className='border-dashed'
          onChange={handleInputChange}
        />
        {file && (
          <div className='flex justify-end text-xs text-muted-foreground'>
            <p>動画時間: {durationSeconds ? `${durationSeconds} 秒` : '検出中…'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

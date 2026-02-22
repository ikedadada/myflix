interface GenerateVideoThumbnailOptions {
  signal: AbortSignal
  seekTimeSeconds?: number
  targetWidth?: number
  targetHeight?: number
}

const createAbortError = () => new DOMException('Operation aborted', 'AbortError')

const waitForSeekedFrame = async (
  videoEl: HTMLVideoElement,
  seekTimeSeconds: number,
  signal: AbortSignal,
) => {
  await new Promise<void>((resolve, reject) => {
    const handleAbort = () => {
      cleanup()
      reject(createAbortError())
    }
    const handleError = () => {
      cleanup()
      reject(new Error('Failed to load video for thumbnail generation'))
    }
    const handleLoadedData = () => {
      videoEl.currentTime = seekTimeSeconds
    }
    const handleSeeked = () => {
      cleanup()
      resolve()
    }
    const cleanup = () => {
      signal.removeEventListener('abort', handleAbort)
      videoEl.removeEventListener('error', handleError)
      videoEl.removeEventListener('loadeddata', handleLoadedData)
      videoEl.removeEventListener('seeked', handleSeeked)
    }

    if (signal.aborted) {
      reject(createAbortError())
      return
    }

    signal.addEventListener('abort', handleAbort)
    videoEl.addEventListener('error', handleError)
    videoEl.addEventListener('loadeddata', handleLoadedData)
    videoEl.addEventListener('seeked', handleSeeked)
    videoEl.load()
  })
}

const centerCropTo16by9 = (width: number, height: number) => {
  const targetAspect = 16 / 9
  const sourceAspect = width / height

  if (sourceAspect > targetAspect) {
    const cropWidth = height * targetAspect
    return {
      sx: (width - cropWidth) / 2,
      sy: 0,
      sw: cropWidth,
      sh: height,
    }
  }

  const cropHeight = width / targetAspect
  return {
    sx: 0,
    sy: (height - cropHeight) / 2,
    sw: width,
    sh: cropHeight,
  }
}

const renderVideoFrameToBlob = async (
  videoEl: HTMLVideoElement,
  targetWidth: number,
  targetHeight: number,
) => {
  const sourceWidth = videoEl.videoWidth || targetWidth
  const sourceHeight = videoEl.videoHeight || targetHeight
  const { sx, sy, sw, sh } = centerCropTo16by9(sourceWidth, sourceHeight)

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas unsupported')
  }
  ctx.drawImage(videoEl, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((thumbnailBlob) => resolve(thumbnailBlob), 'image/png'),
  )
  if (!blob) {
    throw new Error('Failed to create thumbnail blob')
  }
  return blob
}

export const generateVideoThumbnail = async (
  file: File,
  {
    signal,
    seekTimeSeconds = 0.1,
    targetWidth = 640,
    targetHeight = 360,
  }: GenerateVideoThumbnailOptions,
) => {
  const objectUrl = URL.createObjectURL(file)
  const videoEl = document.createElement('video')
  videoEl.src = objectUrl
  videoEl.muted = true
  videoEl.playsInline = true
  videoEl.preload = 'auto'
  videoEl.crossOrigin = 'anonymous'

  try {
    await waitForSeekedFrame(videoEl, seekTimeSeconds, signal)
    return renderVideoFrameToBlob(videoEl, targetWidth, targetHeight)
  } finally {
    videoEl.removeAttribute('src')
    videoEl.load()
    URL.revokeObjectURL(objectUrl)
  }
}

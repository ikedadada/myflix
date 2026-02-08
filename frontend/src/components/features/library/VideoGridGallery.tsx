import { useCallback, useEffect, useRef, useState } from 'react'
import { useResizeObserver } from 'usehooks-ts'
import { VideoCard, VideoCardHoverPreset } from '@/components/features/library/VideoCard'
import type { VideoSummary } from '@/types/video'

interface VideoGridGalleryProps {
  videos: VideoSummary[]
}

export const VideoGridGallery = ({ videos }: VideoGridGalleryProps) => {
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [gridColumnCount, setGridColumnCount] = useState(1)

  const update = useCallback(() => {
    if (videos.length === 0) {
      setGridColumnCount(1)
      return
    }
    const node = gridRef.current
    if (!node) return
    const sampleCard = node.querySelector<HTMLElement>('[data-video-card]')
    const cardWidth = sampleCard?.offsetWidth || 300
    const gridWidth = node.clientWidth || cardWidth
    const nextColumns = Math.max(1, Math.floor(gridWidth / Math.max(cardWidth, 1)))
    setGridColumnCount(nextColumns)
  }, [videos.length])

  useResizeObserver({ ref: gridRef, onResize: update })
  useEffect(() => {
    update()
  }, [update])

  return (
    <div ref={gridRef} className='grid gap-4 md:grid-cols-3'>
      {videos.map((video, idx) => {
        const colIndex = idx % gridColumnCount
        const isLeftCol = colIndex === 0
        const isRightCol = colIndex === gridColumnCount - 1
        let hoverPreset: VideoCardHoverPreset = 'expand-center'
        if (gridColumnCount > 1) {
          if (isLeftCol && !isRightCol) {
            hoverPreset = 'expand-right'
          } else if (isRightCol && !isLeftCol) {
            hoverPreset = 'expand-left'
          }
        } else {
          hoverPreset = 'none'
        }
        return (
          <div key={video.id} data-video-card>
            <VideoCard video={video} hoverPreset={hoverPreset} />
          </div>
        )
      })}
    </div>
  )
}

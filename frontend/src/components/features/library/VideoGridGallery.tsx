import { useEffect, useRef, useState } from 'react'
import { VideoCard } from '@/components/features/library/VideoCard'
import type { VideoSummary } from '@/types/video'

interface VideoGridGalleryProps {
  videos: VideoSummary[]
}

export const VideoGridGallery = ({ videos }: VideoGridGalleryProps) => {
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const measure = () => {
      const firstCard = grid.querySelector<HTMLElement>('[data-video-card]')
      const cardWidth = firstCard?.offsetWidth || 300
      const containerWidth = grid.clientWidth || cardWidth
      const next = Math.max(1, Math.floor(containerWidth / Math.max(cardWidth, 1)))
      setColumns(next)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={gridRef} className='grid gap-4 md:grid-cols-3'>
      {videos.map((video, idx) => {
        const colIndex = columns > 0 ? idx % columns : 0
        const direction = colIndex === 0 ? 'right' : colIndex === columns - 1 ? 'left' : 'center'
        return (
          <div key={video.id} data-video-card>
            <VideoCard
              video={video}
              hoverPreset={columns > 1 ? 'expand' : 'none'}
              hoverDirection={columns > 1 ? direction : undefined}
            />
          </div>
        )
      })}
    </div>
  )
}

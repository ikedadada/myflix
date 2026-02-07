import { useEffect, useRef, useState } from 'react'
import { VideoCard } from '@/components/features/library/VideoCard'
import type { VideoSummary } from '@/types/video'

interface VideoCarouselSectionProps {
  title: string
  videos: VideoSummary[]
}

export const VideoCarouselSection = ({ title, videos }: VideoCarouselSectionProps) => {
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const node = sliderRef.current
    if (!node) return
    const update = () => {
      const { scrollLeft, clientWidth, scrollWidth } = node
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
    }
    update()
    node.addEventListener('scroll', update, { passive: true })
    const resize = () => update()
    window.addEventListener('resize', resize)
    return () => {
      node.removeEventListener('scroll', update)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const itemCount = videos.length
    if (itemCount === 0) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    const node = sliderRef.current
    if (!node) return
    const { scrollLeft, clientWidth, scrollWidth } = node
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
  }, [videos.length])

  const scrollBy = (direction: 'left' | 'right') => {
    const node = sliderRef.current
    if (!node) return
    const firstItem = node.firstElementChild as HTMLElement | null
    const gap = Number.parseFloat(getComputedStyle(node).columnGap || '0') || 0
    const itemWidth = firstItem?.offsetWidth ?? node.clientWidth * 0.8
    const amount = itemWidth + gap
    node.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  if (videos.length === 0) return null

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-text'>{title}</h2>
        <div className='ml-4 h-px flex-1 bg-border' />
      </div>
      <div className='relative overflow-visible'>
        {canScrollLeft && (
          <button
            type='button'
            aria-label='左にスクロール'
            onClick={() => scrollBy('left')}
            className='group absolute left-2 top-1/2 z-30 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent'
          >
            <span className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-text shadow-lg backdrop-blur transition group-hover:bg-accent/15'>
              ‹
            </span>
          </button>
        )}
        {canScrollRight && (
          <button
            type='button'
            aria-label='右にスクロール'
            onClick={() => scrollBy('right')}
            className='group absolute right-2 top-1/2 z-30 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent'
          >
            <span className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-text shadow-lg backdrop-blur transition group-hover:bg-accent/15'>
              ›
            </span>
          </button>
        )}
        <div
          ref={sliderRef}
          className='no-scrollbar flex gap-4 overflow-x-auto overflow-y-visible py-5 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent'
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {videos.map((video, idx) => {
            const direction = idx === 0 ? 'right' : idx === videos.length - 1 ? 'left' : 'center'
            return (
              <div
                key={video.id}
                className='min-w-[280px] max-w-[320px] flex-shrink-0 scroll-snap-align-start'
              >
                <VideoCard video={video} hoverPreset='expand' hoverDirection={direction} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useEventListener, useResizeObserver } from 'usehooks-ts'
import { VideoCard } from '@/components/features/library/VideoCard'
import type { VideoSummary } from '@/types/video'

interface VideoCarouselSectionProps {
  title: string
  videos: VideoSummary[]
}

const ScrollNavButton = ({
  label,
  onClick,
  position,
}: {
  label: string
  onClick: () => void
  position: 'left' | 'right'
}) => (
  <button
    type='button'
    aria-label={label}
    onClick={onClick}
    className={`group absolute ${position === 'left' ? 'left-2' : 'right-2'} top-1/2 z-30 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
  >
    <span className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-text shadow-lg backdrop-blur transition group-hover:bg-accent/15'>
      {position === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </span>
  </button>
)

export const VideoCarouselSection = ({ title, videos }: VideoCarouselSectionProps) => {
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const [scrollState, setScrollState] = useState({ canLeft: false, canRight: false })

  const update = useCallback(() => {
    if (videos.length === 0) {
      setScrollState({ canLeft: false, canRight: false })
      return
    }
    const node = sliderRef.current
    if (!node) return
    const { scrollLeft, clientWidth, scrollWidth } = node
    const hasOverflowLeft = scrollLeft > 0
    const hasOverflowRight = scrollLeft + clientWidth < scrollWidth - 1
    setScrollState({
      canLeft: hasOverflowLeft,
      canRight: hasOverflowRight,
    })
  }, [videos.length])

  useEventListener('scroll', update, sliderRef)
  useResizeObserver({ ref: sliderRef, onResize: update })
  useEffect(() => {
    update()
  }, [update])

  const scrollByCard = (direction: 'left' | 'right') => {
    const node = sliderRef.current
    if (!node) return
    // Scroll by one card width plus gap to align the next card edge.
    const sampleCard = node.firstElementChild as HTMLElement | null
    const columnGap = Number.parseFloat(getComputedStyle(node).columnGap || '0') || 0
    const cardWidth = sampleCard?.offsetWidth ?? node.clientWidth * 0.8
    const scrollAmount = cardWidth + columnGap
    node.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
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
        {scrollState.canLeft && (
          <ScrollNavButton
            label='左にスクロール'
            position='left'
            onClick={() => scrollByCard('left')}
          />
        )}
        <div
          ref={sliderRef}
          className='no-scrollbar flex gap-4 overflow-x-auto overflow-y-visible py-5 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent'
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {videos.map((video, idx) => {
            const isLeftEnd = idx === 0
            const isRightEnd = idx === videos.length - 1
            const hoverPreset = isLeftEnd
              ? 'expand-right'
              : isRightEnd
                ? 'expand-left'
                : 'expand-center'
            return (
              <div
                key={video.id}
                className='min-w-[280px] max-w-[320px] flex-shrink-0 scroll-snap-align-start'
              >
                <VideoCard video={video} hoverPreset={hoverPreset} />
              </div>
            )
          })}
        </div>
        {scrollState.canRight && (
          <ScrollNavButton
            label='右にスクロール'
            position='right'
            onClick={() => scrollByCard('right')}
          />
        )}
      </div>
    </div>
  )
}

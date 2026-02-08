import { Link } from '@tanstack/react-router'
import defaultThumb from '@/assets/default-thumbnail.svg'
import { Badge, Card } from '@/components/ui'
import { buildApiUrl } from '@/lib/api-client'
import { formatDuration } from '@/lib/format-duration'
import type { VideoSummary } from '@/types/video'

export type VideoCardHoverPreset =
  | 'none'
  | 'subtle-left'
  | 'subtle-center'
  | 'subtle-right'
  | 'expand-left'
  | 'expand-center'
  | 'expand-right'

interface Props {
  video: VideoSummary
  hoverPreset?: VideoCardHoverPreset
}

const getVideoCardHoverClasses = ({
  preset,
}: {
  preset: VideoCardHoverPreset
}) => {
  if (preset === 'none') return ''

  const [intensity, direction] = preset.split('-') as [
    'subtle' | 'expand',
    'left' | 'center' | 'right',
  ]
  const scale = intensity === 'expand' ? 'hover:scale-[1.2]' : 'hover:scale-[1.03]'
  const emphasis =
    intensity === 'expand'
      ? 'hover:border-accent/60 hover:shadow-2xl'
      : 'hover:border-accent/40 hover:shadow-xl'
  const translate =
    intensity === 'expand'
      ? direction === 'right'
        ? 'hover:translate-x-8'
        : direction === 'left'
          ? 'hover:-translate-x-8'
          : ''
      : ''

  return [scale, emphasis, translate].filter(Boolean).join(' ')
}

const resolveThumbUrl = (url: string | null): string => {
  if (!url) return defaultThumb
  if (url.startsWith('http')) return url
  if (url.startsWith('/api/')) return buildApiUrl(url.replace(/^\/api\//, ''))
  return buildApiUrl(url)
}

export const VideoCard = ({ video, hoverPreset }: Props) => {
  const thumb = resolveThumbUrl(video.thumbnailUrl ?? null)
  const preset = hoverPreset ?? 'none'
  const hoverClasses = getVideoCardHoverClasses({ preset })
  return (
    <Card
      className={`group relative z-0 overflow-hidden border-border/80 p-0 transform transition duration-300 ease-out hover:z-20 ${hoverClasses}`}
    >
      <Link to='/videos/$videoId' params={{ videoId: video.id }} className='block h-full'>
        <div className='relative aspect-video w-full overflow-hidden'>
          <img
            src={thumb}
            alt={video.title}
            className='h-full w-full object-cover transition duration-300 ease-out group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-95 transition group-hover:opacity-100' />
          <div className='absolute inset-x-0 bottom-0 flex items-start gap-2 p-3'>
            <span className='mt-1 h-6 w-1 rounded-full bg-accent' aria-hidden />
            <div className='min-w-0 flex-1 space-y-1'>
              <p className='line-clamp-2 text-base font-semibold text-foreground drop-shadow'>
                {video.title}
              </p>
              <div className='flex items-center justify-end gap-2 text-xs text-muted-foreground'>
                <Badge variant='secondary' className='rounded-full'>
                  #{video.id.slice(0, 6)}
                </Badge>
                <Badge variant='outline' className='gap-1 rounded-full'>
                  <span className='h-1.5 w-1.5 rounded-full bg-accent' aria-hidden />
                  {formatDuration(video.durationSeconds)}
                </Badge>
              </div>
            </div>
          </div>
          <div className='absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-background/95 via-background/80 to-transparent px-3 pb-3 pt-10 text-sm text-muted-foreground opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100'>
            <p className='line-clamp-2'>{video.description || '説明がありません。'}</p>
          </div>
        </div>
        <h3 className='sr-only'>{video.title}</h3>
      </Link>
    </Card>
  )
}

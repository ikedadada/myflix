import type { VideoSummary } from '@/shared/types/video';
import { Link } from '@tanstack/react-router';
import { formatDuration } from '@/shared/lib/format-duration';
import defaultThumb from '@/assets/default-thumbnail.svg';
import { buildApiUrl } from '@/app/config/env';

interface Props {
  video: VideoSummary;
}

const resolveThumbUrl = (url: string | null): string => {
  if (!url) return defaultThumb;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/api/')) return buildApiUrl(url.replace(/^\/api\//, ''));
  return buildApiUrl(url);
};

export const VideoCard = ({ video }: Props) => {
  const thumb = resolveThumbUrl(video.thumbnailUrl ?? null);
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg">
      <Link to="/videos/$videoId" params={{ videoId: video.id }} className="block h-full">
        <div className="relative aspect-video w-full">
          <img src={thumb} alt={video.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/45 to-transparent opacity-95 transition group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 flex items-start gap-2 p-3">
            <span className="mt-1 h-6 w-1 rounded-full bg-accent" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-base font-semibold text-text drop-shadow">
                {video.title}
              </p>
              <div className="mt-1 flex items-center justify-end gap-2 text-xs text-muted">
                <span className="rounded-full border border-border bg-card/80 px-2 py-1">#{video.id.slice(0, 6)}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/80 px-2 py-1 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  {formatDuration(video.durationSeconds)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <h3 className="sr-only">{video.title}</h3>
        {/* description intentionally omitted for a minimalist card */}
      </Link>
    </article>
  );
};

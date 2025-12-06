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
    <Link
      to="/videos/$videoId"
      params={{ videoId: video.id }}
      className="group block rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg hover:shadow-black/30"
    >
      <div className="relative mb-3 overflow-hidden rounded-md border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/20">
        <img src={thumb} alt={video.title} className="h-40 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 flex items-start gap-2 p-3">
          <span className="mt-1 h-6 w-1 rounded-full bg-cyan-400" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-base font-semibold text-white drop-shadow">
              {video.title}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-white/80">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden />
                {formatDuration(video.durationSeconds)}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1">#{video.id.slice(0, 6)}</span>
            </div>
          </div>
        </div>
      </div>
      <h3 className="sr-only">{video.title}</h3>
      <p className="text-sm text-white/70 line-clamp-2">{video.description}</p>
    </Link>
  );
};

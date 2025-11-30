import type { VideoSummary } from '@/shared/types/video';
import { Link } from '@tanstack/react-router';
import { formatDuration } from '@/shared/lib/format-duration';

interface Props {
  video: VideoSummary;
}

export const VideoCard = ({ video }: Props) => {
  const thumb = video.thumbnailUrl;
  return (
    <Link
      to="/videos/$videoId"
      params={{ videoId: video.id }}
      className="block rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/20"
    >
      <div className="mb-3 overflow-hidden rounded-md border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/20">
        {thumb ? (
          <img src={thumb} alt={video.title} className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-40 w-full items-center justify-center text-xs text-white/50">
            No thumbnail
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>{formatDuration(video.durationSeconds)}</span>
        <span>#{video.id.slice(0, 6)}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{video.title}</h3>
      <p className="text-sm text-white/70 line-clamp-2">{video.description}</p>
    </Link>
  );
};

import type { VideoSummary } from '@/shared/types/video';
import { Link } from '@tanstack/react-router';
import { formatDuration } from '@/shared/lib/format-duration';

interface Props {
  video: VideoSummary;
}

export const VideoCard = ({ video }: Props) => {
  return (
    <Link
      to="/videos/$videoId"
      params={{ videoId: video.id }}
      className="block rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/20"
    >
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>{formatDuration(video.durationSeconds)}</span>
        <span>#{video.id.slice(0, 6)}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{video.title}</h3>
      <p className="text-sm text-white/70 line-clamp-2">{video.description}</p>
    </Link>
  );
};

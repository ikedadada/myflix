import type { VideoSummary } from '@/shared/types/video';
import { formatDuration } from '@/shared/lib/format-duration';

interface Props {
  video: VideoSummary;
}

export const VideoCard = ({ video }: Props) => {
  return (
    <article className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>{formatDuration(video.durationSeconds)}</span>
        <span>#{video.id.slice(0, 6)}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{video.title}</h3>
      <p className="text-sm text-white/70">{video.description}</p>
    </article>
  );
};

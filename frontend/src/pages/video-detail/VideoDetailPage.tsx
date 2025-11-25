import { useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import { useVideos } from '@/shared/hooks/useVideos';
import { buildApiUrl } from '@/app/config/env';
import { formatDuration } from '@/shared/lib/format-duration';

export const VideoDetailPage = () => {
  const { videoId } = useParams({ from: '/videos/$videoId' });
  const { data: videos, isLoading, isError } = useVideos();

  const video = useMemo(() => videos?.find((v) => v.id === videoId), [videos, videoId]);
  const streamUrl = useMemo(
    () => (video ? buildApiUrl(`/videos/${video.id}/stream`) : ''),
    [video]
  );

  if (isLoading) {
    return <p className="text-white/70">Loading video…</p>;
  }
  if (isError) {
    return <p className="text-red-400">Failed to load video.</p>;
  }
  if (!video) {
    return <p className="text-white/70">Video not found.</p>;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs text-white/50">#{video.id.slice(0, 6)}</p>
        <h1 className="text-3xl font-semibold">{video.title}</h1>
        <p className="text-white/70">{video.description}</p>
        <p className="text-sm text-white/60">Duration: {formatDuration(video.durationSeconds)}</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black">
        {streamUrl ? (
          <video key={streamUrl} controls className="h-full w-full" src={streamUrl} />
        ) : (
          <p className="p-4 text-white/60">No stream available.</p>
        )}
      </div>
    </section>
  );
};

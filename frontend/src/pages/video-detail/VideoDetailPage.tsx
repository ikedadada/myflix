import { useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import { useVideos } from '@/shared/hooks/useVideos';
import { buildApiUrl } from '@/app/config/env';
import { formatDuration } from '@/shared/lib/format-duration';
import defaultThumb from '@/assets/default-thumbnail.svg';

export const VideoDetailPage = () => {
  const { videoId } = useParams({ from: '/videos/$videoId' });
  const { data: videos, isLoading, isError } = useVideos();

  const video = useMemo(() => videos?.find((v) => v.id === videoId), [videos, videoId]);
  const streamUrl = useMemo(
    () => (video ? buildApiUrl(`/videos/${video.id}/stream`) : ''),
    [video]
  );
  const captionsUrl = useMemo(
    () => (video ? buildApiUrl(`/videos/${video.id}/captions.vtt`) : ''),
    [video]
  );
  const resolveThumbUrl = (url: string | null): string => {
    if (!url) return defaultThumb;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/api/')) return buildApiUrl(url.replace(/^\/api\//, ''));
    return buildApiUrl(url);
  };
  const thumbnailUrl = resolveThumbUrl(video?.thumbnailUrl ?? null);

  if (isLoading) {
    return <p className="text-muted">Loading video…</p>;
  }
  if (isError) {
    return <p className="text-danger">Failed to load video.</p>;
  }
  if (!video) {
    return <p className="text-muted">Video not found.</p>;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs text-muted">#{video.id.slice(0, 6)}</p>
        <h1 className="text-3xl font-semibold text-text">{video.title}</h1>
        <p className="text-muted">{video.description}</p>
        <p className="text-sm text-muted">Duration: {formatDuration(video.durationSeconds)}</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <img src={thumbnailUrl} alt={video.title} className="h-48 w-full object-cover" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {streamUrl ? (
          <video key={streamUrl} controls className="h-full w-full" src={streamUrl}>
            <track kind="captions" src={captionsUrl} label="Captions" srcLang="en" />
          </video>
        ) : (
          <p className="p-4 text-muted">No stream available.</p>
        )}
      </div>
    </section>
  );
};

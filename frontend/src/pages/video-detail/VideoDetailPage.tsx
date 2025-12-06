import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useVideos } from '@/shared/hooks/useVideos';
import { buildApiUrl } from '@/app/config/env';
import defaultThumb from '@/assets/default-thumbnail.svg';
import { Link } from '@tanstack/react-router';

export const VideoDetailPage = () => {
  const { videoId } = useParams({ from: '/videos/$videoId' });
  const { data: videos, isLoading, isError } = useVideos();
  const [showOverlay, setShowOverlay] = useState(true);
  const hideTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    return () => {
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current);
      }
    };
  }, []);

  const bumpOverlay = () => {
    setShowOverlay(true);
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
    }
    hideTimer.current = window.setTimeout(() => setShowOverlay(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-muted">
        Loading video…
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-danger">
        Failed to load video.
      </div>
    );
  }
  if (!video) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-muted">
        Video not found.
      </div>
    );
  }

  return (
    <section className="flex min-h-screen flex-col bg-surface">
      <div
        ref={containerRef}
        className="relative flex-1 min-h-0 overflow-hidden bg-black"
      >
        {streamUrl ? (
          <video
            key={streamUrl}
            controls
            className="h-full w-full max-h-screen max-w-screen object-contain"
            src={streamUrl}
            poster={thumbnailUrl}
            onMouseMove={bumpOverlay}
          >
            <track kind="captions" src={captionsUrl} label="Captions" srcLang="en" />
          </video>
        ) : (
          <div className="flex h-full items-center justify-center bg-card">
            <p className="text-muted">No stream available.</p>
          </div>
        )}
        <div
          className={`pointer-events-none absolute inset-0 flex flex-col transition-opacity duration-300 ${
            showOverlay ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="pointer-events-auto flex w-full items-center justify-between gap-3 p-4">
            <Link
              to="/"
              className="rounded-full bg-card/80 px-3 py-2 text-sm font-medium text-text shadow-md backdrop-blur transition hover:bg-card"
            >
              ← Back
            </Link>
            <div className="inline-flex max-w-full items-center gap-3 rounded-full bg-card/80 px-4 py-2 backdrop-blur">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                Now Playing
              </span>
              <span className="truncate text-sm font-medium text-text">{video.title}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

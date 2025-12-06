import { useEffect, useRef, useState } from 'react';
import { useVideos } from '@/shared/hooks/useVideos';
import { VideoCard } from '@/features/video-card/VideoCard';

export const HomePage = () => {
  const { data: videos, isLoading, isError } = useVideos();

  return (
    <section className="space-y-8">
      {isError && <p className="text-danger">Failed to load your library.</p>}
      {isLoading && !videos && <p className="text-muted">Loading videos…</p>}
      {!isLoading && videos?.length === 0 && <p className="text-muted">No videos yet.</p>}

      {videos && videos.length > 0 && (
        <div className="space-y-6">
          <Section title="My Library" videos={videos} />
        </div>
      )}
    </section>
  );
};

const Section = ({ title, videos }: { title: string; videos: ReturnType<typeof useVideos>['data'] }) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const node = sliderRef.current;
    if (!node) return;
    const update = () => {
      const { scrollLeft, clientWidth, scrollWidth } = node;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };
    update();
    node.addEventListener('scroll', update, { passive: true });
    const resize = () => update();
    window.addEventListener('resize', resize);
    return () => {
      node.removeEventListener('scroll', update);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const itemCount = videos?.length ?? 0;
    if (itemCount === 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const node = sliderRef.current;
    if (!node) return;
    const { scrollLeft, clientWidth, scrollWidth } = node;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, [videos?.length]);
  const scrollBy = (direction: 'left' | 'right') => {
    const node = sliderRef.current;
    if (!node) return;
    const amount = node.clientWidth * 0.8;
    node.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };
  const showNav = (videos?.length ?? 0) > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        <div className="ml-4 h-px flex-1 bg-border" />
      </div>
      <div className="relative">
        {showNav && canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy('left')}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card/90 px-2 py-2 text-text shadow-lg backdrop-blur hover:bg-accent/15 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            ‹
          </button>
        )}
        {showNav && canScrollRight && (
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy('right')}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card/90 px-2 py-2 text-text shadow-lg backdrop-blur hover:bg-accent/15 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            ›
          </button>
        )}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-hidden pb-3"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {videos?.map((video) => (
            <div
              key={video.id}
              className="min-w-[280px] max-w-[320px] flex-shrink-0 scroll-snap-align-start"
            >
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

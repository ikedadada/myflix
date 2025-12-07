import { useEffect, useRef, useState } from 'react';
import { VideoCard } from '@/features/library/VideoCard';
import { useVideos } from '@/shared/hooks/useVideos';
import { PageHeader } from '@/shared/components/layout/PageHeader';

export const LibraryPage = () => {
  const { data: videos, isLoading } = useVideos();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      const firstCard = grid.querySelector<HTMLElement>('[data-video-card]');
      const cardWidth = firstCard?.offsetWidth || 300;
      const containerWidth = grid.clientWidth || cardWidth;
      const next = Math.max(1, Math.floor(containerWidth / Math.max(cardWidth, 1)));
      setColumns(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="space-y-4">
      <PageHeader
        title="ライブラリ"
        description="アップロード済みの動画一覧を表示します。"
      />
      {isLoading && <p className="text-muted-foreground">読み込み中…</p>}
      <div ref={gridRef} className="grid gap-4 md:grid-cols-3">
        {videos?.map((video, idx) => {
          const colIndex = columns > 0 ? idx % columns : 0;
          const direction = colIndex === 0 ? 'right' : colIndex === columns - 1 ? 'left' : 'center';
          return (
            <div key={video.id} data-video-card>
              <VideoCard video={video} expandDirection={columns > 1 ? direction : undefined} />
            </div>
          );
        })}
        {!isLoading && videos?.length === 0 && (
          <p className="text-muted-foreground">まだアップロードがありません。</p>
        )}
      </div>
    </section>
  );
};

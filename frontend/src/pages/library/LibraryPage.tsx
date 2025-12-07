import { VideoCard } from '@/features/library/VideoCard';
import { useVideos } from '@/shared/hooks/useVideos';
import { PageHeader } from '@/shared/components/layout/PageHeader';

export const LibraryPage = () => {
  const { data: videos, isLoading } = useVideos();
  return (
    <section className="space-y-4">
      <PageHeader
        title="ライブラリ"
        description="アップロード済みの動画一覧を表示します。"
      />
      {isLoading && <p className="text-muted-foreground">読み込み中…</p>}
      <div className="grid gap-4 md:grid-cols-3">
        {videos?.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
        {!isLoading && videos?.length === 0 && (
          <p className="text-muted-foreground">まだアップロードがありません。</p>
        )}
      </div>
    </section>
  );
};

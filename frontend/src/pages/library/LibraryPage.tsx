import { VideoCard } from '@/features/library/VideoCard';
import { useVideos } from '@/shared/hooks/useVideos';
import { PageHeader } from '@/shared/components/layout/PageHeader';

export const LibraryPage = () => {
  const { data: videos, isLoading } = useVideos();
  return (
    <section className="space-y-4">
      <PageHeader
        title="Library"
        description="This page reads from the backend `/videos` endpoint so designers can validate the API contract."
      />
      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      <div className="grid gap-4 md:grid-cols-3">
        {videos?.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
        {!isLoading && videos?.length === 0 && (
          <p className="text-muted-foreground">No uploads yet.</p>
        )}
      </div>
    </section>
  );
};

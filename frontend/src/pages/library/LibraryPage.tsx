import { VideoCard } from '@/features/video-card/VideoCard';
import { useVideos } from '@/shared/hooks/useVideos';

export const LibraryPage = () => {
  const { data: videos, isLoading } = useVideos();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Library</h1>
      <p className="text-white/70">
        This page reads from the backend `/videos` endpoint so designers can validate the API contract.
      </p>
      {isLoading && <p className="text-white/60">Loading…</p>}
      <div className="grid gap-4 md:grid-cols-3">
        {videos?.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
        {!isLoading && videos?.length === 0 && <p className="text-white/60">No uploads yet.</p>}
      </div>
    </section>
  );
};

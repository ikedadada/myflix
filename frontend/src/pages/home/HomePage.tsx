import { useAuthUser } from '@/shared/hooks/useAuthUser';
import { useVideos } from '@/shared/hooks/useVideos';
import { VideoCard } from '@/features/video-card/VideoCard';

export const HomePage = () => {
  const { data: user } = useAuthUser();
  const { data: videos, isLoading, isError } = useVideos();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-white/50">Signed in as</p>
        <h1 className="text-3xl font-semibold">{user?.displayName ?? 'Loading…'}</h1>
      </div>
      {isError && <p className="text-red-400">Failed to load your library.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading && !videos && <p className="text-white/60">Loading videos…</p>}
        {videos?.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
        {!isLoading && videos?.length === 0 && <p className="text-white/60">No videos yet.</p>}
      </div>
    </section>
  );
};

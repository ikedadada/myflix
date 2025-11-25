import { useAuthUser } from '@/shared/hooks/useAuthUser';
import { useVideos } from '@/shared/hooks/useVideos';
import { VideoCard } from '@/features/video-card/VideoCard';
import { useAccessLogin } from '@/shared/hooks/useAccessLogin';
import { ApiError } from '@/app/config/apiClient';

export const HomePage = () => {
  const { data: user, isError: authIsError, error: authError } = useAuthUser();
  const { data: videos, isLoading, isError: videosIsError } = useVideos();
  const { login } = useAccessLogin();

  const authErrorStatuses = [0, 302, 401, 403];
  const showAuthCta =
    authIsError &&
    (!(authError instanceof ApiError) || authErrorStatuses.includes(authError.status));

  return (
    <section className="space-y-6">
      {showAuthCta ? (
        <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6 text-white">
          <h1 className="text-2xl font-semibold">Sign in to view your library</h1>
          <p className="text-white/70">
            Your session expired or you are not signed in. Continue to Cloudflare Access to log in.
          </p>
          <button
            onClick={login}
            className="rounded bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-white/90"
          >
            Sign in
          </button>
        </div>
      ) : (
        <>
          <div>
            <p className="text-white/50">Signed in as</p>
            <h1 className="text-3xl font-semibold">{user?.displayName ?? 'Loading…'}</h1>
          </div>
          {videosIsError && <p className="text-red-400">Failed to load your library.</p>}
          <div className="grid gap-4 md:grid-cols-2">
            {isLoading && !videos && <p className="text-white/60">Loading videos…</p>}
            {videos?.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
            {!isLoading && videos?.length === 0 && <p className="text-white/60">No videos yet.</p>}
          </div>
        </>
      )}
    </section>
  );
};

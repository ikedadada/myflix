import { VideoCarouselSection } from '@/components/features/library/VideoCarouselSection'
import { useVideos } from '@/components/features/videos/hooks/useVideos'

export const HomePage = () => {
  const { data: videos, isLoading, isError } = useVideos()

  const content = (() => {
    if (isLoading) return <p className='text-muted'>動画を読み込み中…</p>
    if (isError) return <p className='text-danger'>ライブラリの読み込みに失敗しました。</p>
    if (!videos || videos.length === 0) return <p className='text-muted'>まだ動画がありません。</p>
    return (
      <div className='space-y-6'>
        <VideoCarouselSection title='マイライブラリ' videos={videos} />
      </div>
    )
  })()

  return <section className='space-y-8'>{content}</section>
}

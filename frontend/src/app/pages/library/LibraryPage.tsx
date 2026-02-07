import { VideoGridGallery } from '@/components/features/library/VideoGridGallery'
import { useVideos } from '@/components/features/videos/hooks/useVideos'
import { PageHeader } from '@/components/layout/PageHeader'

export const LibraryPage = () => {
  const { data: videos, isLoading, isError } = useVideos()

  const content = (() => {
    if (isLoading) return <p className='text-muted-foreground'>読み込み中…</p>
    if (isError) return <p className='text-danger'>ライブラリの読み込みに失敗しました。</p>
    if (!videos || videos.length === 0) {
      return <p className='text-muted-foreground'>まだアップロードがありません。</p>
    }
    return <VideoGridGallery videos={videos} />
  })()

  return (
    <section className='space-y-4'>
      <PageHeader title='ライブラリ' description='アップロード済みの動画一覧を表示します。' />
      {content}
    </section>
  )
}

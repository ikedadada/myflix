import { useId } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui'

interface ThumbnailSectionProps {
  previewUrl: string | null
  fileName: string | null
  error: string | null
  generating: boolean
  uploading?: boolean
  objectKey?: string | null
  source?: 'auto' | 'manual' | null
  onResetToAuto?: () => void
  onSelect: (file: File | null) => void
}

export const ThumbnailSection = ({
  previewUrl,
  fileName,
  error,
  generating,
  uploading,
  objectKey,
  source,
  onResetToAuto,
  onSelect,
}: ThumbnailSectionProps) => {
  const inputId = useId()

  const statusText = (() => {
    if (error) return error
    if (uploading) return 'サムネイルをアップロード中…'
    if (generating) return '動画から自動生成中…'
    if (fileName) return `選択済み: ${fileName}`
    if (previewUrl) return '自動生成されたサムネイルをプレビューしています'
    return '動画を選択すると自動でサムネイルを生成します'
  })()

  return (
    <Card className='border-border/80'>
      <CardHeader className='pb-3'>
        <div className='flex flex-col gap-1'>
          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            ステップ 2
          </p>
          <CardTitle className='text-base'>サムネイルを確認</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-4 pt-0'>
        <div className='grid gap-4 lg:grid-cols-[2fr_1.2fr]'>
          <div className='space-y-3'>
            <div className='overflow-hidden rounded border border-border bg-card'>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt='Thumbnail preview'
                  className='w-full max-h-72 object-contain bg-card'
                />
              ) : (
                <div className='flex h-72 items-center justify-center bg-muted/40 text-sm text-muted-foreground'>
                  サムネイルは動画選択後に自動生成されます
                </div>
              )}
              <p className='px-2 py-1 text-center text-xs text-muted-foreground'>
                16:9 でトリミングされたプレビュー
              </p>
            </div>
            {objectKey && (
              <p className='text-xs text-success'>Uploaded thumbnail key: {objectKey}</p>
            )}
          </div>

          <div className='space-y-3 rounded-lg border border-border/80 bg-muted/10 p-3'>
            <div className='flex items-start justify-between gap-3'>
              <div className='space-y-1 text-sm'>
                <p className='font-semibold text-foreground'>現在のステータス</p>
                <p className={`text-xs ${error ? 'text-danger' : 'text-muted-foreground'}`}>
                  {statusText}
                </p>
                {source === 'manual' && !error && (
                  <p className='text-[11px] text-muted-foreground'>
                    手動で設定したサムネイルを使用中です
                  </p>
                )}
              </div>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  size='sm'
                  variant='ghost'
                  disabled={!previewUrl && !fileName}
                  onClick={() => {
                    onResetToAuto?.()
                  }}
                >
                  自動生成に戻す
                </Button>
              </div>
            </div>

            <div className='space-y-2 rounded-md border border-dashed border-border/80 bg-card px-3 py-2'>
              <label className='text-sm font-medium text-foreground' htmlFor={inputId}>
                画像をアップロード
              </label>
              <Input
                id={inputId}
                type='file'
                accept='image/*'
                className='border-dashed'
                onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
              />
              <p className='text-xs text-muted-foreground'>推奨: 1280x720 以上の16:9画像</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

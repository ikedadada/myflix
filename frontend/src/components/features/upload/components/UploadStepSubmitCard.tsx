import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

interface UploadStepSubmitCardProps {
  disabled: boolean
  isPending: boolean
  onSubmit: () => void
}

export const UploadStepSubmitCard = ({
  disabled,
  isPending,
  onSubmit,
}: UploadStepSubmitCardProps) => (
  <Card className='border-border/80'>
    <CardHeader className='pb-3'>
      <div className='flex flex-col gap-1'>
        <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          ステップ 4
        </p>
        <CardTitle className='text-xl'>アップロードして登録</CardTitle>
      </div>
    </CardHeader>
    <CardContent className='flex flex-wrap items-start gap-3 pt-0'>
      <Button disabled={disabled} onClick={onSubmit}>
        {isPending ? 'アップロード中…' : 'アップロードして登録'}
      </Button>
      <div className='space-y-1 text-sm text-muted-foreground'>
        <p>内容を確認してから実行してください。</p>
      </div>
    </CardContent>
  </Card>
)

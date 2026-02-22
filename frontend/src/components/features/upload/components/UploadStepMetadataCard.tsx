import { useEffect, useId, useState } from 'react'
import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useGenerateVideoCopy } from '@/components/features/upload/hooks/useGenerateVideoCopy'
import type { UploadFormValues } from '@/components/features/upload/schema/upload-form-schema'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  SelectableOptionButton,
  Textarea,
} from '@/components/ui'
import type { VideoTone } from '@/types/video'

interface UploadStepMetadataCardProps {
  file: File | null
  register: UseFormRegister<UploadFormValues>
  errors: FieldErrors<UploadFormValues>
  setValue: UseFormSetValue<UploadFormValues>
  userContextValue: string
}

const toneOptions: { value: VideoTone; label: string; note: string }[] = [
  { value: 'friendly', label: 'フレンドリー', note: 'カジュアルで親しみやすい' },
  { value: 'professional', label: 'プロフェッショナル', note: '簡潔でフォーマル' },
  { value: 'playful', label: '遊び心', note: '軽快で楽しい' },
  { value: 'concise', label: '簡潔', note: '短く要点のみ' },
]

export const UploadStepMetadataCard = ({
  file,
  register,
  errors,
  setValue,
  userContextValue,
}: UploadStepMetadataCardProps) => {
  const titleId = useId()
  const descriptionId = useId()
  const contextId = useId()
  const [tone, setTone] = useState<VideoTone>('friendly')
  const {
    generate,
    isGenerating,
    errorMessage: generationError,
    lastResult: generatedCopy,
  } = useGenerateVideoCopy()

  useEffect(() => {
    if (!file) return
    setValue('title', file.name.replace(/\.[^.]+$/, ''), {
      shouldValidate: false,
      shouldDirty: true,
    })
  }, [file, setValue])

  const handleGenerate = async () => {
    if (!file) return
    const result = await generate({
      file,
      tone,
      language: 'ja',
      userContext: userContextValue.trim() || undefined,
    })
    if (!result) return

    setValue('title', result.title, { shouldValidate: true })
    setValue('description', result.description, { shouldValidate: true })
  }

  const generatedToneLabel =
    toneOptions.find((option) => option.value === generatedCopy?.tone)?.label ?? generatedCopy?.tone

  return (
    <Card className='border-border/80'>
      <CardHeader className='pb-3'>
        <div className='flex flex-col gap-1'>
          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            ステップ 3
          </p>
          <CardTitle className='text-xl'>タイトル・説明を整える</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-4 pt-0'>
        <div className='grid gap-4 lg:grid-cols-[1.5fr_1fr]'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground' htmlFor={titleId}>
                タイトル
              </label>
              <Input id={titleId} {...register('title')} placeholder='動画のタイトル' />
              {errors.title && <p className='text-xs text-danger'>{errors.title.message}</p>}
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground' htmlFor={descriptionId}>
                説明
              </label>
              <Textarea
                id={descriptionId}
                {...register('description')}
                placeholder='動画の概要や補足'
                rows={8}
              />
              {errors.description && (
                <p className='text-xs text-danger'>{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className='space-y-3 rounded border border-border bg-card p-3'>
            <div className='flex flex-wrap items-center justify-between gap-2 text-sm font-semibold'>
              <span>タイトル/説明をAIで自動生成</span>
              {generatedCopy?.model && (
                <span className='text-xs font-normal text-muted-foreground'>
                  モデル: {generatedCopy.model}
                </span>
              )}
            </div>

            <div className='space-y-3'>
              <div className='grid gap-2 sm:grid-cols-2'>
                {toneOptions.map((option) => {
                  const isActive = tone === option.value
                  return (
                    <SelectableOptionButton
                      key={option.value}
                      title={option.label}
                      description={option.note}
                      selected={isActive}
                      onClick={() => setTone(option.value)}
                    />
                  )
                })}
              </div>
              <div className='space-y-2 text-sm'>
                <label className='text-sm font-medium text-foreground' htmlFor={contextId}>
                  用途/ターゲット（任意）
                </label>
                <Input
                  id={contextId}
                  {...register('userContext')}
                  placeholder='例: YouTubeショート向け / 学習者向け'
                />
                {errors.userContext && (
                  <p className='text-xs text-danger'>{errors.userContext.message}</p>
                )}
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <Button
                type='button'
                onClick={handleGenerate}
                disabled={!file || isGenerating}
                variant='outline'
              >
                {isGenerating ? '生成中…' : 'タイトルと説明を自動生成'}
              </Button>
              {!file && (
                <p className='text-xs text-muted-foreground'>先に動画ファイルを選択してください</p>
              )}
            </div>

            {generationError && <p className='text-sm text-danger'>{generationError}</p>}
            {generatedCopy && (
              <p className='text-xs text-muted-foreground'>
                生成済み: {generatedToneLabel} /{' '}
                {generatedCopy.durationMs ? `${generatedCopy.durationMs}ms` : '—'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

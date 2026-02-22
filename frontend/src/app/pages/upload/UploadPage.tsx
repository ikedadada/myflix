import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { RecentUploadsAccordion } from '@/components/features/upload/components/RecentUploadsAccordion'
import { UploadStepFileCard } from '@/components/features/upload/components/UploadStepFileCard'
import { UploadStepMetadataCard } from '@/components/features/upload/components/UploadStepMetadataCard'
import { UploadStepSubmitCard } from '@/components/features/upload/components/UploadStepSubmitCard'
import { UploadStepThumbnailCard } from '@/components/features/upload/components/UploadStepThumbnailCard'
import { useThumbnailSubmission } from '@/components/features/upload/hooks/useThumbnailSubmission'
import { useUploadSubmission } from '@/components/features/upload/hooks/useUploadSubmission'
import {
  type UploadFormValues,
  uploadFormDefaultValues,
  uploadFormSchema,
} from '@/components/features/upload/schema/upload-form-schema'
import { PageHeader } from '@/components/layout/PageHeader'

export const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: uploadFormDefaultValues,
  })

  const title = watch('title') ?? ''
  const description = watch('description') ?? ''
  const userContext = watch('userContext') ?? ''

  const {
    objectKey: thumbnailObjectKey,
    reset: resetThumbnailSubmission,
    setThumbnailBlob,
    uploadThumbnailIfNeeded,
    uploading: thumbnailUploading,
  } = useThumbnailSubmission()

  const handleSucceededReset = useCallback(() => {
    setFile(null)
    setDurationSeconds(null)
    resetThumbnailSubmission()
    reset(uploadFormDefaultValues)
  }, [reset, resetThumbnailSubmission])

  const submission = useUploadSubmission({
    file,
    title,
    description,
    durationSeconds,
    uploadThumbnailIfNeeded,
    onSucceededReset: handleSucceededReset,
  })

  const handleSubmitUpload = handleSubmit(submission.submit)

  return (
    <section className='space-y-6'>
      <PageHeader
        title='アップロード'
        description='流れ: 1) 動画選択 → 2) サムネ確認 → 3) タイトル/説明 → 4) アップロード/登録'
      />
      <div className='grid gap-5 lg:grid-cols-[2fr_1fr]'>
        <div className='space-y-5'>
          <UploadStepFileCard
            file={file}
            setFile={setFile}
            durationSeconds={durationSeconds}
            setDurationSeconds={setDurationSeconds}
          />

          <UploadStepThumbnailCard
            file={file}
            uploading={thumbnailUploading}
            objectKey={thumbnailObjectKey}
            onThumbnailBlobChange={setThumbnailBlob}
          />

          <UploadStepMetadataCard
            file={file}
            register={register}
            errors={errors}
            setValue={setValue}
            userContextValue={userContext}
          />

          <UploadStepSubmitCard
            disabled={submission.disabled}
            isPending={submission.isPending}
            onSubmit={handleSubmitUpload}
          />
        </div>

        <div className='space-y-5 lg:sticky lg:top-4'>
          <RecentUploadsAccordion />
        </div>
      </div>
    </section>
  )
}

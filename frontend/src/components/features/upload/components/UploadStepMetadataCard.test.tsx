import { render } from '@testing-library/react'
import type { UseFormRegister } from 'react-hook-form'
import { describe, it, vi } from 'vitest'
import type { UploadFormValues } from '../schema/upload-form-schema'
import { UploadStepMetadataCard } from './UploadStepMetadataCard'

vi.mock('@/components/features/upload/hooks/useGenerateVideoCopy', () => ({
  useGenerateVideoCopy: () => ({
    generate: vi.fn(),
    isGenerating: false,
    errorMessage: null,
    lastResult: null,
  }),
}))

describe('UploadStepMetadataCard', () => {
  it('renders without crashing', () => {
    const register = vi.fn(
      () =>
        ({
          name: 'title',
          onChange: vi.fn(),
          onBlur: vi.fn(),
          ref: vi.fn(),
        }) as ReturnType<UseFormRegister<UploadFormValues>>,
    ) as unknown as UseFormRegister<UploadFormValues>
    render(
      <UploadStepMetadataCard
        file={null}
        register={register}
        errors={{}}
        setValue={vi.fn()}
        userContextValue=''
      />,
    )
  })
})

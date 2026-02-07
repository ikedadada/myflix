import { render } from '@testing-library/react'
import type { UseFormRegister } from 'react-hook-form'
import { describe, it, vi } from 'vitest'
import type { UploadFormValues } from '../useUploadForm'
import { AiCopySection } from './AiCopySection'

vi.mock('@/components/features/upload/hooks/useGenerateVideoCopy', () => ({
  useGenerateVideoCopy: () => ({
    generate: vi.fn(),
    isGenerating: false,
    errorMessage: null,
    lastResult: null,
  }),
}))

describe('AiCopySection', () => {
  it('renders without crashing', () => {
    const register = vi.fn(() => ({
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
      name: 'userContext',
    })) as unknown as UseFormRegister<UploadFormValues>
    render(
      <AiCopySection
        file={null}
        onApply={vi.fn()}
        register={register}
        errors={{}}
        userContextValue=''
      />,
    )
  })
})

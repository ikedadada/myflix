import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
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
    const register = vi.fn(() => ({}))
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

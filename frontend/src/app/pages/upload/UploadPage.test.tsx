import { render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, it, vi } from 'vitest'
import { UploadPage } from './UploadPage'

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: vi.fn() }),
    useMutation: () => ({ mutate: vi.fn(), isPending: false }),
  }
})

vi.mock('@/components/shadcn/hooks/useToast', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}))

vi.mock('@/components/features/upload/components/UploadStepFileCard', () => ({
  UploadStepFileCard: () => <div>UploadStepFileCard</div>,
}))

vi.mock('@/components/features/upload/components/UploadStepThumbnailCard', () => ({
  UploadStepThumbnailCard: () => <div>UploadStepThumbnailCard</div>,
}))

vi.mock('@/components/features/upload/components/RecentUploadsAccordion', () => ({
  RecentUploadsAccordion: () => <div>RecentUploadsAccordion</div>,
}))

vi.mock('@/components/features/upload/components/UploadStepMetadataCard', () => ({
  UploadStepMetadataCard: () => <div>UploadStepMetadataCard</div>,
}))

vi.mock('@/components/features/upload/components/UploadStepSubmitCard', () => ({
  UploadStepSubmitCard: () => <div>UploadStepSubmitCard</div>,
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
}))

describe('UploadPage', () => {
  it('renders without crashing', () => {
    render(<UploadPage />)
  })
})

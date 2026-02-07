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

vi.mock('@/components/features/upload/hooks/useUploadSessions', () => ({
  useUploadSessions: () => ({ create: vi.fn(), creating: false, data: [], isLoading: false }),
}))

vi.mock('@/components/features/upload/useUploadForm', () => ({
  useUploadForm: () => ({
    register: () => ({}),
    handleSubmit: (fn: () => void) => fn,
    setValue: vi.fn(),
    reset: vi.fn(),
    watch: () => '',
    formState: { errors: {} },
  }),
}))

vi.mock('@/components/shadcn/hooks/useToast', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}))

vi.mock('@/components/features/upload/components/AiCopySection', () => ({
  AiCopySection: () => <div>AiCopySection</div>,
}))

vi.mock('@/components/features/upload/components/FilePicker', () => ({
  FilePicker: () => <div>FilePicker</div>,
}))

vi.mock('@/components/features/upload/components/RecentUploadsAccordion', () => ({
  RecentUploadsAccordion: () => <div>RecentUploadsAccordion</div>,
}))

vi.mock('@/components/features/upload/components/TextInputs', () => ({
  TextInputs: () => <div>TextInputs</div>,
}))

vi.mock('@/components/features/upload/components/ThumbnailSection', () => ({
  ThumbnailSection: () => <div>ThumbnailSection</div>,
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
}))

describe('UploadPage', () => {
  it('renders without crashing', () => {
    render(<UploadPage />)
  })
})

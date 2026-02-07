import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import { RecentUploadsAccordion } from './RecentUploadsAccordion'

vi.mock('@/components/features/upload/hooks/useUploadSessions', () => ({
  useUploadSessions: () => ({ data: [], isLoading: false }),
}))

describe('RecentUploadsAccordion', () => {
  it('renders without crashing', () => {
    render(<RecentUploadsAccordion />)
  })
})

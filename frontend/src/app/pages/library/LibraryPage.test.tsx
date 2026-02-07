import { render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { beforeAll, describe, it, vi } from 'vitest'
import { LibraryPage } from './LibraryPage'

vi.mock('@/components/features/videos/hooks/useVideos', () => ({
  useVideos: () => ({ data: [], isLoading: false }),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
}))

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  )
})

describe('LibraryPage', () => {
  it('renders without crashing', () => {
    render(<LibraryPage />)
  })
})

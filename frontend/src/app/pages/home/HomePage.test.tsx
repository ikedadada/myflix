import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, it, vi } from 'vitest'
import { HomePage } from './HomePage'

vi.mock('@tanstack/react-router', async () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
}))

vi.mock('@/components/features/videos/hooks/useVideos', () => ({
  useVideos: () => ({
    data: [
      {
        id: '1',
        title: 'Sample',
        description: 'Desc',
        durationSeconds: 120,
        objectKey: 'obj-1',
        thumbnailUrl: null,
      },
    ],
    isLoading: false,
    isError: false,
  }),
}))

describe('HomePage', () => {
  it('renders without crashing', () => {
    const client = new QueryClient()
    render(
      <QueryClientProvider client={client}>
        <HomePage />
      </QueryClientProvider>,
    )
  })
})

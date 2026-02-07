import { render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, it, vi } from 'vitest'
import { VideoDetailPage } from './VideoDetailPage'

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

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
  useParams: () => ({ videoId: '1' }),
}))

describe('VideoDetailPage', () => {
  it('renders without crashing', () => {
    render(<VideoDetailPage />)
  })
})

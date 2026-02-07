import { render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, it, vi } from 'vitest'
import { VideoCard } from './VideoCard'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
}))

describe('VideoCard', () => {
  it('renders without crashing', () => {
    render(
      <VideoCard
        video={{
          id: '1',
          title: 'Sample',
          description: 'Desc',
          durationSeconds: 120,
          objectKey: 'obj-1',
          thumbnailUrl: null,
        }}
      />,
    )
  })
})

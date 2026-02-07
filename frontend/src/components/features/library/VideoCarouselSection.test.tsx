import { render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, it, vi } from 'vitest'
import { VideoCarouselSection } from './VideoCarouselSection'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
}))

describe('VideoCarouselSection', () => {
  it('renders without crashing', () => {
    render(
      <VideoCarouselSection
        title='Carousel'
        videos={[
          {
            id: '1',
            title: 'Sample',
            description: 'Desc',
            durationSeconds: 120,
            objectKey: 'obj-1',
            thumbnailUrl: null,
          },
        ]}
      />,
    )
  })
})

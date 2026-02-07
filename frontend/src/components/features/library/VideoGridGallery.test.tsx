import { render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { beforeAll, describe, it, vi } from 'vitest'
import { VideoGridGallery } from './VideoGridGallery'

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

describe('VideoGridGallery', () => {
  it('renders without crashing', () => {
    render(
      <VideoGridGallery
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

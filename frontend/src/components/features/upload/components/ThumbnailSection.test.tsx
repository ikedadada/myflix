import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import { ThumbnailSection } from './ThumbnailSection'

describe('ThumbnailSection', () => {
  it('renders without crashing', () => {
    render(
      <ThumbnailSection
        previewUrl={null}
        fileName={null}
        error={null}
        generating={false}
        uploading={false}
        objectKey={null}
        source={null}
        onResetToAuto={vi.fn()}
        onSelect={vi.fn()}
      />,
    )
  })
})

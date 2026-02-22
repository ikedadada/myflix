import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import { UploadStepThumbnailCard } from './UploadStepThumbnailCard'

describe('UploadStepThumbnailCard', () => {
  it('renders without crashing', () => {
    render(
      <UploadStepThumbnailCard
        file={null}
        uploading={false}
        objectKey={null}
        onThumbnailBlobChange={vi.fn()}
      />,
    )
  })
})

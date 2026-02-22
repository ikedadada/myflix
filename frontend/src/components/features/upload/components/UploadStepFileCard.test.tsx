import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import { UploadStepFileCard } from './UploadStepFileCard'

describe('UploadStepFileCard', () => {
  it('renders without crashing', () => {
    render(
      <UploadStepFileCard
        file={null}
        durationSeconds={null}
        setFile={vi.fn()}
        setDurationSeconds={vi.fn()}
      />,
    )
  })
})

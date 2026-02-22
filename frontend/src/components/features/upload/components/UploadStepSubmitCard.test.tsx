import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import { UploadStepSubmitCard } from './UploadStepSubmitCard'

describe('UploadStepSubmitCard', () => {
  it('renders without crashing', () => {
    render(<UploadStepSubmitCard disabled={false} isPending={false} onSubmit={vi.fn()} />)
  })
})

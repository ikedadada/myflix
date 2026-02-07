import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import { FilePicker } from './FilePicker'

describe('FilePicker', () => {
  it('renders without crashing', () => {
    render(<FilePicker file={null} onChange={vi.fn()} />)
  })
})

import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import { TextInputs } from './TextInputs'

describe('TextInputs', () => {
  it('renders without crashing', () => {
    const register = vi.fn(() => ({}))
    const setValue = vi.fn()
    render(<TextInputs register={register} errors={{}} setValue={setValue} />)
  })
})

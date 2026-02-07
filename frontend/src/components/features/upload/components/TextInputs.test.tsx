import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import type { UseFormRegister } from 'react-hook-form'
import type { UploadFormValues } from '../useUploadForm'
import { TextInputs } from './TextInputs'

describe('TextInputs', () => {
  it('renders without crashing', () => {
    const register = vi.fn(() => ({
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
      name: 'title',
    })) as unknown as UseFormRegister<UploadFormValues>
    const setValue = vi.fn()
    render(<TextInputs register={register} errors={{}} setValue={setValue} />)
  })
})

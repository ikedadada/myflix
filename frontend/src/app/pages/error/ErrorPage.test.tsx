import { render } from '@testing-library/react'
import { describe, it } from 'vitest'
import { ErrorPage } from './ErrorPage'

describe('ErrorPage', () => {
  it('renders without crashing', () => {
    render(<ErrorPage />)
  })
})

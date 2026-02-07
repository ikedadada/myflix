import { render } from '@testing-library/react'
import { describe, it } from 'vitest'
import { NotFoundPage } from './NotFoundPage'

describe('NotFoundPage', () => {
  it('renders without crashing', () => {
    render(<NotFoundPage />)
  })
})

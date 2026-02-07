import { render } from '@testing-library/react'
import { describe, it } from 'vitest'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders without crashing', () => {
    render(<PageHeader title='タイトル' description='説明' />)
  })
})

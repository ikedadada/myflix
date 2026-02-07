import { render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, it, vi } from 'vitest'
import { AppLayout } from './AppLayout'

vi.mock('@/components/features/auth/hooks/useAuthUser', () => ({
  useAuthUser: () => ({ data: { displayName: 'Test User' } }),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
  Outlet: () => <div data-testid='outlet' />,
}))

describe('AppLayout', () => {
  it('renders without crashing', () => {
    render(<AppLayout />)
  })
})

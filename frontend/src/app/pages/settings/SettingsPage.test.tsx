import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import { SettingsPage } from './SettingsPage'

vi.mock('@/components/features/settings/hooks/useSettings', () => ({
  useSettings: () => ({
    data: { autoplay: true },
    isLoading: false,
    update: vi.fn(),
    isUpdating: false,
  }),
}))

vi.mock('@/app/providers/ThemeProvider', () => ({
  useTheme: () => ({ mode: 'auto', setMode: vi.fn() }),
}))

vi.mock('@/components/shadcn/hooks/useToast', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}))

describe('SettingsPage', () => {
  it('renders without crashing', () => {
    render(<SettingsPage />)
  })
})

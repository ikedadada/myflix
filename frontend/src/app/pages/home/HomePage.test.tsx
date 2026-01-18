import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { HomePage } from './HomePage';

vi.mock('@/components/features/auth/hooks/useAuthUser', () => ({
  useAuthUser: () => ({ data: { displayName: 'Test User' } })
}));

vi.mock('@/components/features/videos/hooks/useVideos', () => ({
  useVideos: () => ({ data: [{ id: '1', title: 'Sample', description: 'Desc', durationSeconds: 120 }], isLoading: false, isError: false })
}));

describe('HomePage', () => {
  it('renders hero content', () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <HomePage />
      </QueryClientProvider>
    );
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});

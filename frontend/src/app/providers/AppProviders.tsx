import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/shared/ui';
import { ThemeProvider } from './ThemeProvider';

interface Props {
  children: ReactNode;
}

export const AppProviders = ({ children }: Props) => {
  const [client] = useState(() => new QueryClient());
  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        {children}
        <Toaster position="bottom-right" richColors />
        <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

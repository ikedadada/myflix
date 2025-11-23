import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
        <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

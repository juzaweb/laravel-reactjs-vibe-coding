'use client';

import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, Suspense } from 'react';
import { store } from '../store';
import { I18nProvider } from '../src/i18n/I18nProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading translations...</div>}>
          <I18nProvider>
            {children}
          </I18nProvider>
        </Suspense>
      </QueryClientProvider>
    </Provider>
  );
}

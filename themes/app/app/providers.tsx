'use client';

import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, Suspense, useEffect } from 'react';
import { store } from '../store';
import { fetchSettings } from '../store/settingSlice';
import { I18nProvider } from '../src/i18n/I18nProvider';
import { useAppDispatch, useAppSelector } from '../store/hooks';

function GlobalSettingsLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.settings.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSettings());
    }
  }, [dispatch, status]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading translations...</div>}>
          <I18nProvider>
            <GlobalSettingsLoader>
              {children}
            </GlobalSettingsLoader>
          </I18nProvider>
        </Suspense>
      </QueryClientProvider>
    </Provider>
  );
}

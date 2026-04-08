import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MenusManager } from './pages/menus/MenusManager';
import './i18n'; // Need translations initialized
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
        <MenusManager />
      </div>
    </QueryClientProvider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

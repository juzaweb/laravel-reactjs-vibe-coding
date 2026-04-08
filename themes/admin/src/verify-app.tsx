import { createRoot } from 'react-dom/client';
import { Editor } from './components/ui/form/Editor';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <BrowserRouter>
                <div className="p-10">
                    <Editor />
                </div>
            </BrowserRouter>
        </Provider>
    </QueryClientProvider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

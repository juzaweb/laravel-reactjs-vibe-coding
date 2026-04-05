import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAppSelector } from './store/hooks'
import { AdminLayout } from './components/layout/AdminLayout'
import { Dashboard } from './pages/Dashboard'

function App() {
  const { theme } = useAppSelector((state) => state.ui)

  useEffect(() => {
    // Apply the theme class to the html element for Tailwind's dark: variant
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
        {/* Fallback for other routes to still render the layout for now */}
        <Route path="*" element={<AdminLayout><div className="p-8 text-center text-[var(--text-muted)]">Page not found or under construction.</div></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

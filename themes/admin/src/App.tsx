import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAppSelector } from './store/hooks'
import { AdminLayout } from './components/layout/AdminLayout'
import { AuthLayout } from './components/layout/AuthLayout'
import { Dashboard } from './pages/Dashboard'
import { MediaLibrary } from './pages/media/MediaLibrary'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { ResetPassword } from './pages/auth/ResetPassword'
import { VerifyEmail } from './pages/auth/VerifyEmail'

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
        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
        <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
        <Route path="/verify-email" element={<AuthLayout><VerifyEmail /></AuthLayout>} />

        {/* Protected Routes (Admin) */}
        <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/media" element={<AdminLayout><MediaLibrary /></AdminLayout>} />

        {/* Fallback for other routes */}
        <Route path="*" element={<AdminLayout><div className="p-8 text-center text-[var(--text-muted)]">Page not found or under construction.</div></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

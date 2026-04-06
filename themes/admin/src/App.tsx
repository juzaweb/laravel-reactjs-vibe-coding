import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import { ProtectedRoute } from './components/layout/ProtectedRoute'

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
        <Route path="/verify-email/:id/:hash" element={<AuthLayout><VerifyEmail /></AuthLayout>} />

        {/* Protected Routes (Admin) */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/media" element={<ProtectedRoute><AdminLayout><MediaLibrary /></AdminLayout></ProtectedRoute>} />

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Fallback for other routes */}
        <Route path="*" element={<ProtectedRoute><AdminLayout><div className="p-8 text-center text-[var(--text-muted)]">Page not found or under construction.</div></AdminLayout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './store/hooks'
import { AdminLayout } from './components/layout/AdminLayout'
import { AuthLayout } from './components/layout/AuthLayout'
import { Dashboard } from './pages/Dashboard'
import { MediaLibrary } from './pages/media/MediaLibrary'
import { PagesList } from './pages/pages/PagesList'
import { PageForm } from './pages/pages/PageForm'
import { ProfileForm } from './pages/profile/ProfileForm'
import { UsersList } from './pages/users/UsersList'
import { UserForm } from './pages/users/UserForm'
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
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verify-email">
            <Route index element={<VerifyEmail />} />
            <Route path=":id/:hash" element={<VerifyEmail />} />
          </Route>
        </Route>

        {/* Protected Routes (Admin) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="profile" element={<ProfileForm />} />
            <Route path="pages">
              <Route index element={<PagesList />} />
              <Route path="create" element={<PageForm />} />
              <Route path=":id/edit" element={<PageForm />} />
            </Route>
            <Route path="users">
              <Route index element={<UsersList />} />
              <Route path="create" element={<UserForm />} />
              <Route path=":id/edit" element={<UserForm />} />
            </Route>
          </Route>
        </Route>

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Fallback for other routes */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

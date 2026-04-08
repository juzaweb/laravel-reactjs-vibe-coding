import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './store/hooks'
import { AdminLayout } from './components/layout/AdminLayout'
import { AuthLayout } from './components/layout/AuthLayout'
import { Dashboard } from './pages/Dashboard'
import { MediaLibrary } from './pages/media/MediaLibrary'
import { PagesList } from './pages/pages/PagesList'
import { PageForm } from './pages/pages/PageForm'
import { PostsList } from './pages/posts/PostsList'
import { PostForm } from './pages/posts/PostForm'
import { CategoriesList } from './pages/categories/CategoriesList'
import { CategoryForm } from './pages/categories/CategoryForm'
import { MenusManager } from './pages/menus/MenusManager'
import { ProfileForm } from './pages/profile/ProfileForm'
import { PlansList } from './pages/plans/PlansList'
import { PlanForm } from './pages/plans/PlanForm'
import { SubscriptionsList } from './pages/subscriptions/SubscriptionsList'
import { SubscriptionHistoriesList } from './pages/subscription-histories/SubscriptionHistoriesList'
import { PaymentMethodsList } from './pages/payment-methods/PaymentMethodsList'
import { PaymentMethodForm } from './pages/payment-methods/PaymentMethodForm'
import { PaymentHistoriesList } from './pages/payment-histories/PaymentHistoriesList'
import { UsersList } from './pages/users/UsersList'
import { UserForm } from './pages/users/UserForm'
import { NotificationsList } from './pages/notifications/NotificationsList'
import { NotificationShow } from './pages/notifications/NotificationShow'
import { SettingPage } from './pages/settings/SettingPage'
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
            <Route path="posts">
              <Route index element={<PostsList />} />
              <Route path="create" element={<PostForm />} />
              <Route path=":id/edit" element={<PostForm />} />
            </Route>
            <Route path="categories">
              <Route index element={<CategoriesList />} />
              <Route path="create" element={<CategoryForm />} />
              <Route path=":id/edit" element={<CategoryForm />} />
            </Route>
            <Route path="menus" element={<MenusManager />} />
            <Route path="payment" element={<Navigate to="/admin/payment-methods" replace />} />
            <Route path="payment-methods">
              <Route index element={<PaymentMethodsList />} />
              <Route path="create" element={<PaymentMethodForm />} />
              <Route path=":id/edit" element={<PaymentMethodForm />} />
            </Route>
            <Route path="payment-histories" element={<PaymentHistoriesList />} />
            <Route path="users">
              <Route index element={<UsersList />} />
              <Route path="create" element={<UserForm />} />
              <Route path=":id/edit" element={<UserForm />} />
            </Route>
            <Route path="subscription/plans">
              <Route index element={<PlansList />} />
              <Route path="create" element={<PlanForm />} />
              <Route path=":id/edit" element={<PlanForm />} />
            </Route>
            <Route path="subscription/subscriptions" element={<SubscriptionsList />} />
            <Route path="subscription/histories" element={<SubscriptionHistoriesList />} />
            <Route path="notifications">
              <Route index element={<NotificationsList />} />
              <Route path=":id" element={<NotificationShow />} />
            </Route>
            <Route path="settings" element={<SettingPage />} />
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

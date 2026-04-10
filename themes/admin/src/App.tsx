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
import { BannerAdsList } from './pages/banner-ads/BannerAdsList'
import { BannerAdForm } from './pages/banner-ads/BannerAdForm'
import { CategoryForm } from './pages/categories/CategoryForm'
import { MenusManager } from './pages/menus/MenusManager'
import { ProfileForm } from './pages/profile/ProfileForm'
import { PlansList } from './pages/plans/PlansList'
import { PlanForm } from './pages/plans/PlanForm'
import { SubscriptionMethodsList } from './pages/subscription-methods/SubscriptionMethodsList'
import { SubscriptionMethodForm } from './pages/subscription-methods/SubscriptionMethodForm'
import { SubscriptionsList } from './pages/subscriptions/SubscriptionsList'
import { SubscriptionHistoriesList } from './pages/subscription-histories/SubscriptionHistoriesList'
import { PaymentMethodsList } from './pages/payment-methods/PaymentMethodsList'
import { PaymentMethodForm } from './pages/payment-methods/PaymentMethodForm'
import { PaymentHistoriesList } from './pages/payment-histories/PaymentHistoriesList'
import { OrdersList } from './pages/orders/OrdersList'
import { OrderShow } from './pages/orders/OrderShow'
import { UsersList } from './pages/users/UsersList'
import { UserForm } from './pages/users/UserForm'
import { NotificationsList } from './pages/notifications/NotificationsList'
import { NotificationShow } from './pages/notifications/NotificationShow'
import { SettingPage } from './pages/settings/SettingPage'
import { LanguagesList } from './pages/languages/LanguagesList'
import { LanguageForm } from './pages/languages/LanguageForm'
import { VideoAdsList } from './pages/video-ads/VideoAdsList'
import { VideoAdsForm } from './pages/video-ads/VideoAdsForm'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { ResetPassword } from './pages/auth/ResetPassword'
import { VerifyEmail } from './pages/auth/VerifyEmail'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { InstallerLayout } from './pages/installer/InstallerLayout'
import { Welcome } from './pages/installer/Welcome'
import { Requirements } from './pages/installer/Requirements'
import { Permissions } from './pages/installer/Permissions'
import { Environment } from './pages/installer/Environment'
import { Database } from './pages/installer/Database'
import { Admin as InstallerAdmin } from './pages/installer/Admin'
import { Final } from './pages/installer/Final'

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
        {/* Installer Routes */}
        <Route path="/install" element={<InstallerLayout />}>
          <Route index element={<Welcome />} />
          <Route path="requirements" element={<Requirements />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="environment" element={<Environment />} />
          <Route path="database" element={<Database />} />
          <Route path="admin" element={<InstallerAdmin />} />
          <Route path="final" element={<Final />} />
        </Route>

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
            <Route path="banner-ads">
              <Route index element={<BannerAdsList />} />
              <Route path="create" element={<BannerAdForm />} />
              <Route path=":id/edit" element={<BannerAdForm />} />
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
            <Route path="orders">
              <Route index element={<OrdersList />} />
              <Route path=":id" element={<OrderShow />} />
            </Route>
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
            <Route path="subscription-methods">
              <Route index element={<SubscriptionMethodsList />} />
              <Route path="create" element={<SubscriptionMethodForm />} />
              <Route path=":id/edit" element={<SubscriptionMethodForm />} />
            </Route>
            <Route path="subscription/subscriptions" element={<SubscriptionsList />} />
            <Route path="subscription/histories" element={<SubscriptionHistoriesList />} />
            <Route path="notifications">
              <Route index element={<NotificationsList />} />
              <Route path=":id" element={<NotificationShow />} />
            </Route>
            <Route path="languages">
              <Route index element={<LanguagesList />} />
              <Route path="create" element={<LanguageForm />} />
              <Route path=":id/edit" element={<LanguageForm />} />
            </Route>
            <Route path="settings" element={<SettingPage />} />
            <Route path="video-ads">
              <Route index element={<VideoAdsList />} />
              <Route path="create" element={<VideoAdsForm />} />
              <Route path=":id/edit" element={<VideoAdsForm />} />
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

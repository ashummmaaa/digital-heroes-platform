import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'

// Layouts
import { MainLayout } from './layouts/MainLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { AdminLayout } from './layouts/AdminLayout'

// Public Pages
import { Home } from './pages/public/Home'
import { HowItWorksPage } from './pages/public/HowItWorksPage'
import { CharitiesPage } from './pages/public/CharitiesPage'
import { CharityDetailPage } from './pages/public/CharityDetailPage'
import { PricingPage } from './pages/public/PricingPage'
import { LoginPage } from './pages/public/LoginPage'
import { SignupPage } from './pages/public/SignupPage'

// Subscriber Pages
import { DashboardOverview } from './pages/subscriber/DashboardOverview'
import { ScoresPage } from './pages/subscriber/ScoresPage'
import { CharitySelectionPage } from './pages/subscriber/CharitySelectionPage'
import { DrawsPage } from './pages/subscriber/DrawsPage'
import { WinningsPage } from './pages/subscriber/WinningsPage'
import { SubscriptionPage } from './pages/subscriber/SubscriptionPage'

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptionsPage'
import { AdminCharitiesPage } from './pages/admin/AdminCharitiesPage'
import { AdminDrawsPage } from './pages/admin/AdminDrawsPage'
import { AdminWinnersPage } from './pages/admin/AdminWinnersPage'
import { AdminReportsPage } from './pages/admin/AdminReportsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
              <Route path="charities" element={<CharitiesPage />} />
              <Route path="charities/:id" element={<CharityDetailPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </Route>

            {/* Subscriber Dashboard Layout */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="scores" element={<ScoresPage />} />
              <Route path="charity" element={<CharitySelectionPage />} />
              <Route path="draws" element={<DrawsPage />} />
              <Route path="winnings" element={<WinningsPage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
            </Route>

            {/* Admin Dashboard Layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
              <Route path="charities" element={<AdminCharitiesPage />} />
              <Route path="draws" element={<AdminDrawsPage />} />
              <Route path="winners" element={<AdminWinnersPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

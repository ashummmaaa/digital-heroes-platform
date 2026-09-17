import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LoadingScreen } from '../common/LoadingScreen'

/**
 * Allows public access. Shows loading spinner while auth state is resolving.
 */
export const PublicRoute = () => {
  const { loading } = useAuth()
  if (loading) return <LoadingScreen message="Loading page..." />
  return <Outlet />
}

/**
 * Requires any authenticated user.
 * Redirects unauthenticated visitors to /login.
 */
export const AuthenticatedRoute = () => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen message="Verifying authentication..." />
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

/**
 * Requires authenticated user with an active subscription.
 * - Redirects unauthenticated visitors to /login.
 * - Redirects authenticated users without active subscription to /subscription-plans.
 */
export const ActiveSubscriberRoute = () => {
  const { user, profile, subscription, loading, isAdmin, isSubscriber, hasActiveSubscription } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen message="Verifying subscription access..." />
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Admin users can inspect subscriber views or admin views
  if (isAdmin) {
    return <Outlet />
  }

  // User must have role === 'subscriber'
  if (!isSubscriber && profile?.role !== 'subscriber') {
    return <Navigate to="/unauthorized" replace />
  }

  // Check active subscription status
  if (!hasActiveSubscription && subscription?.status !== 'active' && !profile?.is_active) {
    return <Navigate to="/subscription-plans" replace />
  }

  return <Outlet />
}

/**
 * Requires authenticated user with admin role.
 * - Redirects unauthenticated visitors to /login.
 * - Redirects non-admin authenticated users to /unauthorized.
 */
export const AdminRoute = () => {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen message="Verifying administrative privileges..." />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

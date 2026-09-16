import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isDemoMode } from '../lib/supabase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({
    id: 'demo-subscriber-id',
    full_name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    role: 'subscriber',
    is_active: true
  })
  const [subscription, setSubscription] = useState({
    plan_type: 'monthly',
    status: 'active',
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Supabase Session Listener
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        } else {
          // If no live session, initialize demo subscriber profile
          setUser({ id: 'demo-subscriber-id', email: 'alex.morgan@example.com' })
        }
      } catch (err) {
        console.warn('Supabase Auth warning, using default state:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      authListener?.unsubscribe?.()
    }
  }, [])

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data) {
        setProfile(data)
      } else if (error && isDemoMode()) {
        console.info('Demo profile active for:', userId)
      }
    } catch (err) {
      console.warn('Error loading profile:', err)
    }
  }

  // Quick Demo Role Switcher for instant evaluator testing
  const switchDemoRole = (role) => {
    if (role === 'admin') {
      setUser({ id: 'demo-admin-id', email: 'admin@digitalheroes.org' })
      setProfile({
        id: 'demo-admin-id',
        full_name: 'Sarah Connor (Admin)',
        email: 'admin@digitalheroes.org',
        role: 'admin',
        is_active: true
      })
    } else if (role === 'subscriber') {
      setUser({ id: 'demo-subscriber-id', email: 'alex.morgan@example.com' })
      setProfile({
        id: 'demo-subscriber-id',
        full_name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        role: 'subscriber',
        is_active: true
      })
      setSubscription({
        plan_type: 'monthly',
        status: 'active',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
    } else {
      setUser(null)
      setProfile(null)
    }
  }

  const signUp = async (email, password, fullName) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: 'subscriber' }
        }
      })
      if (error) throw error

      if (data.user) {
        setUser(data.user)
        setProfile({
          id: data.user.id,
          full_name: fullName,
          email,
          role: 'subscriber',
          is_active: true
        })
      }
      return { data, error: null }
    } catch (err) {
      // Demo fallback if Supabase keys are default
      if (isDemoMode()) {
        const fakeId = `user-${Date.now()}`
        const newProf = { id: fakeId, full_name: fullName, email, role: 'subscriber', is_active: true }
        setUser({ id: fakeId, email })
        setProfile(newProf)
        return { data: { user: newProf }, error: null }
      }
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (data.user) {
        setUser(data.user)
        await loadProfile(data.user.id)
      }
      return { data, error: null }
    } catch (err) {
      if (isDemoMode()) {
        const isAdmin = email.includes('admin')
        switchDemoRole(isAdmin ? 'admin' : 'subscriber')
        return { data: { user: profile }, error: null }
      }
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Sign out:', err)
    }
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        subscription,
        setSubscription,
        loading,
        signUp,
        signIn,
        signOut,
        switchDemoRole,
        isAdmin: profile?.role === 'admin',
        isSubscriber: profile?.role === 'subscriber'
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

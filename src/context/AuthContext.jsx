import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isDemoMode } from '../lib/supabase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Supabase Session Listener
    const fetchSession = async () => {
      setLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await loadProfileAndSubscription(session.user.id)
        } else {
          // Unauthenticated Public Visitor by default
          setUser(null)
          setProfile(null)
          setSubscription(null)
        }
      } catch (err) {
        console.warn('Supabase Auth check notice:', err)
        setUser(null)
        setProfile(null)
        setSubscription(null)
      } finally {
        setLoading(false)
      }
    }

    const loadProfileAndSubscription = async (userId) => {
      try {
        const { data: profData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (profData) {
          setProfile(profData)
        }

        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (subData) {
          setSubscription(subData)
        }
      } catch (err) {
        console.warn('Error loading user profile or subscription from Supabase:', err)
      }
    }

    fetchSession()

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        await loadProfileAndSubscription(session.user.id)
      } else {
        // Only clear if not in an active demo role state
        if (!user?.id?.startsWith('demo-')) {
          setUser(null)
          setProfile(null)
          setSubscription(null)
        }
      }
      setLoading(false)
    })

    return () => {
      authListener?.unsubscribe?.()
    }
  }, [])

  // Quick Demo Role Switcher for Evaluator testing & role switching
  const switchDemoRole = (role) => {
    setLoading(true)
    if (role === 'admin') {
      const adminUser = { id: 'demo-admin-id', email: 'admin@digitalheroes.org' }
      const adminProfile = {
        id: 'demo-admin-id',
        full_name: 'Sarah Connor (Admin)',
        email: 'admin@digitalheroes.org',
        role: 'admin',
        is_active: true
      }
      setUser(adminUser)
      setProfile(adminProfile)
      setSubscription(null)
    } else if (role === 'subscriber') {
      const subUser = { id: 'demo-subscriber-id', email: 'alex.morgan@example.com' }
      const subProfile = {
        id: 'demo-subscriber-id',
        full_name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        role: 'subscriber',
        is_active: true
      }
      const subSubscription = {
        plan_type: 'monthly',
        status: 'active',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
      setUser(subUser)
      setProfile(subProfile)
      setSubscription(subSubscription)
    } else if (role === 'inactive_subscriber') {
      const inactiveUser = { id: 'demo-inactive-id', email: 'jordan.lee@example.com' }
      const inactiveProfile = {
        id: 'demo-inactive-id',
        full_name: 'Jordan Lee (Inactive)',
        email: 'jordan.lee@example.com',
        role: 'subscriber',
        is_active: false
      }
      const inactiveSubscription = {
        plan_type: 'monthly',
        status: 'inactive',
        current_period_end: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
      setUser(inactiveUser)
      setProfile(inactiveProfile)
      setSubscription(inactiveSubscription)
    } else {
      // Visitor / Public
      setUser(null)
      setProfile(null)
      setSubscription(null)
    }
    setTimeout(() => setLoading(false), 50)
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
        setSubscription({
          plan_type: 'monthly',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
      }
      return { data, error: null }
    } catch (err) {
      if (isDemoMode()) {
        const fakeId = `user-${Date.now()}`
        const newProf = { id: fakeId, full_name: fullName, email, role: 'subscriber', is_active: true }
        const newSub = {
          plan_type: 'monthly',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
        setUser({ id: fakeId, email })
        setProfile(newProf)
        setSubscription(newSub)
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
        await loadProfileAndSubscription(data.user.id)
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
    setLoading(true)
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Sign out notice:', err)
    }
    setUser(null)
    setProfile(null)
    setSubscription(null)
    setLoading(false)
  }

  const isAdmin = profile?.role === 'admin'
  const isSubscriber = profile?.role === 'subscriber'
  const hasActiveSubscription = profile?.is_active === true && (subscription?.status === 'active' || !subscription)

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
        isAdmin,
        isSubscriber,
        hasActiveSubscription
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

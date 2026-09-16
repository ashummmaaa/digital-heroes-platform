import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trophy, Lock, Mail, ArrowRight, Sparkles, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const LoginPage = () => {
  const { signIn, switchDemoRole } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')
    
    const { error } = await signIn(email, password)
    setSubmitting(false)
    
    if (error) {
      setErrorMsg(error.message || 'Login failed. Please check your credentials.')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-amber-400 flex items-center justify-center font-bold mx-auto mb-3">
            <Trophy className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to your Digital Heroes account</p>
        </div>

        {/* QUICK DEMO CREDENTIAL HINTS */}
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Quick Evaluator Login Preset:</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { switchDemoRole('subscriber'); navigate('/dashboard') }}
              className="flex-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 py-1.5 rounded-lg text-[11px] font-semibold transition"
            >
              Subscriber Demo
            </button>
            <button
              type="button"
              onClick={() => { switchDemoRole('admin'); navigate('/admin') }}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-1.5 rounded-lg text-[11px] font-bold transition"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3 rounded-xl text-sm transition shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-emerald-800 hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  )
}

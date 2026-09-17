import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, Home, LogIn, CreditCard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const UnauthorizedPage = () => {
  const { user, isAdmin, isSubscriber } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Access Restricted (403)
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Unauthorized Access
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            You do not have permission to view this page. This section requires a specific user role or active subscription status.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div><span className="font-semibold text-slate-800">Current Auth Status:</span> {user ? 'Logged In' : 'Public Visitor (Logged Out)'}</div>
          {user && (
            <div><span className="font-semibold text-slate-800">Assigned Role:</span> {isAdmin ? 'Admin' : isSubscriber ? 'Subscriber' : 'User'}</div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs transition border border-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md shadow-emerald-900/10"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>

          {!user ? (
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          ) : (
            <Link
              to="/subscription-plans"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-sm"
            >
              <CreditCard className="w-4 h-4" />
              View Plans
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}

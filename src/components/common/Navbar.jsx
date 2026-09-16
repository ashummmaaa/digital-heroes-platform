import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Trophy, Shield, Heart, User, LogOut, Menu, X, Sparkles, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const Navbar = () => {
  const { user, profile, switchDemoRole, signOut, isAdmin, isSubscriber } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* DEMO ROLE SWITCHER BAR */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-semibold text-white">Evaluator Demo Toolbar:</span>
          <span className="hidden sm:inline text-slate-400">Current Role:</span>
          <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded capitalize">
            {profile?.role || 'Public Visitor'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 mr-1 hidden md:inline">Quick Switch:</span>
          <button
            onClick={() => { switchDemoRole('visitor'); navigate('/') }}
            className={`px-2 py-1 rounded text-xs transition ${
              !user ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Visitor
          </button>
          <button
            onClick={() => { switchDemoRole('subscriber'); navigate('/dashboard') }}
            className={`px-2 py-1 rounded text-xs transition ${
              isSubscriber ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Subscriber View
          </button>
          <button
            onClick={() => { switchDemoRole('admin'); navigate('/admin') }}
            className={`px-2 py-1 rounded text-xs transition ${
              isAdmin ? 'bg-amber-600 text-white font-semibold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Admin Panel
          </button>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 font-black shadow-md shadow-emerald-950/20">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">Digital<span className="text-emerald-800">Heroes</span></span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600 -mt-1">Play • Support • Win</span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-sm font-medium transition ${isActive('/') ? 'text-emerald-800 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}>
              Home
            </Link>
            <Link to="/how-it-works" className={`text-sm font-medium transition ${isActive('/how-it-works') ? 'text-emerald-800 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}>
              How It Works
            </Link>
            <Link to="/charities" className={`text-sm font-medium transition ${isActive('/charities') ? 'text-emerald-800 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}>
              Charities
            </Link>
            <Link to="/pricing" className={`text-sm font-medium transition ${isActive('/pricing') ? 'text-emerald-800 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}>
              Subscription Plans
            </Link>
          </nav>

          {/* ACTION BUTTONS */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-white font-medium px-4 py-2 rounded-xl text-sm transition shadow-md shadow-emerald-900/10"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    My Dashboard
                  </Link>
                )}

                <button
                  onClick={signOut}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-emerald-900 hover:bg-emerald-950 text-white font-semibold px-4 py-2 rounded-xl text-sm transition shadow-md shadow-emerald-900/10"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            How It Works
          </Link>
          <Link
            to="/charities"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Charities
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Subscription Plans
          </Link>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-emerald-900 text-white font-semibold py-2.5 rounded-xl text-sm"
                >
                  {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                </Link>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false) }}
                  className="w-full text-center text-slate-600 hover:bg-slate-100 py-2.5 rounded-xl text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-slate-700 border border-slate-300 py-2 rounded-xl text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-emerald-900 text-white font-semibold py-2 rounded-xl text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

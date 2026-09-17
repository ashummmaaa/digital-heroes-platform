import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Target, Heart, Trophy, Award, CreditCard,
  LogOut, Menu, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Badge } from '../components/common/Badge'

export const DashboardLayout = () => {
  const { profile, subscription, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Golf Scores', path: '/dashboard/scores', icon: Target },
    { label: 'Charity Selection', path: '/dashboard/charity', icon: Heart },
    { label: 'Monthly Draws', path: '/dashboard/draws', icon: Trophy },
    { label: 'Winnings & Proof', path: '/dashboard/winnings', icon: Award },
    { label: 'Subscription Plan', path: '/dashboard/subscription', icon: CreditCard }
  ]

  const isActive = (path) => location.pathname === path

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* MOBILE HEADER */}
      <header className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-white text-base">Subscriber Portal</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-slate-300">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col justify-between border-r border-slate-800
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 space-y-6">
            
            {/* BRAND */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white">Digital<span className="text-emerald-500">Heroes</span></span>
                <span className="block text-[10px] text-amber-400 font-bold uppercase tracking-wider -mt-0.5">Subscriber Area</span>
              </div>
            </Link>

            {/* USER CARD */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-900/80 text-emerald-300 flex items-center justify-center font-bold text-sm">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{profile?.full_name || 'Subscriber'}</div>
                <div className="text-[11px] text-slate-400 truncate">{profile?.email}</div>
              </div>
            </div>

            {/* NAV LINKS */}
            <nav className="space-y-1.5 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      active
                        ? 'bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/40 border border-emerald-700/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

          </div>

          {/* SIDEBAR FOOTER */}
          <div className="p-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Status:</span>
              <Badge variant={profile?.is_active ? 'success' : 'danger'}>
                {profile?.is_active ? 'Active Plan' : 'Inactive'}
              </Badge>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-xl text-xs transition border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

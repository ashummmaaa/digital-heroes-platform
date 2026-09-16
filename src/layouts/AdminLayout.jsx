import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Shield, LayoutDashboard, Users, CreditCard, Heart, Trophy, Award,
  FileText, LogOut, Menu, X, Sparkles, AlertTriangle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Badge } from '../components/common/Badge'

export const AdminLayout = () => {
  const { profile, isAdmin, switchDemoRole } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
    { label: 'Charity Manager', path: '/admin/charities', icon: Heart },
    { label: 'Draw Engine', path: '/admin/draws', icon: Trophy },
    { label: 'Winner Approvals', path: '/admin/winners', icon: Award },
    { label: 'Audit Reports', path: '/admin/reports', icon: FileText }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* MOBILE HEADER */}
      <header className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-white text-base">Admin Control Panel</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-slate-300">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* ADMIN SIDEBAR */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col justify-between border-r border-slate-800
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 space-y-6">
            
            {/* BRAND */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white">Digital<span className="text-amber-400">Heroes</span></span>
                <span className="block text-[10px] text-amber-400 font-bold uppercase tracking-wider -mt-0.5">Admin Portal</span>
              </div>
            </Link>

            {/* ADMIN PROFILE CARD */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{profile?.full_name || 'Admin User'}</div>
                <div className="text-[11px] text-amber-400 font-semibold truncate uppercase">Super Administrator</div>
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
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

          </div>

          {/* SIDEBAR FOOTER */}
          <div className="p-6 border-t border-slate-800 space-y-3">
            <button
              onClick={() => { switchDemoRole('subscriber'); navigate('/dashboard') }}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-xl text-xs transition border border-slate-700"
            >
              Switch to Subscriber View
            </button>
          </div>
        </aside>

        {/* MAIN ADMIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-950 text-slate-100">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

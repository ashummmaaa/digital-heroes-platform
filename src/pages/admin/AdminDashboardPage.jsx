import React from 'react'
import { Users, CreditCard, Heart, Trophy, TrendingUp, ShieldCheck, Activity } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { useData } from '../../context/DataContext'
import { formatCurrency, formatDate } from '../../lib/utils'

export const AdminDashboardPage = () => {
  const { charities, draws, winnerSubmissions, auditLogs } = useData()

  // Sample analytics data for Recharts
  const revenueData = [
    { month: 'May', revenue: 21500, charity: 8600, prizePool: 8600 },
    { month: 'Jun', revenue: 24200, charity: 9680, prizePool: 9680 },
    { month: 'Jul', revenue: 26800, charity: 10720, prizePool: 10720 },
    { month: 'Aug', revenue: 28400, charity: 11360, prizePool: 11360 },
    { month: 'Sep', revenue: 29000, charity: 11600, prizePool: 11600 }
  ]

  const charityPieData = charities.map(c => ({
    name: c.name,
    value: c.total_raised
  }))

  const COLORS = ['#35a88c', '#d4af37', '#e6c860', '#1f6b57', '#0f382c']

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Executive Control Center</div>
        <h1 className="text-3xl font-black text-white tracking-tight">Platform Performance & Analytics</h1>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Active Subscribers</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">1,450</div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from last month
          </span>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Monthly Subscription Revenue</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{formatCurrency(28985.50)}</div>
          <span className="text-[11px] text-slate-400">40% allocated to charity pool</span>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Charity Contributions Raised</span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{formatCurrency(166670.00)}</div>
          <span className="text-[11px] text-slate-400">Disbursed across {charities.length} partners</span>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Pending Winner Verifications</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">
            {winnerSubmissions.filter(w => w.status === 'pending_verification').length}
          </div>
          <span className="text-[11px] text-amber-300 font-semibold">Requires admin approval</span>
        </div>

      </div>

      {/* RECHARTS ANALYTICS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* REVENUE & ALLOCATION CHART */}
        <div className="lg:col-span-8 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">Monthly Revenue & Charity Allocation Growth</h3>
              <p className="text-xs text-slate-400">Historical financial performance overview</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCharity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#35a88c" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#35a88c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#d4af37" fillOpacity={1} fill="url(#colorRev)" name="Total Revenue ($)" />
                <Area type="monotone" dataKey="charity" stroke="#35a88c" fillOpacity={1} fill="url(#colorCharity)" name="Charity Allocation ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHARITY PIE DISTRIBUTION */}
        <div className="lg:col-span-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2 border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Charity Distribution Split</h3>
            <p className="text-xs text-slate-400">Current player allocation shares</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charityPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {charityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            {charities.slice(0, 3).map((c, i) => (
              <div key={c.id} className="flex justify-between items-center">
                <span className="truncate max-w-[180px]">{c.name}</span>
                <span className="font-bold text-white">{formatCurrency(c.total_raised)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT AUDIT LOG ACTIVITY */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          System Audit Trail & Admin Operations
        </h3>

        <div className="space-y-2 text-xs">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">{log.action}</span>
                  <span className="text-slate-300">Target Entity: {log.entity_type} ({log.entity_id})</span>
                </div>
                <span className="text-slate-500 text-[11px]">{formatDate(log.created_at)}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-500 py-4 text-center italic">No security audit logs recorded yet.</div>
          )}
        </div>
      </div>

    </div>
  )
}

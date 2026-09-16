import React, { useState } from 'react'
import { Users, Search, Shield, Filter, Eye } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { Badge } from '../../components/common/Badge'

export const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const demoUsersList = [
    { id: 'usr-1', name: 'Alex Morgan', email: 'alex.morgan@example.com', role: 'subscriber', plan: 'monthly', status: 'active', scoresCount: 5 },
    { id: 'usr-2', name: 'David Miller', email: 'david.miller@example.com', role: 'subscriber', plan: 'yearly', status: 'active', scoresCount: 5 },
    { id: 'usr-3', name: 'Sarah Connor', email: 'admin@digitalheroes.org', role: 'admin', plan: 'n/a', status: 'active', scoresCount: 0 },
    { id: 'usr-4', name: 'James Wilson', email: 'james.wilson@example.com', role: 'subscriber', plan: 'monthly', status: 'active', scoresCount: 4 }
  ]

  const filtered = demoUsersList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">User Administration</span>
          <h1 className="text-3xl font-black text-white tracking-tight">Registered Platform Users</h1>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">User Name</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Platform Role</th>
                <th className="py-4 px-6">Subscription Tier</th>
                <th className="py-4 px-6">Logged Scores</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {filtered.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-4 px-6 text-white font-bold">{usr.name}</td>
                  <td className="py-4 px-6 text-slate-400">{usr.email}</td>
                  <td className="py-4 px-6">
                    <Badge variant={usr.role === 'admin' ? 'gold' : 'info'}>
                      {usr.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 capitalize">{usr.plan}</td>
                  <td className="py-4 px-6">{usr.scoresCount} Scores</td>
                  <td className="py-4 px-6">
                    <Badge variant="success">ACTIVE</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

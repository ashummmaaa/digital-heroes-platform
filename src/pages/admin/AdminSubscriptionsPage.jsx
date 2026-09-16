import React from 'react'
import { CreditCard, ShieldCheck } from 'lucide-react'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Badge } from '../../components/common/Badge'

export const AdminSubscriptionsPage = () => {
  const subscriptions = [
    { id: 'sub-101', user: 'Alex Morgan', email: 'alex.morgan@example.com', plan: 'monthly', customerId: 'cus_N87123A', subId: 'sub_M9123', status: 'active', amount: 19.99, renewal: '2026-10-01' },
    { id: 'sub-102', user: 'David Miller', email: 'david.miller@example.com', plan: 'yearly', customerId: 'cus_K44910B', subId: 'sub_Y4410', status: 'active', amount: 199.00, renewal: '2027-08-15' },
    { id: 'sub-103', user: 'James Wilson', email: 'james.wilson@example.com', plan: 'monthly', customerId: 'cus_L10294C', subId: 'sub_M5512', status: 'active', amount: 19.99, renewal: '2026-09-28' }
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Financial Ledger</span>
        <h1 className="text-3xl font-black text-white tracking-tight">Stripe Subscriptions & Recurring Revenue</h1>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Subscriber</th>
                <th className="py-4 px-6">Plan Type</th>
                <th className="py-4 px-6">Stripe Customer ID</th>
                <th className="py-4 px-6">Stripe Subscription ID</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Next Renewal</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-4 px-6 text-white font-bold">{sub.user}<br/><span className="text-[11px] font-normal text-slate-400">{sub.email}</span></td>
                  <td className="py-4 px-6 capitalize">{sub.plan}</td>
                  <td className="py-4 px-6 font-mono text-[11px] text-slate-400">{sub.customerId}</td>
                  <td className="py-4 px-6 font-mono text-[11px] text-slate-400">{sub.subId}</td>
                  <td className="py-4 px-6 font-bold text-emerald-400">{formatCurrency(sub.amount)}</td>
                  <td className="py-4 px-6">{formatDate(sub.renewal)}</td>
                  <td className="py-4 px-6"><Badge variant="success">ACTIVE</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

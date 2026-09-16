import React from 'react'
import { CreditCard, CheckCircle2, ShieldCheck, Sparkles, RefreshCw, XCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatDate } from '../../lib/utils'
import { Badge } from '../../components/common/Badge'

export const SubscriptionPage = () => {
  const { subscription, setSubscription } = useAuth()
  const { showToast } = useData()

  const handleSimulatePayment = (newPlan) => {
    setSubscription({
      plan_type: newPlan,
      status: 'active',
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
    showToast(`Stripe Checkout simulated successfully! Plan updated to ${newPlan}.`)
  }

  const handleCancel = () => {
    setSubscription(prev => ({ ...prev, status: 'canceled', cancel_at_period_end: true }))
    showToast('Subscription set to cancel at current period end.')
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscription & Billing</h1>
        <p className="text-xs text-slate-500">
          Manage your Digital Heroes subscription tier, renewal settings, and Stripe billing portal.
        </p>
      </div>

      {/* CURRENT SUBSCRIPTION CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Current Plan</span>
            <h2 className="text-2xl font-black text-slate-900">
              {subscription?.plan_type === 'yearly' ? 'Annual Membership ($199/yr)' : 'Monthly Supporter ($19.99/mo)'}
            </h2>
          </div>
          <Badge variant={subscription?.status === 'active' ? 'success' : 'warning'}>
            {subscription?.status?.toUpperCase() || 'ACTIVE'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="text-slate-400 block font-semibold">Billing Frequency:</span>
            <span className="font-bold text-slate-900 text-sm capitalize">{subscription?.plan_type}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Next Renewal Date:</span>
            <span className="font-bold text-slate-900 text-sm">{formatDate(subscription?.current_period_end)}</span>
          </div>
        </div>

        {/* DEMO STRIPE PAYMENT SIMULATOR */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Stripe Checkout & Demo Mode Simulator:</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSimulatePayment('monthly')}
              className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold transition"
            >
              Switch to Monthly ($19.99/mo)
            </button>
            <button
              onClick={() => handleSimulatePayment('yearly')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition"
            >
              Switch to Annual ($199/yr)
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

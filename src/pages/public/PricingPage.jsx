import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react'

export const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Subscription Options
        </span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Transparent Impact Pricing
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          40% of every subscription goes directly to your selected charity, 40% funds monthly cash prize pools, and 20% maintains platform security.
        </p>

        {/* BILLING TOGGLE */}
        <div className="inline-flex items-center p-1 bg-slate-200 rounded-2xl border border-slate-300">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Billing ($19.99/mo)
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              billingCycle === 'yearly' ? 'bg-emerald-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Annual Billing ($199/yr - Save 17%)
          </button>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* MONTHLY CARD */}
        <div className={`p-8 rounded-3xl border transition ${
          billingCycle === 'monthly'
            ? 'bg-white border-emerald-800 shadow-xl ring-2 ring-emerald-800/20'
            : 'bg-white border-slate-200 shadow-sm'
        } space-y-6`}>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Flexible Subscription</span>
            <div className="text-4xl font-black text-slate-900">$19.99 <span className="text-sm font-normal text-slate-500">/ month</span></div>
            <p className="text-xs text-slate-600">Cancel or modify anytime through your user dashboard.</p>
          </div>

          <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Stableford score tracking (1-45 range)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Rolling 5 score draw number derivation</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> $8.00 (40%) to your chosen charity</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Monthly draw participation (3, 4, 5 match tiers)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verification & secure cash payout</li>
          </ul>

          <Link
            to="/signup"
            className="block w-full text-center bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl text-sm transition"
          >
            Select Monthly Plan
          </Link>
        </div>

        {/* ANNUAL CARD */}
        <div className={`p-8 rounded-3xl border transition ${
          billingCycle === 'yearly'
            ? 'bg-slate-900 text-white border-amber-500 shadow-2xl ring-2 ring-amber-500/20'
            : 'bg-slate-900 text-white border-slate-800 shadow-md'
        } space-y-6 relative overflow-hidden`}>
          <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Best Value
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Annual Membership</span>
            <div className="text-4xl font-black text-white">$199.00 <span className="text-sm font-normal text-slate-400">/ year</span></div>
            <p className="text-xs text-slate-300">Save $40.88 annually with guaranteed 12-month draw participation.</p>
          </div>

          <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-6">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> All Monthly plan features included</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> $79.60 total annual charity contribution</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 12 consecutive monthly draw entries</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Priority scorecard verification processing</li>
          </ul>

          <Link
            to="/signup"
            className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition shadow-md shadow-amber-500/20"
          >
            Select Annual Membership
          </Link>
        </div>

      </div>

    </div>
  )
}

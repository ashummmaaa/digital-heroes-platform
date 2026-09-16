import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Target, ShieldCheck, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react'

export const HowItWorksPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Platform Architecture & Mechanics
        </span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          How Digital Heroes Draw Rewards Work
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Digital Heroes seamlessly bridges your Stableford golf score tracking with verifiable monthly charity allocations and cash prize rewards. Here is the exact mathematical and operational framework.
        </p>
      </div>

      {/* SCORE TO DRAW NUMBER MAPPING */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">1. Golf Score to Draw Number Generation</h2>
            <p className="text-xs text-slate-500">Stableford Points Range: 1 – 45</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Rolling 5-Score Constraint</h3>
            <p className="leading-relaxed">
              Every subscriber inputs their latest golf scores in Stableford format (1 to 45 points). Only your <strong>latest 5 scores</strong> are retained. When you submit a 6th score, an automated database trigger deletes the oldest score for your account.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono">
              Example Scores: [36, 40, 32, 38, 42] → Draw Numbers: [14, 22, 34, 38, 41]
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Cutoff & Filler Generation</h3>
            <p className="leading-relaxed">
              If a subscriber has fewer than 5 scores at the monthly draw cutoff, deterministic filler numbers derived from their user UUID fill the remaining slots so everyone has a full 5-number entry.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Maximum 1 score per date</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Rolling 5 score database constraint</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant Stableford range validation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* PRIZE POOL ALLOCATION */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Financial Breakdown</span>
          <h2 className="text-2xl font-black text-white">2. Subscription Allocation & Prize Tiers</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            For every $19.99 monthly subscription, funds are strictly partitioned according to our transparent allocation rules:
          </p>
        </div>

        {/* ALLOCATION PILL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-3xl font-black text-emerald-400">40%</div>
            <div className="font-bold text-white text-sm">Charity Contribution</div>
            <p className="text-xs text-slate-400">
              Directly transferred to your chosen partner charity based on your selection percentage.
            </p>
          </div>

          <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-3xl font-black text-amber-400">40%</div>
            <div className="font-bold text-white text-sm">Monthly Prize Pool</div>
            <p className="text-xs text-slate-400">
              Pooled to fund the monthly cash prize payouts across 3 match tiers.
            </p>
          </div>

          <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-3xl font-black text-slate-400">20%</div>
            <div className="font-bold text-white text-sm">Platform & Reserve</div>
            <p className="text-xs text-slate-400">
              Covers payment processing, server hosting, and admin verification operations.
            </p>
          </div>
        </div>

        {/* PRIZE TIERS TABLE */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="font-bold text-white text-base">Prize Distribution Across Match Tiers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-amber-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tier Match</th>
                  <th className="py-3 px-4">Pool Share</th>
                  <th className="py-3 px-4">Rollover Rule</th>
                  <th className="py-3 px-4">Split Mechanism</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="py-3 px-4 font-bold text-white">5-Number Match (Jackpot)</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">40% of Pool</td>
                  <td className="py-3 px-4 text-emerald-400">Rolls over if unclaimed</td>
                  <td className="py-3 px-4">Split equally among 5-match winners</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">4-Number Match</td>
                  <td className="py-3 px-4 font-bold">35% of Pool</td>
                  <td className="py-3 px-4 text-slate-400">No rollover</td>
                  <td className="py-3 px-4">Split equally among 4-match winners</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">3-Number Match</td>
                  <td className="py-3 px-4 font-bold">25% of Pool</td>
                  <td className="py-3 px-4 text-slate-400">No rollover</td>
                  <td className="py-3 px-4">Split equally among 3-match winners</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* WINNER VERIFICATION */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">3. Winner Scorecard Verification & Payout</h2>
            <p className="text-xs text-slate-500">Fairness & Audit Process</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-sm">Step 1: Winner Identification</div>
            <p>Following monthly draw publication, eligible subscribers matching 3+ numbers receive an in-app verification notification.</p>
          </div>
          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-sm">Step 2: Proof Upload</div>
            <p>Winner uploads an image of their official golf scorecard / club system printout to our secure Supabase Storage bucket.</p>
          </div>
          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-sm">Step 3: Admin Review & Payout</div>
            <p>Platform admins inspect the proof image. Upon approval, cash payout is directly transferred to the winner's account.</p>
          </div>
        </div>
      </div>

    </div>
  )
}

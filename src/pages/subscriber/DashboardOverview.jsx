import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Target, Heart, Award, ArrowRight, Calendar, Sparkles, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Badge } from '../../components/common/Badge'

export const DashboardOverview = () => {
  const { profile, subscription } = useAuth()
  const { scores, userDrawNumbers, charities, selectedCharityId, contributionPercentage, winnerSubmissions } = useData()

  const selectedCharity = charities.find(c => c.id === selectedCharityId) || charities[0]
  const monthlyCharityDonation = 19.99 * (contributionPercentage / 100)

  const pendingWinnings = winnerSubmissions.filter(w => w.user_id === (profile?.id || 'demo-subscriber-id'))

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* WELCOME BANNER */}
      <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-900 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-900/80 border border-emerald-700/60 px-3 py-1 rounded-full text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Subscription: {subscription?.plan_type === 'yearly' ? 'Annual Membership' : 'Monthly Subscriber'}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Welcome back, {profile?.full_name || 'Hero'}!
          </h1>
          <p className="text-xs text-emerald-200 leading-relaxed">
            Your golf scores are active and your 5 Hero Numbers are qualified for the upcoming September 2026 Monthly Draw.
          </p>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-right z-10 space-y-1 w-full md:w-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Next Draw Date</span>
          <span className="text-xl font-black text-amber-400">Oct 1, 2026</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Automatic Entry Active</span>
        </div>
      </div>

      {/* QUICK METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* SCORES COUNT CARD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Active Golf Scores</span>
            <Target className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="text-3xl font-black text-slate-900">{scores.length} / 5</div>
          <p className="text-[11px] text-slate-500">Rolling 5 latest scores form draw entry</p>
        </div>

        {/* DRAW NUMBERS CARD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Your 5 Hero Numbers</span>
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
            {userDrawNumbers.map((num, i) => (
              <span key={i} className="w-7 h-7 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center text-xs shadow-inner">
                {num}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">Derived from your golf performance</p>
        </div>

        {/* CHARITY IMPACT CARD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Monthly Charity Gift</span>
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600/20" />
          </div>
          <div className="text-3xl font-black text-emerald-800">{formatCurrency(monthlyCharityDonation)}</div>
          <p className="text-[11px] text-slate-500 truncate">{contributionPercentage}% to {selectedCharity.name}</p>
        </div>

        {/* WINNINGS CARD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Total Winnings</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {formatCurrency(pendingWinnings.reduce((acc, curr) => acc + curr.prize_amount, 0))}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">{pendingWinnings.length} Claimable Rewards</p>
        </div>

      </div>

      {/* TWO COLUMN DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RECENT SCORES SUMMARY */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Rolling Golf Scores</h3>
              <p className="text-xs text-slate-500">Only latest 5 scores retained automatically</p>
            </div>
            <Link to="/dashboard/scores" className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1">
              Manage Scores →
            </Link>
          </div>

          <div className="space-y-3">
            {scores.map((score, idx) => (
              <div key={score.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-900 text-white font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{score.score} Stableford Points</span>
                    <span className="text-slate-500 text-[11px]">{formatDate(score.score_date)}</span>
                  </div>
                </div>
                <Badge variant="emerald">Draw Number: {score.score}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* SELECTED CHARITY CARD */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Selected Charity Partner</h3>
              <Link to="/dashboard/charity" className="text-xs font-bold text-emerald-800 hover:text-emerald-950">
                Change →
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <img src={selectedCharity.image_url} alt={selectedCharity.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {selectedCharity.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{selectedCharity.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{selectedCharity.description}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Selected Contribution:</span>
                <span className="font-bold text-slate-900">{contributionPercentage}%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Monthly Donation:</span>
                <span className="font-bold text-emerald-800">{formatCurrency(monthlyCharityDonation)}</span>
              </div>
            </div>
          </div>

          <Link
            to="/dashboard/charity"
            className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition"
          >
            Adjust Contribution Percentage
          </Link>
        </div>

      </div>

    </div>
  )
}

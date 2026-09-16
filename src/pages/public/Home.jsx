import React from 'react'
import { Link } from 'react-router-dom'
import {
  Trophy, Heart, Target, Sparkles, ArrowRight, ShieldCheck,
  TrendingUp, Award, Users, CheckCircle2, HelpCircle
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../lib/utils'

export const Home = () => {
  const { charities, draws, prizePools } = useData()

  const featuredCharities = charities.filter(c => c.is_featured).slice(0, 3)
  const latestDraw = draws.find(d => d.status === 'published')

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-emerald-950 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-900/80 border border-emerald-700/60 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Modern Golf Impact & Draw Rewards Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Play With Purpose.<br />
                <span className="text-amber-400">Track Scores.</span> Support Causes.
              </h1>

              <p className="text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Digital Heroes turns your regular golf games into measurable real-world charitable impact. Submit your latest Stableford scores, allocate 10%+ to your favorite charity, and qualify for monthly cash draw rewards.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-base transition shadow-lg shadow-amber-500/20"
                >
                  Join the Platform
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-900/80 hover:bg-emerald-800 text-white font-semibold px-6 py-4 rounded-xl text-base border border-emerald-700/60 transition"
                >
                  Explore Draw Mechanics
                </Link>
              </div>

              {/* STATS STRIP */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-emerald-800/80 max-w-xl mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-black text-amber-400">$166K+</div>
                  <div className="text-xs text-emerald-200">Raised for Charities</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">$45K+</div>
                  <div className="text-xs text-emerald-200">Draw Winners Paid</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-400">1,400+</div>
                  <div className="text-xs text-emerald-200">Active Players</div>
                </div>
              </div>
            </div>

            {/* HERO INTERACTIVE CARD */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Active Draw Period</span>
                    <h3 className="text-xl font-bold text-white">September 2026 Monthly Draw</h3>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-lg">
                    40% Jackpot Tier
                  </div>
                </div>

                {/* HIGHLIGHT NUMBERS */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Winning Numbers Breakdown</div>
                  <div className="flex items-center justify-between gap-2">
                    {(latestDraw?.winning_numbers || [14, 22, 34, 38, 41]).map((num, idx) => (
                      <div
                        key={idx}
                        className="w-12 h-12 rounded-2xl bg-emerald-900 border border-amber-500/40 flex items-center justify-center font-black text-lg text-amber-300 shadow-inner"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PRIZE ALLOCATION SUMMARY */}
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Total Subscriber Pool:</span>
                    <span className="font-bold text-white">{formatCurrency(latestDraw?.total_pool_amount || 11360)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>5-Match Jackpot (Incl. Rollover):</span>
                    <span className="font-bold text-amber-400">{formatCurrency(7044)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Charity Contribution Share:</span>
                    <span className="font-bold text-emerald-400">40% of Subscriptions</span>
                  </div>
                </div>

                <Link
                  to="/how-it-works"
                  className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 rounded-xl text-xs transition border border-slate-700"
                >
                  View Complete Prize Distribution Structure →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">How Digital Heroes Works</h2>
          <p className="text-slate-600 text-sm">
            Four simple steps turn your regular weekly golf scores into real charity funding and monthly reward opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Subscribe Monthly</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose a monthly ($19.99/mo) or discounted annual plan. 40% directly supports your chosen charity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Enter Stableford Scores</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Log your scores (1–45 points). Your latest 5 scores automatically become your 5 Hero Draw Numbers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Select Your Charity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose from verified partner charities and set your contribution percentage (10% to 100%).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base">Participate & Win</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every month, 5 winning numbers are drawn. Match 3, 4, or 5 numbers to claim verified cash prizes!
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED CHARITIES */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">Impact Partners</div>
              <h2 className="text-3xl font-black text-slate-900">Featured Partner Charities</h2>
            </div>
            <Link
              to="/charities"
              className="text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              Browse All Charities →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCharities.map((charity) => (
              <div key={charity.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col">
                <img
                  src={charity.image_url}
                  alt={charity.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {charity.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg leading-snug">{charity.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{charity.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Raised to Date:</span>
                    <span className="font-bold text-emerald-800">{formatCurrency(charity.total_raised)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-black text-slate-900">Simple, Transparent Pricing</h2>
          <p className="text-slate-600 text-sm">
            Choose how you want to contribute. Every tier includes score tracking, charity allocation, and draw entries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* MONTHLY PLAN */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Flexible Monthly</span>
              <div className="text-4xl font-black text-slate-900">$19.99 <span className="text-sm font-normal text-slate-500">/ month</span></div>
              <p className="text-xs text-slate-600">Perfect for regular golfers looking for a flexible month-to-month commitment.</p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Track up to 5 Stableford scores</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 40% ($8.00) directly to selected charity</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1 entry in monthly cash prize draw</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified proof & cash payout processing</li>
              </ul>
            </div>
            <Link
              to="/signup"
              className="block w-full text-center bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl text-sm transition"
            >
              Start Monthly Plan
            </Link>
          </div>

          {/* YEARLY PLAN */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl border border-amber-500/30 shadow-xl flex flex-col justify-between space-y-6 text-left relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Save 17%
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Annual Hero Supporter</span>
              <div className="text-4xl font-black text-white">$199.00 <span className="text-sm font-normal text-slate-400">/ year</span></div>
              <p className="text-xs text-slate-300">Maximize your charity impact and lock in 12 continuous draw entries.</p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> All Monthly Plan features included</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> $79.60 total annual charity donation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 12 consecutive monthly draw entries</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Priority winner verification status</li>
              </ul>
            </div>
            <Link
              to="/signup"
              className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition shadow-md shadow-amber-500/20"
            >
              Start Annual Membership
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 border border-emerald-900 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Ready to Make Your Golf Scores Count?</h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Join hundreds of golfers playing with purpose today. Register, select your charity, and participate in next month's draw.
            </p>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-base transition shadow-lg shadow-amber-500/20"
          >
            Create Your Account Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  )
}

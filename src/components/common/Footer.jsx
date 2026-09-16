import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Heart, Shield, Award } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* BRAND COLUMN */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 font-bold">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xl font-black text-white">Digital<span className="text-emerald-500">Heroes</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A modern impact platform uniting golf score tracking, verified charity contributions, and monthly draw-based rewards.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <Shield className="w-4 h-4" />
              <span>Powered by Supabase & Stripe Security</span>
            </div>
          </div>

          {/* PLATFORM LINKS */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-white transition">Home Overview</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link to="/charities" className="hover:text-white transition">Charity Directory</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Subscription Plans</Link></li>
            </ul>
          </div>

          {/* LEGAL & IMPACT */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Transparency</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="text-slate-400">40% Prize Pool Allocation</span></li>
              <li><span className="text-slate-400">40% Direct Charity Support</span></li>
              <li><span className="text-slate-400">20% Platform Reserve</span></li>
              <li><span className="text-slate-400">Stableford 1-45 Validation</span></li>
              <li><span className="text-slate-400">Scorecard Verification</span></li>
            </ul>
          </div>

          {/* IMPACT PROMISE */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Heart className="w-4 h-4 fill-emerald-400" />
              <span>Play With Purpose</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every round you play helps fund verified charities while giving you a chance to win monthly prize draws.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
              © {new Date().getFullYear()} Digital Heroes. All rights reserved.
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}

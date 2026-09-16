import React from 'react'
import { Trophy, Target, Sparkles, Calendar, Award } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatCurrency, formatDate, calculateMatchCount } from '../../lib/utils'
import { Badge } from '../../components/common/Badge'

export const DrawsPage = () => {
  const { userDrawNumbers, draws, prizePools } = useData()

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Monthly Prize Draws</h1>
        <p className="text-xs text-slate-500">
          View your active draw entry numbers and review published monthly draw winning numbers and prize pools.
        </p>
      </div>

      {/* ACTIVE ENTRY CARD */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upcoming Draw: September 2026</span>
            </div>
            <h2 className="text-xl font-bold text-white">Your Qualified 5 Hero Draw Numbers</h2>
          </div>
          <Badge variant="gold">Entry Status: Qualified</Badge>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            {userDrawNumbers.map((num, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-2xl bg-emerald-900 border border-amber-500/40 text-amber-300 font-black text-xl flex items-center justify-center shadow-lg"
              >
                {num}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            These 5 numbers match your latest Stableford golf scores logged in your account.
          </p>
        </div>
      </div>

      {/* PREVIOUS PUBLISHED DRAWS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Past Monthly Draw Results
        </h2>

        <div className="space-y-6">
          {draws.map((draw) => {
            const matches = calculateMatchCount(userDrawNumbers, draw.winning_numbers)
            return (
              <div key={draw.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Month Period</span>
                    <h3 className="text-lg font-bold text-slate-900">{draw.draw_month} Draw</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={draw.status === 'published' ? 'success' : 'warning'}>
                      {draw.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium">Executed: {formatDate(draw.executed_at)}</span>
                  </div>
                </div>

                {/* WINNING NUMBERS */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Official Winning Numbers</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {draw.winning_numbers.map((winNum, idx) => (
                      <span key={idx} className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-black flex items-center justify-center text-sm">
                        {winNum}
                      </span>
                    ))}
                  </div>
                </div>

                {/* USER MATCH RESULTS */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Your Match Result:</span>
                    <span className={`font-bold text-sm ${matches >= 3 ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {matches} Number Matches {matches >= 3 ? '🎉 (Prize Eligible)' : ''}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Total Draw Prize Pool:</span>
                    <span className="font-bold text-slate-900 text-sm">{formatCurrency(draw.total_pool_amount)}</span>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

      </div>

    </div>
  )
}

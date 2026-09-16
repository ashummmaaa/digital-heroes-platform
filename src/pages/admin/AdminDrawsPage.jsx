import React, { useState } from 'react'
import { Trophy, Play, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, Shield } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Badge } from '../../components/common/Badge'

export const AdminDrawsPage = () => {
  const { draws, simulateMonthDraw, publishDraw } = useData()

  const [drawMonth, setDrawMonth] = useState('2026-10')
  const [drawType, setDrawType] = useState('algorithmic_frequency')
  const [simulationResult, setSimulationResult] = useState(null)

  const handleRunSimulation = () => {
    const result = simulateMonthDraw(drawMonth, drawType)
    setSimulationResult(result)
  }

  const handlePublish = () => {
    if (!simulationResult) return
    publishDraw(simulationResult.simulatedDraw, simulationResult.simulatedPools)
    setSimulationResult(null)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Monthly Draw Engine</span>
        <h1 className="text-3xl font-black text-white tracking-tight">Draw Simulator & Results Publisher</h1>
      </div>

      {/* DRAW CONFIGURATOR CARD */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Configure New Draw Session
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-2">Draw Month Period</label>
            <input
              type="month"
              value={drawMonth}
              onChange={(e) => setDrawMonth(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-2">Algorithm Type</label>
            <select
              value={drawType}
              onChange={(e) => setDrawType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="random">Secure Random Draw (RNG)</option>
              <option value="algorithmic_frequency">Score-Frequency Weighted Draw</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunSimulation}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              Run 1-Click Simulation
            </button>
          </div>

        </div>
      </div>

      {/* SIMULATION PREVIEW RESULT */}
      {simulationResult && (
        <div className="bg-slate-900 border-2 border-amber-500/80 p-6 sm:p-8 rounded-3xl space-y-6 animate-fade-in shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulation Complete — Awaiting Approval</span>
              </div>
              <h3 className="text-2xl font-black text-white">Preview for {simulationResult.simulatedDraw.draw_month}</h3>
            </div>

            <button
              onClick={handlePublish}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-xl text-sm transition shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Publish Final Results
            </button>
          </div>

          {/* WINNING NUMBERS GENERATED */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Generated Winning Numbers</span>
            <div className="flex items-center gap-3">
              {simulationResult.simulatedDraw.winning_numbers.map((num, i) => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-emerald-900 text-amber-300 border border-amber-500/40 font-black text-lg flex items-center justify-center shadow-md">
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* PRIZE POOL BREAKDOWN TIERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800 text-xs">
            {simulationResult.simulatedPools.map((pool) => (
              <div key={pool.tier} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="font-bold text-white text-sm">{pool.tier}-Number Match Tier</span>
                  <span className="font-bold text-amber-400">{pool.percentage}% Pool</span>
                </div>
                <div className="text-2xl font-black text-emerald-400">{formatCurrency(pool.final_amount)}</div>
                <div className="text-[11px] text-slate-400">
                  Base: {formatCurrency(pool.base_amount)} {pool.rollover_amount > 0 && `+ Rollover: ${formatCurrency(pool.rollover_amount)}`}
                </div>
                <div className="pt-2 border-t border-slate-900 text-slate-300">
                  Simulated Winners: <strong className="text-white">{pool.winner_count}</strong> ({formatCurrency(pool.payout_per_winner)} each)
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* DRAW HISTORY TABLE */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-6">
        <h3 className="font-bold text-white text-base">Published Draw History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Month</th>
                <th className="py-3.5 px-4">Algorithm</th>
                <th className="py-3.5 px-4">Winning Numbers</th>
                <th className="py-3.5 px-4">Subscribers</th>
                <th className="py-3.5 px-4">Total Pool</th>
                <th className="py-3.5 px-4">Jackpot Rollover</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {draws.map((d) => (
                <tr key={d.id} className="hover:bg-slate-850/50">
                  <td className="py-3.5 px-4 font-bold text-white">{d.draw_month}</td>
                  <td className="py-3.5 px-4 capitalize">{d.draw_type.replace('_', ' ')}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">[{d.winning_numbers.join(', ')}]</td>
                  <td className="py-3.5 px-4">{d.total_subscribers_count}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{formatCurrency(d.total_pool_amount)}</td>
                  <td className="py-3.5 px-4 text-amber-300">{formatCurrency(d.jackpot_rollover_amount)}</td>
                  <td className="py-3.5 px-4"><Badge variant="success">{d.status.toUpperCase()}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

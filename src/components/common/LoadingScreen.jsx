import React from 'react'
import { Trophy, Loader2 } from 'lucide-react'

export const LoadingScreen = ({ message = 'Checking authorization...' }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-emerald-900 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-emerald-950/20 animate-bounce">
        <Trophy className="w-8 h-8" />
      </div>
      <div className="flex items-center gap-2 text-emerald-900 font-bold text-base mb-1">
        <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
        <span>Digital<span className="text-emerald-700">Heroes</span></span>
      </div>
      <p className="text-xs text-slate-500 font-medium">{message}</p>
    </div>
  )
}

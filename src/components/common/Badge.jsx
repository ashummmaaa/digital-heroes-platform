import React from 'react'

export const Badge = ({ children, variant = 'info', className = '' }) => {
  const variantStyles = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    info: 'bg-sky-100 text-sky-800 border-sky-300',
    warning: 'bg-amber-100 text-amber-800 border-amber-300',
    error: 'bg-rose-100 text-rose-800 border-rose-300',
    gold: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    neutral: 'bg-slate-100 text-slate-700 border-slate-300',
    forest: 'bg-emerald-950/10 text-emerald-900 border-emerald-900/20'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant] || variantStyles.info} ${className}`}>
      {children}
    </span>
  )
}

import React from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { useData } from '../../context/DataContext'

export const Toast = () => {
  const { notification } = useData()

  if (!notification) return null

  const isSuccess = notification.type === 'success'

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in">
      <div className={`flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all ${
        isSuccess
          ? 'bg-emerald-900/95 text-white border-emerald-700'
          : 'bg-rose-900/95 text-white border-rose-700'
      }`}>
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {notification.message}
        </div>
      </div>
    </div>
  )
}

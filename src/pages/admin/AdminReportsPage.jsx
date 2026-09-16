import React from 'react'
import { FileText, Download, Activity } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatDate } from '../../lib/utils'

export const AdminReportsPage = () => {
  const { auditLogs } = useData()

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Governance & Auditing</span>
          <h1 className="text-3xl font-black text-white tracking-tight">System Audit Reports & Logs</h1>
        </div>

        <button
          onClick={() => alert('CSV Export generated!')}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700 transition"
        >
          <Download className="w-4 h-4" />
          Export Audit Trail (CSV)
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl p-6 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          System Execution Log
        </h3>

        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-amber-400 block">{log.action}</span>
                <span className="text-slate-300">Entity: {log.entity_type} ({log.entity_id})</span>
              </div>
              <span className="text-slate-500">{formatDate(log.created_at)}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

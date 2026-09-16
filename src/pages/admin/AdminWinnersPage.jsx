import React, { useState } from 'react'
import { Award, CheckCircle2, XCircle, Eye, DollarSign, Image as ImageIcon } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Badge } from '../../components/common/Badge'

export const AdminWinnersPage = () => {
  const { winnerSubmissions, reviewWinnerProof, markPayoutCompleted } = useData()
  
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleApprove = (id) => {
    reviewWinnerProof(id, true)
    setSelectedSubmission(null)
  }

  const handleReject = (id) => {
    if (!rejectionReason) return
    reviewWinnerProof(id, false, rejectionReason)
    setSelectedSubmission(null)
    setRejectionReason('')
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Winner Audits</span>
        <h1 className="text-3xl font-black text-white tracking-tight">Scorecard Verification & Payout Queue</h1>
      </div>

      {/* WINNER SUBMISSIONS TABLE */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Winner Name</th>
                <th className="py-4 px-6">Draw Tier</th>
                <th className="py-4 px-6">Prize Amount</th>
                <th className="py-4 px-6">Proof Image</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {winnerSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-4 px-6 font-bold text-white">
                    {sub.user_name || 'Alex Morgan'}
                    <span className="block text-[11px] font-normal text-slate-400">{sub.user_email || 'alex.morgan@example.com'}</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-amber-400">{sub.tier}-Number Match</td>
                  <td className="py-4 px-6 font-black text-emerald-400 text-sm">{formatCurrency(sub.prize_amount)}</td>
                  <td className="py-4 px-6">
                    {sub.proof_url ? (
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline font-bold"
                      >
                        <ImageIcon className="w-4 h-4" /> View Proof
                      </button>
                    ) : (
                      <span className="text-slate-500 italic">No proof uploaded</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={
                      sub.status === 'paid' ? 'success' :
                      sub.status === 'approved' ? 'info' :
                      sub.status === 'rejected' ? 'error' : 'warning'
                    }>
                      {sub.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {sub.status === 'pending_verification' && (
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        Review Proof
                      </button>
                    )}
                    {sub.status === 'approved' && (
                      <button
                        onClick={() => markPayoutCompleted(sub.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REVIEW PROOF MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Review Winner Scorecard Proof</h3>
              <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span>Winner: <strong>{selectedSubmission.user_name}</strong></span>
                <span>Prize: <strong className="text-emerald-400">{formatCurrency(selectedSubmission.prize_amount)}</strong></span>
              </div>

              {selectedSubmission.proof_url ? (
                <img
                  src={selectedSubmission.proof_url}
                  alt="Scorecard Proof"
                  className="w-full max-h-72 object-cover rounded-2xl border border-slate-800"
                />
              ) : (
                <div className="p-8 bg-slate-950 text-slate-500 text-center rounded-2xl border border-slate-800 text-xs">
                  No image proof uploaded yet.
                </div>
              )}

              {/* REJECTION REASON INPUT */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Rejection Reason (If rejecting)</label>
                <input
                  type="text"
                  placeholder="e.g. Scorecard image unreadable or date mismatch"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleApprove(selectedSubmission.id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Approve Winner Proof
              </button>
              <button
                onClick={() => handleReject(selectedSubmission.id)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Reject Proof
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

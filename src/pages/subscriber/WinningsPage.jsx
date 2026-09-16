import React, { useState } from 'react'
import { Award, Upload, CheckCircle2, Clock, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Badge } from '../../components/common/Badge'

export const WinningsPage = () => {
  const { profile } = useAuth()
  const { winnerSubmissions, uploadWinnerProof } = useData()

  const [selectedSubId, setSelectedSubId] = useState(null)
  const [proofUrlInput, setProofUrlInput] = useState('')

  const mySubmissions = winnerSubmissions.filter(s => s.user_id === (profile?.id || 'demo-subscriber-id'))
  const totalWinnings = mySubmissions.reduce((acc, curr) => acc + curr.prize_amount, 0)

  const handleUploadSubmit = (e) => {
    e.preventDefault()
    if (!selectedSubId || !proofUrlInput) return
    uploadWinnerProof(selectedSubId, proofUrlInput)
    setSelectedSubId(null)
    setProofUrlInput('')
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Winnings & Verification</h1>
        <p className="text-xs text-slate-500">
          Track your monthly draw prize rewards, upload scorecard verification proof, and view payout status.
        </p>
      </div>

      {/* WINNINGS SUMMARY BANNER */}
      <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-900 shadow-xl flex items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">Total Earned Rewards</span>
          <div className="text-4xl font-black text-white">{formatCurrency(totalWinnings)}</div>
          <span className="text-xs text-emerald-200 mt-1 block">Verified through Supabase Storage proof audit</span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-emerald-900 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
          <Award className="w-8 h-8" />
        </div>
      </div>

      {/* WINNING SUBMISSIONS LIST */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-800" />
          Your Prize Rewards ({mySubmissions.length})
        </h2>

        {mySubmissions.length > 0 ? (
          <div className="space-y-6">
            {mySubmissions.map((sub) => (
              <div key={sub.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                      {sub.tier}-Number Match Prize
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">{formatCurrency(sub.prize_amount)}</h3>
                  </div>

                  <div className="text-right space-y-1">
                    <Badge variant={
                      sub.status === 'paid' ? 'success' :
                      sub.status === 'approved' ? 'info' :
                      sub.status === 'rejected' ? 'error' : 'warning'
                    }>
                      {sub.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-[11px] text-slate-500 block">Submitted: {formatDate(sub.created_at)}</span>
                  </div>
                </div>

                {/* PROOF SECTION */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    {sub.proof_url ? (
                      <img src={sub.proof_url} alt="Proof" className="w-16 h-12 rounded-lg object-cover border border-slate-300" />
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Scorecard Proof Status</span>
                      <span className="text-[11px] text-slate-500">
                        {sub.proof_url ? 'Proof uploaded & queued for admin review' : 'Action Required: Upload Official Scorecard Image'}
                      </span>
                    </div>
                  </div>

                  {!sub.proof_url && (
                    <button
                      onClick={() => { setSelectedSubId(sub.id); setProofUrlInput('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80') }}
                      className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Scorecard Proof
                    </button>
                  )}
                </div>

                {/* REJECTION REASON IF ANY */}
                {sub.status === 'rejected' && sub.rejection_reason && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs space-y-1">
                    <span className="font-bold block">Rejection Note from Admin:</span>
                    <p>{sub.rejection_reason}</p>
                  </div>
                )}

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 text-xs space-y-2">
            <Award className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No active winnings registered yet. Submit your golf scores to qualify for the next monthly draw!</p>
          </div>
        )}
      </div>

      {/* UPLOAD PROOF MODAL */}
      {selectedSubId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Upload Scorecard Verification</h3>
              <button onClick={() => setSelectedSubId(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Proof File URL (Supabase Storage / Image URL)
                </label>
                <input
                  type="url"
                  required
                  value={proofUrlInput}
                  onChange={(e) => setProofUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                Uploaded images are securely stored in Supabase Storage bucket <code>winner-proofs</code> and evaluated by administrators.
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Submit Scorecard Proof
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

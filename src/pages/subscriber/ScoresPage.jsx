import React, { useState } from 'react'
import { Target, Plus, Trash2, Edit3, Calendar, AlertCircle, Info, CheckCircle2 } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatDate, validateStablefordScore } from '../../lib/utils'

export const ScoresPage = () => {
  const { scores, addScore, deleteScore, editScore } = useData()

  const [scoreInput, setScoreInput] = useState('')
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0])
  const [editingScoreId, setEditingScoreId] = useState(null)
  const [editVal, setEditVal] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    const valErr = validateStablefordScore(scoreInput)
    if (valErr) {
      setErrorMsg(valErr)
      return
    }

    const res = await addScore(scoreInput, dateInput)
    if (res.success) {
      setScoreInput('')
    } else {
      setErrorMsg(res.error)
    }
  }

  const handleSaveEdit = (scoreId) => {
    const valErr = validateStablefordScore(editVal)
    if (valErr) {
      alert(valErr)
      return
    }
    editScore(scoreId, editVal)
    setEditingScoreId(null)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Golf Score Tracker</h1>
        <p className="text-xs text-slate-500">
          Enter your Stableford scores (1–45 points). Your latest 5 scores are automatically used as your monthly draw numbers.
        </p>
      </div>

      {/* ROLLING SCORES EXPLANATION BOX */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Rolling 5-Score Rule:</span>
          <p className="leading-relaxed">
            Only your 5 most recent scores are retained in the database. When you submit a 6th score, our system automatically removes your oldest score. Exactly one score is allowed per calendar date.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ADD SCORE FORM */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-800" />
            Add New Golf Score
          </h2>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Stableford Score (1 - 45 Points)
              </label>
              <input
                type="number"
                min="1"
                max="45"
                required
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                placeholder="e.g. 38"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Score Date
              </label>
              <input
                type="date"
                required
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Save Stableford Score
            </button>
          </form>
        </div>

        {/* SCORES LIST */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base">Your Active 5 Scores ({scores.length}/5)</h2>
            <span className="text-xs text-slate-500 font-medium">Newest first</span>
          </div>

          <div className="space-y-3">
            {scores.map((score, idx) => (
              <div key={score.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                
                {editingScoreId === score.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      min="1"
                      max="45"
                      value={editVal}
                      onChange={(e) => setEditVal(e.target.value)}
                      className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                    />
                    <button
                      onClick={() => handleSaveEdit(score.id)}
                      className="bg-emerald-900 text-white text-xs px-3 py-1.5 rounded-lg font-bold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingScoreId(null)}
                      className="text-slate-500 text-xs hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-900 text-amber-400 font-black flex items-center justify-center text-sm shadow-inner">
                        {score.score}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">Points: {score.score}</span>
                        <span className="text-slate-500 text-[11px]">{formatDate(score.score_date)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingScoreId(score.id); setEditVal(score.score) }}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
                        title="Edit Score"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteScore(score.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Score"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}

              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

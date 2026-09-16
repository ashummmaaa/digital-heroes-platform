import React, { useState } from 'react'
import { Heart, CheckCircle2, Sliders, RefreshCw } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../lib/utils'

export const CharitySelectionPage = () => {
  const { charities, selectedCharityId, contributionPercentage, updateCharitySelection } = useData()
  const [modalOpen, setModalOpen] = useState(false)

  const selectedCharity = charities.find(c => c.id === selectedCharityId) || charities[0]
  const monthlyContribution = 19.99 * (contributionPercentage / 100)

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Charity Allocation & Impact</h1>
        <p className="text-xs text-slate-500">
          Select which charity receives your subscription allocation and adjust your contribution percentage (minimum 10%).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CURRENTLY SELECTED CHARITY CARD */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Heart className="w-4 h-4 fill-emerald-800" />
              <span>Active Selected Charity</span>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Switch Charity
            </button>
          </div>

          <div className="space-y-4">
            <img src={selectedCharity.image_url} alt={selectedCharity.name} className="w-full h-48 rounded-2xl object-cover border border-slate-200" />
            <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-0.5 rounded-full">
              {selectedCharity.category}
            </span>
            <h2 className="text-2xl font-black text-slate-900">{selectedCharity.name}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedCharity.description}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Raised across Platform:</span>
            <span className="font-bold text-emerald-800 text-sm">{formatCurrency(selectedCharity.total_raised)}</span>
          </div>
        </div>

        {/* CONTRIBUTION PERCENTAGE SLIDER */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Sliders className="w-4 h-4 text-emerald-800" />
              <h3 className="font-bold text-slate-900 text-base">Adjust Contribution Share</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider">Charity Percentage</span>
                <span className="text-2xl font-black text-emerald-800">{contributionPercentage}%</span>
              </div>

              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={contributionPercentage}
                onChange={(e) => updateCharitySelection(selectedCharityId, e.target.value)}
                className="w-full accent-emerald-800 cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>Min (10%)</span>
                <span>50%</span>
                <span>Max (100%)</span>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Subscription:</span>
                <span className="font-bold text-slate-900">$19.99 / mo</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Charity Percentage:</span>
                <span className="font-bold text-slate-900">{contributionPercentage}%</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-emerald-900">
                <span>Direct Monthly Gift:</span>
                <span className="text-base text-emerald-800">{formatCurrency(monthlyContribution)}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed">
            Your monthly contribution is securely routed to {selectedCharity.name}. You may adjust or change charities at any time.
          </div>
        </div>

      </div>

      {/* CHARITY PICKER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">Select Partner Charity</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
            </div>

            <div className="space-y-4">
              {charities.map((charity) => (
                <div
                  key={charity.id}
                  onClick={() => { updateCharitySelection(charity.id, contributionPercentage); setModalOpen(false) }}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-4 ${
                    charity.id === selectedCharityId
                      ? 'bg-emerald-50 border-emerald-800 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img src={charity.image_url} alt={charity.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{charity.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{charity.description}</p>
                    </div>
                  </div>

                  {charity.id === selectedCharityId && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

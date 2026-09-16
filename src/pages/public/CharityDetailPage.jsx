import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Calendar, ArrowLeft, CheckCircle2, Award } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatCurrency, formatDate } from '../../lib/utils'

export const CharityDetailPage = () => {
  const { id } = useParams()
  const { charities, charityEvents } = useData()

  const charity = charities.find(c => c.id === id) || charities[0]
  const events = charityEvents.filter(e => e.charity_id === charity.id)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <Link to="/charities" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to Charity Directory
      </Link>

      {/* HEADER CARD */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
        <img src={charity.image_url} alt={charity.name} className="w-full h-64 sm:h-80 object-cover" />
        
        <div className="p-8 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                {charity.category}
              </span>
              <h1 className="text-3xl font-black text-slate-900">{charity.name}</h1>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right">
              <span className="block text-xs text-slate-500 font-medium">Total Platform Funding Raised</span>
              <span className="text-2xl font-black text-emerald-800">{formatCurrency(charity.total_raised)}</span>
            </div>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed">{charity.description}</p>
        </div>
      </div>

      {/* UPCOMING EVENTS SECTION */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-800" />
          Upcoming Charity Events & Initiatives
        </h2>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => (
              <div key={evt.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  {formatDate(evt.event_date)}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{evt.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No public events currently scheduled. Check back soon!</p>
        )}
      </div>

    </div>
  )
}

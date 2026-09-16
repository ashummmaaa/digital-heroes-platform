import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Heart, ExternalLink, Calendar } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../lib/utils'

export const CharitiesPage = () => {
  const { charities, charityEvents } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Youth & Education', 'Environment', 'Veterans & Health', 'Global Relief']

  const filteredCharities = charities.filter(charity => {
    const matchesSearch = charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          charity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || charity.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* PAGE HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Verified Impact Partners
        </span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Partner Charities Directory
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Every Digital Heroes subscription allocates at least 10% directly to your selected charity. Explore our verified non-profit partners and their active impact initiatives.
        </p>
      </div>

      {/* SEARCH & CATEGORY FILTER */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* SEARCH INPUT */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search charities or causes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent"
          />
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* CHARITIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCharities.map((charity) => (
          <div key={charity.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="relative">
                <img
                  src={charity.image_url}
                  alt={charity.name}
                  className="w-full h-48 object-cover"
                />
                {charity.is_featured && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-6 space-y-3">
                <span className="inline-block bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {charity.category}
                </span>
                <h3 className="font-bold text-slate-900 text-lg leading-snug">{charity.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{charity.description}</p>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-4">
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Platform Funds Raised:</span>
                <span className="font-bold text-emerald-800">{formatCurrency(charity.total_raised)}</span>
              </div>

              <Link
                to={`/charities/${charity.id}`}
                className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition"
              >
                View Details & Events →
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

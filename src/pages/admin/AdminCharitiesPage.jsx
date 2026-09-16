import React, { useState } from 'react'
import { Heart, Plus, Edit3, Eye, Power, Star } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatCurrency } from '../../lib/utils'
import { Badge } from '../../components/common/Badge'

export const AdminCharitiesPage = () => {
  const { charities, addCharity, editCharity, toggleCharityActive } = useData()
  const [modalOpen, setModalOpen] = useState(false)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('Youth & Education')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)

  const handleCreate = (e) => {
    e.preventDefault()
    addCharity({
      name,
      category,
      description,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80',
      is_featured: isFeatured
    })
    setModalOpen(false)
    setName('')
    setDescription('')
    setImageUrl('')
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Impact Directory</span>
          <h1 className="text-3xl font-black text-white tracking-tight">Partner Charities & Non-Profits</h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add New Charity Partner
        </button>
      </div>

      {/* CHARITIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {charities.map((c) => (
          <div key={c.id} className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-slate-800 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {c.category}
                </span>
                <button
                  onClick={() => toggleCharityActive(c.id)}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    c.is_active ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-rose-950 text-rose-400 border-rose-800'
                  }`}
                  title="Toggle Active State"
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              <img src={c.image_url} alt={c.name} className="w-full h-36 rounded-2xl object-cover" />

              <h3 className="font-bold text-white text-base flex items-center justify-between">
                {c.name}
                {c.is_featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3">{c.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Raised:</span>
              <span className="font-bold text-emerald-400">{formatCurrency(c.total_raised)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD CHARITY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add New Partner Charity</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Charity Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Oceans Protection Trust"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Youth & Education">Youth & Education</option>
                  <option value="Environment">Environment</option>
                  <option value="Veterans & Health">Veterans & Health</option>
                  <option value="Global Relief">Global Relief</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the non-profit's core mission..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-amber-500"
                />
                <label htmlFor="featuredCheck" className="text-slate-300">Mark as Featured Charity</label>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs transition mt-2"
              >
                Save Partner Charity
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

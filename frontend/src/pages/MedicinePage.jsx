import { useState } from 'react'
import { medicineService } from '../services/services'
import LoadingSpinner from '../components/LoadingSpinner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import toast from 'react-hot-toast'
import { FiSearch } from 'react-icons/fi'

const COMMON_MEDICINES = [
  'Paracetamol', 'Ibuprofen', 'Aspirin', 'Amoxicillin',
  'Metformin', 'Omeprazole', 'Cetirizine', 'Azithromycin'
]

export default function MedicinePage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastSearched, setLastSearched] = useState('')

  const search = async (name) => {
    const searchName = name || query.trim()
    if (!searchName) return
    setLoading(true)
    setResult('')
    setLastSearched(searchName)
    try {
      const res = await medicineService.getMedicineInfo(searchName)
      setResult(res.data.data)
    } catch {
      toast.error('Failed to fetch medicine info.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="page-title">Medicine Information</h1>
        <p className="text-white/40 text-sm mt-1">Get detailed information about any medicine</p>
      </div>

      {/* Search */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="text"
              placeholder="Enter medicine name (e.g., Paracetamol, Ibuprofen...)"
              className="input-field pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
            />
          </div>
          <button onClick={() => search()} disabled={loading || !query.trim()} className="btn-primary">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Quick picks */}
        <div className="mt-4">
          <p className="text-white/30 text-xs mb-2 uppercase font-semibold">Common Medicines</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_MEDICINES.map(med => (
              <button
                key={med}
                onClick={() => { setQuery(med); search(med) }}
                className="px-3 py-1 rounded-full text-xs glass-card hover:bg-white/10 border border-white/10 hover:border-blue-500/30 text-white/60 hover:text-white transition-all"
              >
                {med}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner text={`Fetching information for ${lastSearched}...`} />}

      {result && (
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/20">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl">
              💊
            </div>
            <div>
              <h2 className="section-title">{lastSearched}</h2>
              <p className="text-white/30 text-xs">AI-generated information</p>
            </div>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-white/80 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
          </div>
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-yellow-300/70 text-xs">
              ⚠️ Always follow your doctor's prescription and consult a pharmacist before taking any medication.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

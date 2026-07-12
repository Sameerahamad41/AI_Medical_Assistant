import { useState } from 'react'
import { symptomService } from '../services/services'
import LoadingSpinner from '../components/LoadingSpinner'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import { FiX, FiPlus, FiSearch } from 'react-icons/fi'

const COMMON_SYMPTOMS = [
  'Fever', 'Headache', 'Cough', 'Sore Throat', 'Fatigue', 'Body Pain',
  'Nausea', 'Vomiting', 'Diarrhea', 'Chest Pain', 'Shortness of Breath',
  'Dizziness', 'Runny Nose', 'Loss of Appetite', 'Rash', 'Joint Pain',
  'Back Pain', 'Stomach Pain', 'Chills', 'Night Sweats'
]

export default function SymptomCheckerPage() {
  const [selected, setSelected] = useState([])
  const [custom, setCustom] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleSymptom = (symptom) => {
    setSelected(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const addCustom = () => {
    const trimmed = custom.trim()
    if (trimmed && !selected.includes(trimmed)) {
      setSelected(prev => [...prev, trimmed])
      setCustom('')
    }
  }

  const checkSymptoms = async () => {
    if (selected.length === 0) {
      toast.error('Please select at least one symptom')
      return
    }
    setLoading(true)
    setResult('')
    try {
      const res = await symptomService.checkSymptoms(selected, additionalInfo)
      setResult(res.data.data)
    } catch {
      toast.error('Failed to analyze symptoms. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="page-title">Symptom Checker</h1>
        <p className="text-white/40 text-sm mt-1">Select your symptoms for AI-powered analysis</p>
      </div>

      {/* Common Symptoms Grid */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="section-title mb-4">Select Symptoms</h2>
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map(symptom => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                selected.includes(symptom)
                  ? 'bg-blue-500/30 border-blue-500/60 text-blue-300'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
              }`}
            >
              {selected.includes(symptom) ? '✓ ' : '+ '}{symptom}
            </button>
          ))}
        </div>

        {/* Add custom symptom */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Add a custom symptom..."
            className="input-field flex-1"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
          />
          <button onClick={addCustom} className="btn-secondary flex items-center gap-2 text-sm">
            <FiPlus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Selected Symptoms */}
      {selected.length > 0 && (
        <div className="glass-card p-4 rounded-2xl">
          <p className="text-white/50 text-xs uppercase font-semibold mb-3">Selected ({selected.length})</p>
          <div className="flex flex-wrap gap-2">
            {selected.map(s => (
              <span key={s} className="tag-blue flex items-center gap-1">
                {s}
                <button onClick={() => toggleSymptom(s)} className="ml-1 hover:text-red-300 transition-colors">
                  <FiX size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="glass-card p-6 rounded-2xl">
        <label className="block text-white/60 text-sm mb-2">Additional Information (optional)</label>
        <textarea
          rows={3}
          placeholder="E.g., symptoms started 2 days ago, I'm 25 years old, I'm pregnant..."
          className="input-field resize-none"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
      </div>

      <button
        onClick={checkSymptoms}
        disabled={loading || selected.length === 0}
        className="btn-primary flex items-center gap-2"
      >
        <FiSearch size={16} />
        {loading ? 'Analyzing...' : `Analyze ${selected.length} Symptom${selected.length !== 1 ? 's' : ''}`}
      </button>

      {/* Results */}
      {loading && <LoadingSpinner text="Analyzing your symptoms with AI..." />}

      {result && (
        <div className="glass-card p-6 rounded-2xl border border-blue-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-lg">🤖</div>
            <h2 className="section-title">AI Analysis</h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-white/80 leading-relaxed">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-yellow-300/70 text-xs">
              ⚠️ This is not a medical diagnosis. Please consult a qualified healthcare professional.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { reportService } from '../services/services'
import { symptomService } from '../services/services'
import toast from 'react-hot-toast'
import { FiFileText, FiDownload, FiPlus, FiX } from 'react-icons/fi'

export default function ReportPage() {
  const [symptoms, setSymptoms] = useState([])
  const [symptomInput, setSymptomInput] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState('')
  const [doctorAdvice, setDoctorAdvice] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const addSymptom = () => {
    const s = symptomInput.trim()
    if (s && !symptoms.includes(s)) {
      setSymptoms(prev => [...prev, s])
      setSymptomInput('')
    }
  }

  const getAiAnalysis = async () => {
    if (symptoms.length === 0) {
      toast.error('Add at least one symptom first')
      return
    }
    setAnalyzing(true)
    try {
      const res = await symptomService.checkSymptoms(symptoms, '')
      setAiAnalysis(res.data.data)
    } catch {
      toast.error('Failed to get AI analysis')
    } finally {
      setAnalyzing(false)
    }
  }

  const downloadReport = async () => {
    if (symptoms.length === 0) {
      toast.error('Add at least one symptom')
      return
    }
    if (!aiAnalysis) {
      toast.error('Please get AI analysis first')
      return
    }
    setLoading(true)
    try {
      const res = await reportService.generateReport(symptoms, aiAnalysis, doctorAdvice)
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `medical_report_${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
      toast.success('Report downloaded! 📄')
    } catch {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="page-title">Medical Report</h1>
        <p className="text-white/40 text-sm mt-1">Generate a professional PDF medical report</p>
      </div>

      {/* Symptoms */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="section-title mb-4">📋 Symptoms</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Enter a symptom..."
            className="input-field flex-1"
            value={symptomInput}
            onChange={(e) => setSymptomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSymptom()}
          />
          <button onClick={addSymptom} className="btn-secondary flex items-center gap-2">
            <FiPlus size={16} /> Add
          </button>
        </div>
        {symptoms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {symptoms.map(s => (
              <span key={s} className="tag-blue flex items-center gap-1">
                {s}
                <button onClick={() => setSymptoms(prev => prev.filter(x => x !== s))}>
                  <FiX size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">🤖 AI Analysis</h2>
          <button
            onClick={getAiAnalysis}
            disabled={analyzing || symptoms.length === 0}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            {analyzing
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>
              : 'Get AI Analysis'
            }
          </button>
        </div>
        <textarea
          rows={6}
          placeholder="AI analysis will appear here, or you can type your own..."
          className="input-field resize-none"
          value={aiAnalysis}
          onChange={(e) => setAiAnalysis(e.target.value)}
        />
      </div>

      {/* Doctor Notes */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="section-title mb-4">👨‍⚕️ Doctor Notes / Additional Advice (optional)</h2>
        <textarea
          rows={3}
          placeholder="Any additional notes, prescriptions, or doctor advice..."
          className="input-field resize-none"
          value={doctorAdvice}
          onChange={(e) => setDoctorAdvice(e.target.value)}
        />
      </div>

      {/* Download */}
      <button
        onClick={downloadReport}
        disabled={loading || symptoms.length === 0 || !aiAnalysis}
        className="btn-primary flex items-center gap-2"
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
        ) : (
          <><FiDownload size={16} />Download PDF Report</>
        )}
      </button>

      <div className="p-4 glass-card rounded-xl border border-blue-500/20">
        <p className="text-white/40 text-xs">
          <FiFileText className="inline mr-1" size={12} />
          The PDF report includes: Patient info, reported symptoms, AI analysis, doctor notes, and a medical disclaimer.
        </p>
      </div>
    </div>
  )
}

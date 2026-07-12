import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { imageService } from '../services/services'
import LoadingSpinner from '../components/LoadingSpinner'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import { FiUpload, FiImage, FiX } from 'react-icons/fi'

const IMAGE_TYPES = [
  { value: 'SKIN', label: '🩺 Skin / Rash', desc: 'Rashes, lesions, discolorations' },
  { value: 'EYE', label: '👁️ Eye', desc: 'Eye redness, infections, discharge' },
  { value: 'TONGUE', label: '👅 Tongue', desc: 'Tongue color, texture changes' },
  { value: 'OTHER', label: '📷 Other', desc: 'Other visible symptoms' },
]

export default function ImageAnalysisPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [imageType, setImageType] = useState('SKIN')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    const f = accepted[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setResult('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  })

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setResult('')
    try {
      const res = await imageService.analyzeImage(file, imageType)
      setResult(res.data.data)
    } catch {
      toast.error('Failed to analyze image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setFile(null)
    setPreview('')
    setResult('')
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="page-title">Image Analysis</h1>
        <p className="text-white/40 text-sm mt-1">Upload a medical image for AI visual analysis (Groq Vision)</p>
      </div>

      {/* Image Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {IMAGE_TYPES.map(({ value, label, desc }) => (
          <button
            key={value}
            onClick={() => setImageType(value)}
            className={`glass-card p-4 text-left rounded-xl border transition-all duration-200 ${
              imageType === value
                ? 'border-blue-500/60 bg-blue-500/10'
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="text-xl mb-1">{label.split(' ')[0]}</div>
            <div className="text-white text-xs font-medium">{label.split(' ').slice(1).join(' ')}</div>
            <div className="text-white/30 text-xs mt-1">{desc}</div>
          </button>
        ))}
      </div>

      {/* Dropzone */}
      {!file ? (
        <div
          {...getRootProps()}
          className={`glass-card rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-white/20 hover:border-blue-500/50 hover:bg-white/5'
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload size={40} className="mx-auto mb-4 text-white/30" />
          <p className="text-white font-medium mb-1">
            {isDragActive ? 'Drop your image here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-white/30 text-sm">JPG, PNG, WEBP — Max 10MB</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-4 flex gap-4 items-start">
          <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-xl flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiImage size={16} className="text-blue-400" />
                <span className="text-white text-sm font-medium truncate max-w-xs">{file.name}</span>
              </div>
              <button onClick={clear} className="text-white/30 hover:text-red-400 transition-colors">
                <FiX size={18} />
              </button>
            </div>
            <p className="text-white/40 text-xs mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button onClick={analyze} disabled={loading} className="btn-primary text-sm">
              {loading ? 'Analyzing...' : '🔍 Analyze with AI'}
            </button>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner text="Analyzing your image with Groq Vision AI..." />}

      {result && (
        <div className="glass-card p-6 rounded-2xl border border-orange-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-xl">
              🔍
            </div>
            <h2 className="section-title">Analysis Result</h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-white/80 leading-relaxed">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-300/70 text-xs">
              ⚠️ This visual AI analysis is NOT a medical diagnosis. Please consult a dermatologist, ophthalmologist, or physician immediately for any health concerns.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

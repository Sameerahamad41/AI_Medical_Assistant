import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { imageService } from '../services/services'
import LoadingSpinner from '../components/LoadingSpinner'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import { FiUpload, FiFileText, FiX } from 'react-icons/fi'

export default function DocumentDecoderPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
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
      // Pass 'DOCUMENT' so the backend uses the OCR System Prompt
      const res = await imageService.analyzeImage(file, 'DOCUMENT')
      setResult(res.data.data)
    } catch {
      toast.error('Failed to analyze document. Please try again.')
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
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
              <FiFileText size={24} />
            </span>
            Document Decoder
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl leading-relaxed">
            Upload a photo of your medical lab results, prescriptions, or bills. The AI will extract the text, identify complex medical jargon, and explain exactly what your results mean in simple English.
          </p>
        </div>
      </div>

      {/* Dropzone */}
      {!file ? (
        <div
          {...getRootProps()}
          className={`glass-card rounded-3xl border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
              : 'border-white/20 hover:border-indigo-500/50 hover:bg-white/5'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-6 text-white/30">
            <FiUpload size={32} />
          </div>
          <p className="text-white text-xl font-medium mb-2">
            {isDragActive ? 'Drop your document here' : 'Drag & drop your medical document'}
          </p>
          <p className="text-white/40 text-sm">Or click to browse files (JPG, PNG, WEBP — Max 10MB)</p>
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-6 flex flex-col md:flex-row gap-8 items-start border border-indigo-500/20 bg-indigo-950/20">
          <div className="relative group shrink-0">
            <img src={preview} alt="Preview" className="w-64 object-contain rounded-2xl bg-black/40 border border-white/10" />
            <button 
              onClick={clear} 
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <FiX size={16} />
            </button>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-white font-medium text-lg flex items-center gap-2">
                <FiFileText className="text-indigo-400" /> {file.name}
              </h3>
              <p className="text-white/40 text-sm mt-1">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            
            <button 
              onClick={analyze} 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all flex justify-center items-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>Analyzing Document...</>
              ) : (
                <>🔍 Decode This Document</>
              )}
            </button>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner text="Extracting text and translating medical jargon with Groq Vision AI..." />}

      {result && (
        <div className="glass-card p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-900/10 to-transparent animate-fade-in">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-2xl shadow-lg">
              ✨
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Document Decoded</h2>
              <p className="text-white/50 text-sm">Here is what your document says in simple English.</p>
            </div>
          </div>
          
          <div className="prose prose-invert prose-lg max-w-none text-white/90 leading-relaxed marker:text-indigo-400">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <p className="text-yellow-200/80 text-sm leading-relaxed">
              <strong>Disclaimer:</strong> This AI translation is provided for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your doctor to interpret your lab results accurately.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

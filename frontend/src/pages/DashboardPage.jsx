import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { FiMessageSquare, FiActivity, FiBook, FiCamera, FiFileText, FiArrowRight, FiAlertTriangle } from 'react-icons/fi'

const features = [
  { icon: FiMessageSquare, label: 'AI Chat', desc: 'Ask any health question', to: '/chat', color: 'from-blue-500 to-cyan-500', bg: 'blue' },
  { icon: FiActivity, label: 'Symptom Checker', desc: 'Check your symptoms', to: '/symptoms', color: 'from-purple-500 to-pink-500', bg: 'purple' },
  { icon: FiBook, label: 'Medicine Info', desc: 'Drug details & dosage', to: '/medicine', color: 'from-emerald-500 to-teal-500', bg: 'emerald' },
  { icon: FiFileText, label: 'Document Decoder', desc: 'Read & explain lab results', to: '/document-decoder', color: 'from-indigo-500 to-purple-500', bg: 'indigo' },
  { icon: FiCamera, label: 'Image Analysis', desc: 'AI skin & eye analysis', to: '/image-analysis', color: 'from-orange-500 to-yellow-500', bg: 'orange' },
  { icon: FiFileText, label: 'Medical Report', desc: 'Download PDF report', to: '/report', color: 'from-rose-500 to-red-500', bg: 'rose' },
]

const tips = [
  '💧 Drink at least 8 glasses of water daily',
  '🧘 Practice 10 minutes of meditation for mental health',
  '🏃 30 minutes of exercise 5 days a week improves longevity',
  '🥗 Eat a balanced diet rich in fruits and vegetables',
  '😴 Get 7–9 hours of quality sleep each night',
]

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const randomTip = tips[Math.floor(Math.random() * tips.length)]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden glass-card p-8 rounded-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-white/50 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-4xl font-bold text-gradient mb-2">{user?.name}</h1>
            <p className="text-white/40 text-sm max-w-md">
              Your AI-powered medical assistant is ready to help. What would you like to explore today?
            </p>
          </div>
          <button 
            onClick={() => navigate('/sos')}
            className="flex-shrink-0 bg-red-600 hover:bg-red-500 text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] border border-red-400/30 w-full md:w-auto"
          >
            <span className="animate-pulse flex items-center justify-center bg-white/20 w-12 h-12 rounded-full mb-1">
              <FiAlertTriangle size={24} className="text-white" />
            </span>
            <span className="font-black tracking-widest text-lg">SOS EMERGENCY</span>
          </button>
        </div>
      </div>

      {/* Health Tip */}
      <div className="glass-card p-4 border-l-4 border-cyan-400 rounded-xl flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-0.5">Daily Health Tip</p>
          <p className="text-white/80 text-sm">{randomTip}</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="section-title mb-4">What would you like to do?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, label, desc, to, color }) => (
            <Link
              key={to}
              to={to}
              className="glass-card-hover p-6 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1">{label}</h3>
              <p className="text-white/40 text-sm mb-4">{desc}</p>
              <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all duration-200">
                <span>Get started</span>
                <FiArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="glass-card p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-xl">
        <p className="text-yellow-300/70 text-xs">
          ⚠️ <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
        </p>
      </div>
    </div>
  )
}

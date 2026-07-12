import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/services'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', age: '', bloodGroup: ''
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, age: form.age ? parseInt(form.age) : null }
      const res = await authService.register(payload)
      login(res.data.data)
      toast.success('Account created! Welcome 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-blue-500/30">
            🏥
          </div>
          <h1 className="text-3xl font-bold text-gradient">Create Account</h1>
          <p className="text-white/50 mt-1 text-sm">Join AI Medical Assistant today</p>
        </div>

        <div className="glass-card p-8 neon-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-white/60 text-sm mb-2">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input type="text" placeholder="John Doe" className="input-field pl-10"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-white/60 text-sm mb-2">Email Address *</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input type="email" placeholder="you@example.com" className="input-field pl-10"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-white/60 text-sm mb-2">Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input type="password" placeholder="Min. 6 characters" className="input-field pl-10"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input type="tel" placeholder="+91 98765..." className="input-field pl-10"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Age</label>
                <input type="number" placeholder="25" min="1" max="120" className="input-field"
                  value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              </div>

              <div className="col-span-2">
                <label className="block text-white/60 text-sm mb-2">Blood Group</label>
                <select className="input-field" value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
                  <option value="" className="bg-slate-800 text-white">Select blood group</option>
                  {bloodGroups.map(bg => <option key={bg} value={bg} className="bg-slate-800 text-white">{bg}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

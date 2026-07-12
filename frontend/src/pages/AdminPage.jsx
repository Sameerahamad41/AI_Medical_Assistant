import { useState, useEffect } from 'react'
import { adminService } from '../services/services'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { FiUsers, FiMessageSquare, FiCamera, FiTrash2, FiBarChart2 } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('users')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, analyticsRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getAnalytics()
      ])
      setUsers(usersRes.data.data)
      setAnalytics(analyticsRes.data.data)
    } catch {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This action cannot be undone.`)) return
    try {
      await adminService.deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success(`User "${name}" deleted`)
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const chartData = analytics ? [
    { name: 'Users', value: analytics.totalUsers, fill: '#3b82f6' },
    { name: 'Chats', value: analytics.totalChats, fill: '#00d4ff' },
    { name: 'Images', value: analytics.totalImageReports, fill: '#00f5a0' },
  ] : []

  if (loading) return <div className="p-8"><LoadingSpinner text="Loading admin data..." /></div>

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Manage users and view platform analytics</p>
      </div>

      {/* Stats */}
      {analytics && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: FiUsers, label: 'Total Users', value: analytics.totalUsers, color: 'from-blue-500 to-cyan-500' },
            { icon: FiMessageSquare, label: 'Total Chats', value: analytics.totalChats, color: 'from-purple-500 to-pink-500' },
            { icon: FiCamera, label: 'Image Analyses', value: analytics.totalImageReports, color: 'from-emerald-500 to-teal-500' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="stat-card">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-white/40 text-xs">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <FiBarChart2 size={18} className="text-blue-400" />
          <h2 className="section-title">Platform Overview</h2>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
              labelStyle={{ color: 'white' }}
              itemStyle={{ color: '#00d4ff' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center gap-2">
          <FiUsers size={18} className="text-blue-400" />
          <h2 className="section-title">All Users ({users.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-white/30 text-xs uppercase font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 text-white/40 text-sm">#{user.id}</td>
                  <td className="px-5 py-4 text-white font-medium text-sm">{user.name}</td>
                  <td className="px-5 py-4 text-white/60 text-sm">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={user.role === 'ADMIN' ? 'tag-yellow' : 'tag-blue'}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/40 text-sm">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => deleteUser(user.id, user.name)}
                      className="btn-danger flex items-center gap-1 text-xs"
                    >
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

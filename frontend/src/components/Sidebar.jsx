import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiMessageSquare, FiActivity, FiBook, FiCamera,
  FiFileText, FiUsers, FiGrid, FiLogOut, FiUser, FiCalendar, FiAlertCircle, FiX
} from 'react-icons/fi'

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/chat', icon: FiMessageSquare, label: 'AI Chat' },
  { to: '/symptoms', icon: FiActivity, label: 'Symptom Checker' },
  { to: '/medicine', icon: FiBook, label: 'Medicine Info' },
  { to: '/image-analysis', icon: FiCamera, label: 'Image Analysis' },
  { to: '/document-decoder', icon: FiFileText, label: 'Document OCR' },
  { to: '/appointments', icon: FiCalendar, label: 'Appointments' },
  { to: '/report', icon: FiFileText, label: 'Medical Report' },
]

export default function Sidebar({ onClose }) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 h-screen glass-card rounded-none border-r border-white/10 flex flex-col overflow-y-auto overflow-x-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl">
            🏥
          </div>
          <div>
            <h1 className="font-bold text-white text-sm leading-tight">AI Medical</h1>
            <p className="text-white/40 text-xs">Assistant</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden text-white/50 hover:text-white p-2"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FiUser size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-white/40 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}

        {isAdmin() && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-white/30 text-xs uppercase font-semibold px-4">Admin</p>
            </div>
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <FiUsers size={18} />
              <span className="text-sm">Admin Panel</span>
            </NavLink>
          </>
        )}
        
        {/* SOS Emergency Link */}
        <div className="pt-4 pb-2">
          <p className="text-red-400/50 text-xs uppercase font-semibold px-4">Emergency</p>
        </div>
        <NavLink
          to="/sos"
          onClick={onClose}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'bg-red-500/20 text-red-400 border-r-2 border-red-500' : 'text-red-400/80 hover:bg-red-500/10 hover:text-red-400'}`
          }
        >
          <FiAlertCircle size={18} />
          <span className="text-sm font-bold">SOS Protocol</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <FiLogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  )
}

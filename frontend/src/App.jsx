import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import { useAuth } from './context/AuthContext'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ChatPage from './pages/ChatPage'
import SymptomCheckerPage from './pages/SymptomCheckerPage'
import MedicinePage from './pages/MedicinePage'
import ImageAnalysisPage from './pages/ImageAnalysisPage'
import ReportPage from './pages/ReportPage'
import AppointmentPage from './pages/AppointmentPage'
import SosPage from './pages/SosPage'
import DocumentDecoderPage from './pages/DocumentDecoderPage'
import AdminPage from './pages/AdminPage'

function AppLayout() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return null

  return (
    <div className="flex h-screen bg-[#0f172a] relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 glass-card z-30 relative shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-sm">🏥</div>
            <span className="font-bold text-white">AI Medical</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 rounded-lg hover:bg-white/10"
          >
            <FiMenu size={24} />
          </button>
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/symptoms" element={<SymptomCheckerPage />} />
          <Route path="/medicine" element={<MedicinePage />} />
          <Route path="/image-analysis" element={<ImageAnalysisPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/document-decoder" element={<DocumentDecoderPage />} />
          <Route path="/sos" element={<SosPage />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0d1b2a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
        },
        success: {
          iconTheme: { primary: '#00f5a0', secondary: '#0d1b2a' },
        },
        error: {
          iconTheme: { primary: '#ff4757', secondary: '#0d1b2a' },
        },
      }}
    />
  </React.StrictMode>,
)

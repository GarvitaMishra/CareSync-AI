import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 🔥 NEW
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

    {/* 🔥 GLOBAL TOAST */}
    <Toaster position="top-right" reverseOrder={false} />
    
  </StrictMode>,
)
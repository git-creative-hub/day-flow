import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function ProtectedRoute({ children }) {
  const { session } = useAuth()
  if (session === undefined) return (
    <div className="min-h-screen flex items-center justify-center bg-df-bg">
      <div className="w-6 h-6 border-2 border-df-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return session ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { session } = useAuth()
  if (session === undefined) return null
  return session ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

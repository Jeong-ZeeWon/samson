import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Archive from './pages/Archive'
import SermonForm from './pages/SermonForm'
import SermonDetail from './pages/SermonDetail'
import Settings from './pages/Settings'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/sermons"
        element={
          <ProtectedRoute>
            <Layout>
              <Archive />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/sermons/new"
        element={
          <ProtectedRoute>
            <Layout>
              <SermonForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/sermons/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <SermonDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/sermons/:id/edit"
        element={
          <ProtectedRoute>
            <Layout>
              <SermonForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

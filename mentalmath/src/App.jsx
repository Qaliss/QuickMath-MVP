import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import Login from './auth/Login.jsx'
import SignUp from './auth/SignUp.jsx'
import Play from './pages/play.jsx'
import Learn from './pages/Learn.jsx'
import Stats from './pages/stats.jsx'
import NavBar from './components/NavBar.jsx'
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext.jsx'
import { XPProvider } from './contexts/XPContext.jsx'

function App() {
  return (
    <AuthProvider>
      <XPProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Play />
            </ProtectedRoute>
          } />
          <Route path="/learn" element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      </XPProvider>
    </AuthProvider>
  )
}

export default App
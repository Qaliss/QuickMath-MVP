import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

import './App.css'
import Home from './pages/Home.jsx'
import Login from './auth/Login.jsx'
import SignUp from './auth/SignUp.jsx'
import Play from './pages/play.jsx'
import Learn from './pages/Learn.jsx'

function App() {

  const [user, setUser] = useState(null)
  
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Home /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />
        <Route
          path="/signup"
          element={<SignUp setUser={setUser} />}
        />
        <Route
          path="/play"
          element={<Play />}
        />
        <Route
          path="/learn"
          element={<Learn />}
        />
      </Routes>
    </Router>
  )

}

export default App

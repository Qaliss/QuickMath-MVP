import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

import './App.css'
import Home from './pages/Home.jsx'
import Login from './auth/Login.jsx'
import SignUp from './auth/SignUp.jsx'

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
      </Routes>
    </Router>
  )

}

export default App

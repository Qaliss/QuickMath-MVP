import { useState } from 'react'
import './App.css'
import QuestionCard from './components/QuestionCard'
import Home from './pages/Home.jsx'
import Login from './auth/Login.jsx'
import SignUp from './auth/SignUp.jsx'

function App() {

  const [user, setUser] = useState(null)
  
  if (!user) {
    return (
      <div>
        <h2>QuickMath</h2>
        <SignUp />
        <Login />
      </div>
    )
  }

  return (
    <>
      <Home />
    </>
  )
}

export default App

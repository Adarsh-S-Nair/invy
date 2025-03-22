import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'
import './styles/themes.css'
import './styles/globals.css'
import { useEffect, useState } from 'react'

function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App

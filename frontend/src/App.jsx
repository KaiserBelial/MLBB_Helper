import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import HeroPicker from './pages/HeroPicker/HeroPicker'
import Draft from './pages/Draft/Draft'
import Settings from './pages/Settings/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pick-hero" element={<HeroPicker />} />
      <Route path="/draft" element={<Draft />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App
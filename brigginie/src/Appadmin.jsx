import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router'
import { getUser } from './services/api'
import Dashboard from './components/adminpages/dashboard'
const Appadmin = () => {
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'admin') {
      navigate('/')
    }
  }, [user, navigate])

  if (!user || user.role !== 'admin') return null

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<div>Admin Users</div>} />
    </Routes>
  )
}

export default Appadmin

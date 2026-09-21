import { Routes, Route, useNavigate } from 'react-router'
import { useEffect } from 'react'
import { getUser } from './services/api'
import MerchantDashboard from './components/merchantpages/dashboard'

const Appmerchant = () => {
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'merchant' && user.role !== 'admin') {
      navigate('/')
    }
  }, [user, navigate])

  if (!user || (user.role !== 'merchant' && user.role !== 'admin')) return null

  return (
    <Routes>
      <Route path="/" element={<MerchantDashboard />} />
    </Routes>
  )
}

export default Appmerchant

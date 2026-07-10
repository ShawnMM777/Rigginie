import { Routes, Route } from 'react-router-dom'

const Appadmin = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Admin Dashboard</div>} />
      <Route path="/users" element={<div>Admin Users</div>} />
    </Routes>
  )
}

export default Appadmin
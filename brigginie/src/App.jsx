import { Routes, Route } from 'react-router-dom';
import Appusers from './Appusers.jsx';
import Appadmin from './Appadmin.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Appadmin />} />
      <Route path="/*"       element={<Appusers />} />
    </Routes>
  );
}

export default App;
import {Routes, Route } from 'react-router';
import Appusers from './Appusers.jsx';
import Appadmin from './Appadmin.jsx'
import Appmerchant from './Appmerchant.jsx'
import "./App.css";

function App() {
  return (
  <Routes>
    <Route path="/admin/*" element={<Appadmin />} />
    <Route path="/merchant/*" element={<Appmerchant />} />
    <Route path="/*"       element={<Appusers />} />
  </Routes>
  );
}

export default App;
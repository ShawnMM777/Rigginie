import { useState, useEffect, } from "react";
import { useNavigate } from "react-router";
import { productAPI, cartAPI } from "../../../../services/api";
import logo from '../../../../assets/logo.png';
import gcash from '../../../../assets/gcash.png';
import paypal from '../../../../assets/paypal.png';
import visa from '../../../../assets/visa.png';
import maya from '../../../../assets/maya.png';
import homecredit from '../../../../assets/homecredit.png';
import mastercard from '../../../../assets/mastercard.png';
import usdt from '../../../../assets/usdt.png';
import ethereum from '../../../../assets/ethereum.png';
import xmr from '../../../../assets/xmr.png';
import btc from '../../../../assets/btc.png';
import nvidia from '../../../../assets/nvidia.png';
import amd from '../../../../assets/amdseries.png';
import { FaThreads } from 'react-icons/fa6';
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser, FaRobot } from 'react-icons/fa';
import { TbMapPinFilled } from 'react-icons/tb';
import { MdLogout, MdHistory, MdShoppingCart } from 'react-icons/md';
import { HiPlus } from 'react-icons/hi';

function AMD() {
      const searchbar = ({ onSearch })
      const [open, setOpen] = useState(false);
      const [isNavOpen, setIsNavOpen] = useState(false);
      const [products, setProducts] = useState([]);
      const [cart, setCart] = useState(null);
      const [toast, setToast] = useState('');
      const navigate = useNavigate();
      const user = getUser();
      const menuItems = [ {label: 'Map', icon: <TbMapPinFilled className="text-2xl" />, onClick: () => navigate('/map'),}, {label: 'Shilja Chatbot',icon: <FaRobot className="text-2xl" />,onClick: () => navigate('/shilja'), },];
      function showToast(msg) {setToast(msg);setTimeout(() => setToast(''), 2500);}
      useEffect(() => { productAPI.getAll() .then((res) => setProducts(res.data))  .catch(() => showToast('Failed to load products.'));if (user) { cartAPI.getCart().then((res) => setCart(res.data)).catch(() => { });}}, []);
      const handleCartUpdated = (updatedCart) => setCart(updatedCart);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="w-full bg-black py-1 px-2 flex justify-end items-center gap-x-3">
        <a onClick={() => navigate('/help')} className="font-medium hover:underline text-amber-100 cursor-pointer">Help & Support</a>
        <button className="text-white border-2 border-white bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-sm font-medium rounded-sm px-3 py-1 transition" onClick={() => navigate('/forum')}>FORUM</button>
        <a onClick={() => navigate('/blog')} className="font-medium hover:underline text-amber-100 cursor-pointer">Blog</a>
        <a onClick={() => navigate('/survey')} className="font-medium hover:underline text-amber-100 cursor-pointer">Survey</a>
      </nav>
       <nav className="w-full bg-orange-500 py-5 px-7 md:px-10 shadow-md sticky top-0 z-40">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={() => navigate('/')} className="shrink-0">
          <img src={logo} alt="Logo" className="h-12 w-auto cursor-pointer" /></button>
    <div className="hidden md:flex flex-1 justify-center items-center gap-5 text-white font-serif font-semibold text-sm lg:text-base">
      <Link to="/pc-stores" className="hover:text-orange-200 transition-colors px-4 py-2">PC STORE</Link>
      <Link to="/laptops" className="hover:text-orange-200 transition-colors px-4 py-2">LAPTOPS</Link>
      <Link to="/components" className="hover:text-orange-200 transition-colors px-4 py-2">NETWORKING</Link>
      <Link to="/servers" className="hover:text-orange-200 transition-colors px-4 py-2">SERVERS</Link>
      <Link to="/ai-build" className="hover:text-orange-200 transition-colors px-4 py-2">AI BUILD</Link>
    </div>
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <button onClick={() => navigate('/cart')} className="relative bg-white text-orange-500 p-3 rounded hover:bg-gray-100 transition-colors">
          <MdShoppingCart className="text-xl" />{cart?.item_count > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cart.item_count > 99 ? '99+' : cart.item_count}</span>)}
                              </button>
                              {user ? <ProfileDropdown user={user} /> : (
                                  <button onClick={() => navigate('/login')}
                                      className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors">
                                      <FaUser className="text-sm" /><span>Account</span>
                                  </button>
                              )}
                          </div>
                          <button onClick={() => setIsNavOpen(!isNavOpen)} className="md:hidden text-white text-4xl focus:outline-none">
                              {isNavOpen ? '✕' : '☰'}
                          </button>
                      </div>
      
                      {isNavOpen && (
                          <div className="md:hidden mt-6 pt-6 border-t border-orange-400 bg-orange-500">
                              <div className="flex flex-col gap-4 text-white font-medium text-center py-4">
                                  <Link to="/pc-stores" className="hover:text-orange-200 transition-colors px-4 py-2">PC STORE</Link>
                                  <Link to="/laptops" className="hover:text-orange-200 transition-colors px-4 py-2">LAPTOPS</Link>
                                  <Link to="/components" className="hover:text-orange-200 transition-colors px-4 py-2">NETWORKING</Link>
                                  <Link to="/servers" className="hover:text-orange-200 transition-colors px-4 py-2">SERVERS</Link>
                                  <Link to="/ai-build" className="hover:text-orange-200 transition-colors px-4 py-2">AI BUILD</Link>
                                  <div className="flex items-center justify-center gap-3 mt-4">
                                      <button onClick={() => { setIsNavOpen(false); navigate('/cart'); }}
                                          className="relative bg-white text-orange-500 p-3 rounded hover:bg-gray-100">
                                          <MdShoppingCart className="text-xl" />
                                          {cart?.item_count > 0 && (
                                              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                  {cart.item_count > 99 ? '99+' : cart.item_count}
                                              </span>
                                          )}
                                      </button>
                                      <button className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-8 py-3 rounded hover:bg-gray-100 cursor-pointer"
                                          onClick={() => { setIsNavOpen(false); user ? navigate('/profile') : navigate('/login'); }}>
                                          <FaUser className="text-sm" />
                                          <span>{user ? `${user.firstName}'s Profile` : 'Account'}</span>
                                      </button>
                                  </div>
                              </div>
                          </div>
                      )}
                  </nav>
      
    </div>
  )
}

export default AMD

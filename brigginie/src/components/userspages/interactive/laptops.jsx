import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../../assets/logo.png";
import gcash from "../../../assets/gcash.png";
import paypal from "../../../assets/paypal.png";
import visa from "../../../assets/visa.png";
import maya from "../../../assets/maya.png";
import homecredit from "../../../assets/homecredit.png";
import mastercard from "../../../assets/mastercard.png";
import usdt from "../../../assets/usdt.png";
import ethereum from "../../../assets/ethereum.png";
import xmr from "../../../assets/xmr.png";
import btc from "../../../assets/btc.png";
import { FaThreads } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser } from "react-icons/fa";
import { TbMapPinFilled } from "react-icons/tb";


function ProductCard({ product, onAddToCart }) {
    const [added, setAdded]       = useState(false);
    const [imgError, setImgError] = useState(false);
    const handleAdd = () => {
        setAdded(true);
        if (onAddToCart) onAddToCart(product);
        setTimeout(() => setAdded(false), 1500);
    };
    const bgColor =
        product.name.toLowerCase().includes('radeon') || product.name.toLowerCase().includes('rx')
            ? 'from-red-950 to-gray-900'
            : 'from-green-950 to-gray-900';
    const hasImage = product.image && !imgError;
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
            <div className={`bg-gradient-to-br ${bgColor} h-32 sm:h-36 flex items-center justify-center relative overflow-hidden`}>
                {hasImage ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <span className="text-5xl select-none">🎮</span>
                )}
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                    {product.categories}
                </span>
            </div>
            <div className="p-3 flex flex-col flex-1">
                <h3 className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] leading-snug">
                    {product.name}
                </h3>
                <p className="text-base font-bold text-orange-500 mt-2">{product.price}</p>
                <button onClick={handleAdd}className={`w-full mt-auto pt-2 py-1.5 rounded text-xs font-semibold transition-all duration-200 active:scale-95 ${added? 'bg-green-500 text-white': 'bg-gray-900 text-white hover:bg-orange-500'}`}>{added ? '✓ Added to Cart' : 'Add to Cart'}</button>
            </div>
        </div>
    );
}



function Laptops() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = {
    GAMING_LAPTOP: ['ALIENWARE', 'ROG', 'TUFF', 'PREDATOR', 'AERO', 'AUROS'],
    CHROMEBOOK: ['ACER', 'GOOGLE', 'IDEAPAD', 'ASRock', 'ROG Series'],
    WORKING: ['NVIDIA', 'AMD', 'INTEL GRAPHICS'],
    ULTRA: ['Gaming Mouse', 'Mechanical Keyboard', 'Headsets', 'Monitors', 'Webcams'],
    IN : ['NVMe SSD', 'SATA SSD', 'HDD', 'External Storage'],
    CUSTOM_BUILD: ['Custom PC Builds', 'Pre-built PCs']
  };
 
  const categories = [
    { name: 'GAMING LAPTOP', key: 'GAMING_LAPTOP' },
    { name: 'CHROMEBOOK', key: 'CHROMEBOOK' },
    { name: 'WORKING LAPTOP', key: 'WORKING' },
    { name: 'ULTRA BOOK', key: 'ULTRA' },
    { name: '2 IN 1', key: 'IN' },
  ];
  const handleNavigateToProduct = (menuItems) => {
    const route = menuItems.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${route}`);
    setOpenDropdown(null);
  };
 
  const handleViewAll = (category) => {
    const route = category.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${route}`);
    setOpenDropdown(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className='w-full bg-black py-1 px-2 md:px flex justify-end items-center  stickys'> 
        <button className="text-white border-2 border-white bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-sm font-medium rounded-sm shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 px-3 py-1 " onClick={() => navigate('/forum')}> FORUM</button>
      </nav>
      <nav className="w-full bg-orange-500 py-5 px-6 md:px-10 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <img src={logo} alt="Rigginie PH Logo" className="h-10 w-auto cursor-pointer" />
          </button>
          <div className="hidden md:flex items-center gap-1">
            {categories.map((category) => (
              <div key={category.key}className="relative group" onMouseEnter={() => setOpenDropdown(category.key)}onMouseLeave={() => setOpenDropdown(null)} >
                <button className="text-white text-lg font-medium hover:bg-orange-600 px-4 py-2 rounded transition-colors">
                  {category.name}
                </button>
                {openDropdown === category.key && menuItems[category.key].length > 0 && (
                  <div className="absolute top-full left-0 bg-orange-500 border-t-4 border-orange-500 shadow-xl rounded-b-lg min-w-max">
                    <div className="p-6">
                      <ul className="space-y-2">
                        {menuItems[category.key].map((item, idx) => (
                          <li key={idx}>
                            <button onClick={() => handleNavigateToProduct(item)}className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded transition-colors font-medium">
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleViewAll(category.key)}
                          className="inline-block px-4 py-2 bg-gray-500 text-white rounded hover:bg-transparent hover:text-white transition-colors font-medium text-sm">
                          View All {category.name} →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => navigate('/account')} className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors"> <FaUser className="text-sm" /> <span>Account</span></button>
          </div>
          <button onClick={() => setIsOpen(!isOpen)}className="md:hidden text-white text-4xl focus:outline-none">
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden mt-6 pt-6 border-t border-orange-400">
            <nav className='w-full bg-black py-1 px-2 md:px  items-end '> 
        <button className="text-white border-2 border-white bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-sm font-medium rounded-sm shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 px-3 py-1 allign-end left-" onClick={() => navigate('/forum')}> FORUM</button>
      </nav>
            <div className="flex flex-col gap-4 text-white font-medium text-center py-4">
              {categories.map((category) => (
                <div key={category.key} className="border-b border-orange-400 pb-4">
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === category.key ? null : category.key)
                    }
                    className="w-full px-4 py-2 hover:bg-orange-600 rounded transition-colors flex justify-between items-center"
                  >
                    {category.name}
                    <span>{openDropdown === category.key ? '▲' : '▼'}</span>
                  </button>
 
                  {openDropdown === category.key && menuItems[category.key].length > 0 && (
                    <div className="mt-3 bg-orange-600 rounded py-2 space-y-1">
                      {menuItems[category.key].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleNavigateToProduct(item);
                            setIsOpen(false);
                          }}
                          className="w-full block px-6 py-2 text-sm hover:bg-orange-700 transition-colors text-left"
                        >
                          {item}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          handleViewAll(category.key);
                          setIsOpen(false);
                        }}
                        className="w-full block px-6 py-2 text-sm font-semibold hover:bg-orange-700 transition-colors text-left mt-2 border-t border-orange-500 pt-2"
                      >
                        View All {category.name} →
                      </button>
                    </div>
                  )}
                </div>
              ))}
 
              <button className="mt-6 mx-auto flex items-center gap-2 bg-white text-orange-500 font-semibold px-8 py-3 rounded hover:bg-gray-100"onClick={() => navigate('/account')}> <FaUser className="text-sm" /><span>Account</span></button>
            </div>
          </div>
        )}
      </nav>
 
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xl text-gray-600 font-semibold">Welcome to PC Store</p>
          <p className="text-gray-600 mt-4">Select a category above to browse products</p>
        </div>
      </main>
 
      <Footer />
    </div>
  );
};
 

function Footer () {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-10 border-t-4 border-orange-500 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-orange-400 transition-colors">Support & Warranty</a></li>
                        <li><a href="#" className="hover:text-orange-400 transition-colors">Mission & Vision</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>Email: rigginieph@email.com</li>
                        <li>Phone: +63 09919883132</li>
                        <li>Location: Pasig, Metro Manila</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Join Our Community</h3>
                    <div className="flex flex-wrap gap-5 text-3xl justify-center">
                        <a href="https://www.facebook.com/rigginieph" className="hover:text-orange-400 transition-colors"><FaFacebook /></a>
                        <a href="https://www.threads.net/@rigginieph" className="hover:text-orange-400 transition-colors"><FaThreads /></a>
                        <a href="https://www.instagram.com/rigginieph" className="hover:text-orange-400 transition-colors"><FaInstagram /></a>
                        <a href="https://www.youtube.com/@RigginiePH" className="hover:text-orange-400 transition-colors"><FaYoutube /></a>
                        <a href="https://t.me/rigginieph" className="hover:text-orange-400 transition-colors"><FaTelegram /></a>
                        <a href="https://discord.gg/rigginieph" className="hover:text-orange-400 transition-colors"><FaDiscord /></a>
                        <a href="https://www.twitch.tv/rigginieph" className="hover:text-orange-400 transition-colors"><FaTwitch /></a>
                    </div>
                </div>
                <div className="md:col-span-3 mt-8 border-t border-gray-800 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Payment Methods</h3>
                    <div className="flex flex-wrap gap-4 mx-auto justify-center">
                        <img src={gcash} className="h-10 w-auto" alt="GCash" />
                        <img src={paypal} className="h-10 w-auto" alt="PayPal" />
                        <img src={visa} className="h-10 w-auto" alt="Visa" />
                        <img src={maya} className="h-10 w-auto" alt="Maya" />
                        <img src={homecredit} className="h-10 w-auto" alt="Home Credit" />
                        <img src={mastercard} className="h-10 w-auto" alt="Mastercard" />
                        <img src={usdt} className="h-10 w-auto" alt="USDT" />
                        <img src={ethereum} className="h-10 w-auto" alt="Ethereum" />
                        <img src={btc} className="h-10 w-auto" alt="Bitcoin" />
                        <img src={xmr} className="h-10 w-auto" alt="Monero" />
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Rigginie PH. All rights reserved.
            </div>
        </footer>
    );
};


export default Laptops

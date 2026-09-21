import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { authAPI, cartAPI, productAPI, pointsAPI, getUser, clearAuthData } from '../../../services/api';
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
import { MdLogout, MdHistory, MdShoppingCart } from 'react-icons/md';
import { FaThreads } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser } from "react-icons/fa";

function Laptops() {
  const navigate = useNavigate();
  const user = getUser();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setProducts(data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const menuItems = {
    GAMING_LAPTOP: [
      { code: 'ALIENWARE', label: 'ALIENWARE' },
      { code: 'ROG', label: 'ROG' },
      { code: 'TUFF', label: 'TUFF' },
      { code: 'PREDATOR', label: 'PREDATOR' },
      { code: 'AERO', label: 'AERO' },
      { code: 'AUROS', label: 'AUROS' },
    ],
    CHROMEBOOK: [
      { code: 'ACER', label: 'ACER' },
      { code: 'GOOGLE', label: 'GOOGLE' },
      { code: 'IDEAPAD', label: 'IdeaPad' },
    ],
    WORKING: [
      { code: 'APPLE', label: 'Apple' },
      { code: 'THINKPAD', label: 'ThinkPad' },
      { code: 'LOQ', label: 'LOQ' },
      { code: 'THINKBOOK', label: 'ThinkBook' },
      { code: 'SLIMBOOK', label: 'SlimBook' },
    ],
    ULTRA: [
      { code: 'XPS', label: 'Dell XPS' },
      { code: 'MACBOOK', label: 'MacBook Air' },
      { code: 'ZENBOOK', label: 'Zenbook' },
      { code: 'SPECTRE', label: 'Spectre' },
      { code: 'SWIFT', label: 'Swift' },
    ],
    IN: [
      { code: 'SURFACE', label: 'Surface' },
      { code: 'YOGA', label: 'Yoga 2-in-1' },
      { code: 'SPIN', label: 'Spin' },
      { code: 'ENVY', label: 'Envy x360' },
      { code: 'FLEX', label: 'Flex' },
    ],
  };

  const categories = [
    { key: 'WORKING', name: 'Working' },
    { key: 'GAMING_LAPTOP', name: 'Gaming Laptop' },
    { key: 'CHROMEBOOK', name: 'Chromebook' },
    { key: 'ULTRA', name: 'Ultrabook' },
    { key: 'IN', name: '2-in-1' },
  ];

  const workinglaptop = products.filter((p) => p.category === 'LAP' && p.typeproduct === 'WL');
  const gaminglaptop = products.filter((p) => p.category === 'LAP' && p.typeproduct === 'GL');
  const chromebook = products.filter((p) => p.category === 'LAP' && p.typeproduct === 'CL');
  const ultrabook = products.filter((p) => p.category === 'LAP' && p.typeproduct === 'UL');

  const handleNavigateToProduct = (code) => {
    const route = code.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${route}`);
    setOpenDropdown(null);
  };

  const handleViewAll = (category) => {
    const route = category.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${route}`);
    setOpenDropdown(null);
  };

  const handleAddToCart = async (product) => {
    if (!user) { navigate('/login'); return; }
    try {
      await cartAPI.addItem(product.id, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className='w-full bg-black py-1 px-2 md:px-6 flex justify-end items-center stickys'>
        <button className="text-white border-2 border-white bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-sm font-medium rounded-sm shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 px-3 py-1 " onClick={() => navigate('/forum')}> FORUM</button>
      </nav>
      <nav className="w-full bg-orange-500 py-5 px-6 md:px-10 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <img src={logo} alt="Rigginie PH Logo" className="h-10 w-auto cursor-pointer" />
          </button>
          <div className="hidden md:flex items-center gap-1">
            {categories.map((category) => (
              <div key={category.key} className="relative group" onMouseEnter={() => setOpenDropdown(category.key)} onMouseLeave={() => setOpenDropdown(null)}>
                <button className="text-white text-lg font-medium hover:bg-orange-600 px-4 py-2 rounded transition-colors">
                  {category.name}
                </button>
                {openDropdown == category.key && menuItems[category.key]?.length > 0 && (
                  <div className="absolute top-full left-0 bg-orange-500 border-t-4 border-orange-500 shadow-xl rounded-b-lg min-w-max">
                    <div className="p-6">
                      <ul className="space-y-2">
                        {menuItems[category.key].map((item) => (
                          <li key={item.code}>
                            <button onClick={() => handleNavigateToProduct(item.code)} className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded transition-colors font-medium">
                              {item.label}
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
            {user ? <ProfileDropdown user={user} /> : (
              <button onClick={() => navigate('/Login')} className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors"> <FaUser className="text-sm" /> <span>Account</span></button>
            )}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-4xl focus:outline-none">
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden mt-6 pt-6 border-t border-orange-400">
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

                  {openDropdown === category.key && menuItems[category.key]?.length > 0 && (
                    <div className="mt-3 bg-orange-600 rounded py-2 space-y-1">
                      {menuItems[category.key].map((item) => (
                        <button
                          key={item.code}
                          onClick={() => {
                            handleNavigateToProduct(item.code);
                            setIsOpen(false);
                          }}
                          className="w-full block px-6 py-2 text-sm hover:bg-orange-700 transition-colors text-left"
                        >
                          {item.label}
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

              <button className="mt-6 mx-auto flex items-center gap-2 bg-white text-orange-500 font-semibold px-8 py-3 rounded hover:bg-gray-100" onClick={() => navigate('/Login')}> <FaUser className="text-sm" /><span>Account</span></button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-12">
          <LaptopSection title="WORKING LAPTOPS" subtitle="BEST FOR HEAVY WORKLOADS LAPTOP" viewAllLink="/category/working" products={workinglaptop} loading={loading} onAddToCart={handleAddToCart} />
          <LaptopSection title="GAMING LAPTOPS" subtitle="GOOD FOR TRIPLE A GAMES AND FPS/MOBA GAME" viewAllLink="/category/gaming_laptop" products={gaminglaptop} loading={loading} onAddToCart={handleAddToCart} />
          <LaptopSection title="CHROMEBOOKS" subtitle="LIGHTWEIGHT AND BUDGET-FRIENDLY FOR EVERYDAY USE" viewAllLink="/category/chromebook" products={chromebook} loading={loading} onAddToCart={handleAddToCart} />
          <LaptopSection title="ULTRABOOKS" subtitle="THIN, LIGHT, AND BUILT FOR LIFE ON THE GO" viewAllLink="/category/ultra" products={ultrabook} loading={loading} onAddToCart={handleAddToCart} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function LaptopSection({ title, subtitle, viewAllLink, products, loading, onAddToCart }) {
  return (
    <div className="w-full">
      <div className="flex items-end justify-between w-full mb-6">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full shrink-0" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <p className="text-sm text-gray-500 mt-0.5 ml-3">{subtitle}</p>
        </div>
        <Link to={viewAllLink} className="text-sm text-orange-500 font-semibold hover:underline shrink-0">
          View All →
        </Link>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-400">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

function Footer() {
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
}

function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    pointsAPI.getBalance()
      .then((res) => setPoints(res.data.points))
      .catch(() => setPoints(0));
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout(localStorage.getItem('refresh_token'));
    } catch (err) {
      console.log('Logout error:', err);
    } finally {
      clearAuthData();
      setIsOpen(false);
      window.location.href = '/';
    }
  };

  const handleNavigation = (path) => { navigate(path); setIsOpen(false); };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors">
        <FaUser className="text-sm" />
        <span>{user?.firstName || 'Account'}</span>
        <span className="text-xl">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
          <div className="bg-orange-50 border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div data-role={user?.usertype || user?.userType || user?.user_type || user?.role || 'enthusiast'} className="profile-role-avatar w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-200 px-4 py-3 bg-linear-to-r from-orange-50 to-yellow-50">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Points Balance</span>
              <span className="text-xl font-bold text-orange-600">{points.toLocaleString()} pts</span>
            </div>
          </div>
          <div className="py-2">
            <button onClick={() => handleNavigation('/profile')}
              className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left">
              <FaUser className="text-orange-500" /><span>My Profile</span>
            </button>
            <button onClick={() => handleNavigation('/purchase-history')}
              className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left">
              <MdHistory className="text-orange-500 text-lg" /><span>Purchase History</span>
            </button>
            <button onClick={() => handleNavigation('/cart')}
              className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left">
              <MdShoppingCart className="text-orange-500 text-lg" /><span>Shopping Cart</span>
            </button>
          </div>
          <div className="border-t border-gray-200 p-2">
            <button onClick={handleLogout}
              className="w-full px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 font-semibold text-left rounded">
              <MdLogout className="text-lg" /><span>Logout</span>
            </button>
          </div>
        </div>
      )}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const hasImage = product.img1 && !imgError;
  const imgSrc = hasImage
    ? (product.img1.startsWith('http') ? product.img1 : `http://localhost:8000${product.img1}`)
    : null;

  const handleAdd = () => {
    setAdded(true);
    if (onAddToCart) onAddToCart(product);
    setTimeout(() => setAdded(false), 1500);
  };

  const bgColor =
    product.name.toLowerCase().includes('radeon') || product.name.toLowerCase().includes('rx')
      ? 'from-red-950 to-gray-900'
      : 'from-green-950 to-gray-900';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <div className={`bg-linear-to-br ${bgColor} h-32 sm:h-36 flex items-center justify-center relative overflow-hidden`}>
        {hasImage ? (
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl select-none">🎮</span>
        )}
        <span className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
          {product.category}
        </span>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 min-h-10 leading-snug">
          {product.name}
        </h3>
        <p className="text-base font-bold text-orange-500 mt-2">₱ {Number(product.price).toLocaleString()}</p>
        <button onClick={handleAdd} className={`w-full mt-auto pt-2 py-1.5 rounded text-xs font-semibold transition-all duration-200 active:scale-95 ${added ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-orange-500'}`}>
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default Laptops
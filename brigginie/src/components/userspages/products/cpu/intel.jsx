import { Link, useNavigate } from 'react-router'
import { productAPI, cartAPI, getUser } from '../../../../services/api'
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
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser } from 'react-icons/fa';
import { TbMapPinFilled } from 'react-icons/tb';
import { MdLogout, MdHistory, MdShoppingCart } from 'react-icons/md';

function intel() {
      const [isNavOpen, setIsNavOpen] = useState(false);
      const [products, setProducts] = useState([]);
      const [cart, setCart] = useState(null);
      const [toast, setToast] = useState('');
      const navigate = useNavigate();
      const user = getUser();
  return (
    <div className='min-h-screen bg-gray-50 flexd-col'>
      <nav className='w-full bg-black py-1 px-2 flex justify-end item gap-x-3'>
        <a onClick={() => navigate('/help')} className="font-medium hover:underline text-amber-100 cursor-pointer">Help & Support</a>
        <a onClick={() => navigate('/blog')} className="font-medium hover:underline text-amber-100 cursor-pointer">Blog</a>
        <a onClick={() => navigate('/survey')} className="font-medium hover:underline text-amber-100 cursor-pointer">Survey</a>
      </nav>
      <nav className="w-full bg-orange-500 py-5 px-7 md:px-10 shadow-md sticky top-0 z-40">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <button onClick={() => navigate('/')} className="shrink-0"><img src={logo} alt="Logo" className="h-12 w-auto cursor-pointer" /></button>
      <div className="hidden md:flex flex-1 justify-center items-center gap-5 text-white font-medium text-sm lg:text-base">
       <Link to="/pc-stores" className="hover:text-orange-200 transition-colors px-4 py-2">PC STORE</Link>
          <Link to="/laptops" className="hover:text-orange-200 transition-colors px-4 py-2">LAPTOPS</Link>
          <Link to="/components" className="hover:text-orange-200 transition-colors px-4 py-2">NETWORKING</Link>
          <Link to="/servers" className="hover:text-orange-200 transition-colors px-4 py-2">SERVERS</Link>
          <Link to="/ai-build" className="hover:text-orange-200 transition-colors px-4 py-2">AI BUILD</Link>
      </div>
      <div className="hidden md:flex items-center gap-3 shrink-0">
      <button onClick={() => navigate('/cart')} className="relative bg-white text-orange-500 p-3 rounded hover:bg-gray-100 transition-colors"> <MdShoppingCart className="text-xl" />{cart?.item_count > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cart.item_count > 99 ? '99+' : cart.item_count}</span>)} </button> 
      {user ? <ProfileDropdown user={user} /> : ( <button onClick={() => navigate('/login')} className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors"> <FaUser className="text-sm" /><span>Account</span></button>)} </div>
      <button onClick={() => setIsNavOpen(!isNavOpen)} className="md:hidden text-white text-4xl focus:outline-none">{isNavOpen ? '✕' : '☰'}</button>
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
          <button onClick={() => { setIsNavOpen(false); navigate('/cart'); }}className="relative bg-white text-orange-500 p-3 rounded hover:bg-gray-100"><MdShoppingCart className="text-xl" />{cart?.item_count > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cart.item_count > 99 ? '99+' : cart.item_count}</span>)} </button>
          <button className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-8 py-3 rounded hover:bg-gray-100 cursor-pointer" onClick={() => { setIsNavOpen(false); user ? navigate('/profile') : navigate('/login'); }}><FaUser className="text-sm" /><span>{user ? `${user.firstName}'s Profile` : 'Account'}</span></button>
      </div>
      </div>
      </div>)}
      </nav>
      <Footer/>
    </div>
  )
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
                        <a href="https://www.facebook.com/GHRPH/" className="hover:text-orange-400 transition-colors"><FaFacebook /></a>
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
function ProductCard({ product, onCartUpdated, onError }) {
    const [added, setAdded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const src = product.image ? `http://localhost:8000${product.image}` : null;

    const handleAdd = async () => {
        const user = getUser();
        if (!user) {
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const res = await cartAPI.addItem(product.id, 1);
            setAdded(true);
            onCartUpdated?.(res.data);
            setTimeout(() => setAdded(false), 1500);
        } catch (err) {
            onError?.(err.response?.data?.error || 'Failed to add to cart.');
        } finally {
            setLoading(false);
        }
    };

    const bgColor = product.name.toLowerCase().includes('radeon') || product.name.toLowerCase().includes('rx')
        ? 'from-red-950 to-gray-900'
        : 'from-green-950 to-gray-900';

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
            <div className={`bg-gradient-to-br ${bgColor} h-32 sm:h-36 flex items-center justify-center relative overflow-hidden`}>
                {src && !imgError
                    ? <img src={src} alt={product.name} onError={() => setImgError(true)}
                        className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300" />
                    : <span className="text-5xl select-none">🎮</span>
                }
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                    {CATEGORY_LABELS[product.category] || product.category}
                </span>
            </div>
            <div className="p-3 flex flex-col flex-1">
                <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{product.name}</h3>
                <p className="text-base font-bold text-orange-500 mt-2">₱ {Number(product.price).toLocaleString()}</p>
                <button onClick={handleAdd} disabled={loading}
                    className={`w-full mt-auto pt-2 py-1.5 rounded text-xs font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 ${added ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-orange-500'}`}>
                    {loading ? 'Adding…' : added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}
function ProfileDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

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
                    <div className="border-b border-gray-200 px-4 py-3 bg-gradient-to-r from-orange-50 to-yellow-50">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Points Balance</span>
                            <span className="text-xl font-bold text-orange-600">0 pts</span>
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
export default intel

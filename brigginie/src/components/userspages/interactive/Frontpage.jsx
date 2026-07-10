import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, storeAuthData, clearAuthData } from '../../../services/api';

import RegisterModal from './RegisterModal';


import logo        from '../../../assets/logo.png';
import gcash       from '../../../assets/gcash.png';
import paypal      from '../../../assets/paypal.png';
import visa        from '../../../assets/visa.png';
import maya        from '../../../assets/maya.png';
import homecredit  from '../../../assets/homecredit.png';
import mastercard  from '../../../assets/mastercard.png';
import usdt        from '../../../assets/usdt.png';
import ethereum    from '../../../assets/ethereum.png';
import xmr         from '../../../assets/xmr.png';
import btc         from '../../../assets/btc.png';
import ROGSTRIX5070  from '../../../assets/products/1.png';
import T1ASUS        from '../../../assets/products/t1.png';
import MSIINSPIRE    from '../../../assets/products/images.png';
import rx9070        from '../../../assets/products/10.png';
import rtx5080       from '../../../assets/products/rtx5080.png';
import proart        from '../../../assets/products/proart.png';
import aorusmaster   from '../../../assets/products/2.png';
import aerooc        from '../../../assets/products/3.png';
import proart5090    from '../../../assets/products/4.png';
import inspireitxoc  from '../../../assets/products/5.png';
import gamingoc      from '../../../assets/products/6.png';
import rogstrix      from '../../../assets/products/7.png';
import hof           from '../../../assets/products/8.png';
import occlick       from '../../../assets/products/9.png';
import nvidia        from '../../../assets/nvidia.png';
import amd           from '../../../assets/amdseries.png';

import { FaThreads }                                                    from 'react-icons/fa6';
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser } from 'react-icons/fa';
import { TbMapPinFilled }                                               from 'react-icons/tb';
import { MdLogout, MdHistory, MdShoppingCart }                          from 'react-icons/md';


function Frontpage() {
    const NewRelease = [
        { id: 1,  name: 'GeForce RTX™ 5070Ti ROG STRIX',                    categories: 'GRAPHICS CARD', price: '₱ 86,980',  image: ROGSTRIX5070  },
        { id: 2,  name: 'GeForce RTX™ 5080 8GB INSPIRE ITX OC',             categories: 'GRAPHICS CARD', price: '₱ 18,200',  image: MSIINSPIRE    },
        { id: 3,  name: 'GeForce RTX™ 5080 16GB EX Gamer 1-Click OC White', categories: 'GRAPHICS CARD', price: '₱ 18,200',  image: rtx5080       },
        { id: 4,  name: 'Radeon RX™ 9070XT 12GB GRE AORUS',                 categories: 'GRAPHICS CARD', price: '₱ 40,980',  image: rx9070        },
        { id: 5,  name: 'GeForce RTX™ 5060Ti 16GB ASUS T1',                 categories: 'GRAPHICS CARD', price: '₱ 17,970',  image: T1ASUS        },
        { id: 6,  name: 'GeForce RTX™ 5090 32GB ProArt OC',                 categories: 'GRAPHICS CARD', price: '₱ 238,983', image: proart        },
        { id: 7,  name: 'GeForce RTX™ 5070 12GB AORUS MASTER',              categories: 'GRAPHICS CARD', price: '₱ 56,850',  image: aorusmaster   },
        { id: 8,  name: 'GeForce RTX™ 5070 12GB AERO OC',                   categories: 'GRAPHICS CARD', price: '₱ 50,585',  image: aerooc        },
        { id: 9,  name: 'GeForce RTX™ 5090 32GB ProArt',                    categories: 'GRAPHICS CARD', price: '₱ 205,000', image: proart5090    },
        { id: 10, name: 'GeForce RTX™ 5070Ti INSPIRE ITX OC',               categories: 'GRAPHICS CARD', price: '₱ 18,200',  image: inspireitxoc  },
        { id: 11, name: 'Radeon RX™ 9070 XT 16GB GAMING OC',                categories: 'GRAPHICS CARD', price: '₱ 57,400',  image: gamingoc      },
        { id: 12, name: 'GeForce RTX™ 5070 12GB ROG STRIX',                 categories: 'GRAPHICS CARD', price: '₱ 18,200',  image: rogstrix      },
        { id: 13, name: 'GeForce RTX™ 5080 16GB HOF Gaming (Black Ed.)',     categories: 'GRAPHICS CARD', price: '₱ 110,495', image: hof           },
        { id: 14, name: 'GeForce RTX™ 5090 32GB 1-Click OC',                categories: 'GRAPHICS CARD', price: '₱ 206,764', image: occlick       },
    ];

    const [isNavOpen,      setIsNavOpen]      = useState(false);
    const [isLoginOpen,    setIsLoginOpen]    = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [cartCount,      setCartCount]      = useState(0);
    const navigate = useNavigate();

    const user          = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const handleAddToCart = () => setCartCount(c => c + 1);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Top bar */}
            <nav className="w-full bg-black py-1 px-2 flex justify-end items-center gap-x-3">
                <button className="text-white border-2 border-white bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-sm font-medium rounded-sm px-3 py-1 transition"
                    onClick={() => navigate('/forum')}>FORUM</button>
                <a onClick={() => navigate('/help')}   className="font-medium hover:underline text-amber-100 cursor-pointer">Help & Support</a>
                <a onClick={() => navigate('/blog')}   className="font-medium hover:underline text-amber-100 cursor-pointer">Blog</a>
                <a onClick={() => navigate('/survey')} className="font-medium hover:underline text-amber-100 cursor-pointer">Survey</a>
            </nav>

            {/* Main nav */}
            <nav className="w-full bg-orange-500 py-5 px-7 md:px-10 shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex-shrink-0">
                        <img src={logo} alt="Logo" className="h-12 w-auto cursor-pointer" />
                    </button>
                    <div className="hidden md:flex flex-1 justify-center items-center gap-5 text-white font-medium text-sm lg:text-base">
                        <Link to="/pc-stores"  className="hover:text-orange-200 transition-colors px-4 py-2">PC STORE</Link>
                        <Link to="/laptops"    className="hover:text-orange-200 transition-colors px-4 py-2">LAPTOPS</Link>
                        <Link to="/components" className="hover:text-orange-200 transition-colors px-4 py-2">NETWORKING</Link>
                        <Link to="/servers"    className="hover:text-orange-200 transition-colors px-4 py-2">SERVERS</Link>
                        <Link to="/ai-build"   className="hover:text-orange-200 transition-colors px-4 py-2">AI BUILD</Link>
                    </div>
                    <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                        <button onClick={() => navigate('/cart')}
                            className="relative bg-white text-orange-500 p-3 rounded hover:bg-gray-100 transition-colors">
                            <MdShoppingCart className="text-xl" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </button>
                        {user
                            ? <ProfileDropdown user={user} />
                            : <button onClick={() => setIsLoginOpen(true)}
                                className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors">
                                <FaUser className="text-sm" /><span>Account</span>
                              </button>
                        }
                    </div>
                    <button onClick={() => setIsNavOpen(!isNavOpen)} className="md:hidden text-white text-4xl focus:outline-none">
                        {isNavOpen ? '✕' : '☰'}
                    </button>
                </div>

                {isNavOpen && (
                    <div className="md:hidden mt-6 pt-6 border-t border-orange-400 bg-orange-500">
                        <div className="flex flex-col gap-4 text-white font-medium text-center py-4">
                            <Link to="/pc-stores"  className="hover:text-orange-200 transition-colors px-4 py-2">PC STORE</Link>
                            <Link to="/laptops"    className="hover:text-orange-200 transition-colors px-4 py-2">LAPTOPS</Link>
                            <Link to="/components" className="hover:text-orange-200 transition-colors px-4 py-2">NETWORKING</Link>
                            <Link to="/servers"    className="hover:text-orange-200 transition-colors px-4 py-2">SERVERS</Link>
                            <Link to="/ai-build"   className="hover:text-orange-200 transition-colors px-4 py-2">AI BUILD</Link>
                            <div className="flex items-center justify-center gap-3 mt-4">
                                <button onClick={() => { setIsNavOpen(false); navigate('/cart'); }}
                                    className="relative bg-white text-orange-500 p-3 rounded hover:bg-gray-100">
                                    <MdShoppingCart className="text-xl" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </button>
                                {/* ✅ Fixed: className not class */}
                                <button className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-8 py-3 rounded hover:bg-gray-100 cursor-pointer"
                                    onClick={() => { setIsNavOpen(false); user ? navigate('/profile') : setIsLoginOpen(true); }}>
                                    <FaUser className="text-sm" />
                                    <span>{user ? `${user.firstName}'s Profile` : 'Account'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-1">
                {/* Hero */}
                <div className="bg-gradient-to-r via-orange-900 via-gray-800 to-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                                New Arrivals 2025
                            </span>
                            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                                RTX 5000 Series and RX 9000 Series<br />
                                <span className="text-orange-400">Now Available</span>
                            </h1>
                            <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
                                Upgrade your rig with the latest NVIDIA GeForce RTX 5000 &amp; AMD Radeon RX 9000 series — fastest GPUs ever made.
                            </p>
                            <div className="flex gap-3 mt-7">
                                <Link to="/pc-stores" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3 rounded transition-colors text-sm">Shop Now</Link>
                                <Link to="/ai-build"  className="border border-gray-600 hover:border-orange-400 text-gray-300 hover:text-orange-400 font-semibold px-7 py-3 rounded transition-colors text-sm">Build Your PC</Link>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center"><img alt="NVIDIA" src={nvidia} /></div>
                        <div className="hidden md:flex items-center justify-center w-56 h-56"><img alt="AMD" src={amd} /></div>
                    </div>
                </div>

                {/* New Releases */}
                <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="w-1 h-6 bg-orange-500 rounded-full" />
                                <h2 className="text-lg md:text-xl font-bold text-gray-900">New Releases</h2>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5 ml-3">Latest GPUs · {NewRelease.length} products</p>
                        </div>
                        <Link to="/pc-stores" className="text-sm text-orange-500 font-semibold hover:underline">View All →</Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {NewRelease.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />

            {/* Map button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button className="w-18 h-18 rounded-full overflow-hidden border-4 border-gray-700 bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow hover:scale-105"
                    onClick={() => navigate('/map')}>
                    <TbMapPinFilled className="text-black text-5xl" />
                </button>
            </div>

            {/* Modals */}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }}
            />
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSwitchToLogin={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
            />
        </div>
    );
}


function ProductCard({ product, onAddToCart }) {
    const [added, setAdded]       = useState(false);
    const [imgError, setImgError] = useState(false);

    const handleAdd = () => {
        setAdded(true);
        if (onAddToCart) onAddToCart(product);
        setTimeout(() => setAdded(false), 1500);
    };

    const bgColor = product.name.toLowerCase().includes('radeon') || product.name.toLowerCase().includes('rx')
        ? 'from-red-950 to-gray-900'
        : 'from-green-950 to-gray-900';

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
            <div className={`bg-gradient-to-br ${bgColor} h-32 sm:h-36 flex items-center justify-center relative overflow-hidden`}>
                {product.image && !imgError
                    ? <img src={product.image} alt={product.name} onError={() => setImgError(true)}
                        className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300" />
                    : <span className="text-5xl select-none">🎮</span>
                }
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                    {product.categories}
                </span>
            </div>
            <div className="p-3 flex flex-col flex-1">
                <h3 className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] leading-snug">{product.name}</h3>
                <p className="text-base font-bold text-orange-500 mt-2">{product.price}</p>
                <button onClick={handleAdd}
                    className={`w-full mt-auto pt-2 py-1.5 rounded text-xs font-semibold transition-all duration-200 active:scale-95 ${added ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-orange-500'}`}>
                    {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
            </div>
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
                        <a href="https://www.facebook.com/GHRPH/"           className="hover:text-orange-400 transition-colors"><FaFacebook /></a>
                        <a href="https://www.threads.net/@rigginieph"        className="hover:text-orange-400 transition-colors"><FaThreads /></a>
                        <a href="https://www.instagram.com/rigginieph"       className="hover:text-orange-400 transition-colors"><FaInstagram /></a>
                        <a href="https://www.youtube.com/@RigginiePH"        className="hover:text-orange-400 transition-colors"><FaYoutube /></a>
                        <a href="https://t.me/rigginieph"                    className="hover:text-orange-400 transition-colors"><FaTelegram /></a>
                        <a href="https://discord.gg/rigginieph"              className="hover:text-orange-400 transition-colors"><FaDiscord /></a>
                        <a href="https://www.twitch.tv/rigginieph"           className="hover:text-orange-400 transition-colors"><FaTwitch /></a>
                    </div>
                </div>
                <div className="md:col-span-3 mt-8 border-t border-gray-800 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Payment Methods</h3>
                    <div className="flex flex-wrap gap-4 mx-auto justify-center">
                        <img src={gcash}      className="h-10 w-auto" alt="GCash" />
                        <img src={paypal}     className="h-10 w-auto" alt="PayPal" />
                        <img src={visa}       className="h-10 w-auto" alt="Visa" />
                        <img src={maya}       className="h-10 w-auto" alt="Maya" />
                        <img src={homecredit} className="h-10 w-auto" alt="Home Credit" />
                        <img src={mastercard} className="h-10 w-auto" alt="Mastercard" />
                        <img src={usdt}       className="h-10 w-auto" alt="USDT" />
                        <img src={ethereum}   className="h-10 w-auto" alt="Ethereum" />
                        <img src={btc}        className="h-10 w-auto" alt="Bitcoin" />
                        <img src={xmr}        className="h-10 w-auto" alt="Monero" />
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Rigginie PH. All rights reserved.
            </div>
        </footer>
    );
}


function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
    const [email, setEmail]     = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authAPI.login({ email, password });
            // ✅ Fixed: extract data correctly
            storeAuthData(response.data.access, response.data.user, response.data.refresh);
            window.location.reload();
        } catch (err) {
            // ✅ Fixed: show actual server error
            const msg = err.response?.data?.detail
                || err.response?.data?.message
                || 'Invalid email or password.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Login</h2>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">✕</button>
                </div>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="your@email.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="••••••••" required />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <button onClick={() => { onClose(); onSwitchToRegister(); }} className="text-orange-500 font-semibold hover:underline">
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
}


function ProfileDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // ✅ Fixed: pass refresh token
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
                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
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

export default Frontpage;
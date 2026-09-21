import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { authAPI, storeAuthData, clearAuthData } from "../../../services/api";
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
import { IoMdWarning } from "react-icons/io";
import { MdLogout, MdHistory, MdShoppingCart } from "react-icons/md";

function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login({ 
                email, 
                password 
            });

            storeAuthData(response.data.token, response.data.user);
            window.location.reload();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
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

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <button
                        onClick={() => {
                            onClose();
                            onSwitchToRegister();
                        }}
                        className="text-orange-500 font-semibold hover:underline"
                    >
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
}
function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });

            storeAuthData(response.data.token, response.data.user);
            window.location.reload();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Register</h2>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">✕</button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                placeholder="John"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{' '}
                    <button
                        onClick={() => {
                            onClose();
                            onSwitchToLogin();
                        }}
                        className="text-orange-500 font-semibold hover:underline"
                    >
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
}

function ProfileDropdown({ user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch (err) {
            console.log('Logout error:', err);
        } finally {
            clearAuthData();
            setIsOpen(false);
            window.location.href = '/';
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
    };
    return (
        <div className="relative">
            {/* Account Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors"
            >
                <FaUser className="text-sm" />
                <span>{user?.firstName || 'Account'}</span>
                <span className="text-xl">{isOpen ? '▲' : '▼'}</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
                    {/* User Info Section */}
                    <div className="bg-orange-50 border-b border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div data-role={user?.usertype || user?.userType || user?.user_type || user?.role || 'enthusiast'} className="profile-role-avatar w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                                {user?.firstName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Points Section */}
                    <div className="border-b border-gray-200 px-4 py-3 bg-gradient-to-r from-orange-50 to-yellow-50">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Points Balance</span>
                            <span className="text-xl font-bold text-orange-600">0 pts</span>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <button
                            onClick={() => handleNavigation('/profile')}
                            className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left"
                        >
                            <FaUser className="text-orange-500" />
                            <span>My Profile</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('/purchase-history')}
                            className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left"
                        >
                            <MdHistory className="text-orange-500 text-lg" />
                            <span>Purchase History</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('/cart')}
                            className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left"
                        >
                            <MdShoppingCart className="text-orange-500 text-lg" />
                            <span>Shopping Cart</span>
                        </button>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-200 p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 font-semibold text-left rounded"
                        >
                            <MdLogout className="text-lg" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Click outside to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
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

function account() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const navigate = useNavigate();

    // Check if user is logged in
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    const handleAccountClick = () => {
        if (user) {
            // Don't navigate, let dropdown handle it
            return;
        } else {
            setIsLoginOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* NAVBAR */}
            <nav className="w-full bg-orange-500 py-5 px-6 md:px-10 shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex-shrink-0">
                        <img src={logo} alt="Logo" className="h-12 w-auto cursor-pointer" />
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex flex-1 justify-center items-center gap-5 text-white font-medium text-sm lg:text-base">
                        <Link to="/pc-stores" className="hover:text-orange-200 transition-colors px-4 py-2">PC STORE</Link>
                        <Link to="/laptops" className="hover:text-orange-200 transition-colors px-4 py-2">LAPTOPS</Link>
                        <Link to="/components" className="hover:text-orange-200 transition-colors px-4 py-2">NETWORKING</Link>
                        <Link to="/servers" className="hover:text-orange-200 transition-colors px-4 py-2">SERVERS</Link>
                        <Link to="/ai-build" className="hover:text-orange-200 transition-colors px-4 py-2">AI BUILD</Link>
                    </div>

                    {/* Account Button / Profile Dropdown - UPDATED */}
                    <div className="hidden md:block flex-shrink-0">
                        {user ? (
                            <ProfileDropdown user={user} />
                        ) : (
                            <button
                                onClick={handleAccountClick}
                                className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors"
                            >
                                <FaUser className="text-sm" />
                                <span>Account</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
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
                            <button
                                className="mt-6 mx-auto flex items-center gap-2 bg-white text-orange-500 font-semibold px-8 py-3 rounded hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setIsNavOpen(false);
                                    if (!user) setIsLoginOpen(true);
                                }}
                            >
                                <FaUser className="text-sm" />
                                <span>{user ? `${user.firstName}'s Profile` : 'Account'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="text-center max-w-3xl mx-auto">
                    <IoMdWarning className="text-orange-500 text-8xl mx-auto mb-4" />
                    <p className="text-xl text-red-600 font-semibold">UNDER MAINTENANCE</p>
                    <p className="text-xl text-red-600 font-semibold">UNDER MAINTENANCE</p>
                    <p className="text-xl text-red-600 font-semibold">UNDER MAINTENANCE</p>
                    <p className="text-xl text-red-600 font-semibold">UNDER MAINTENANCE</p>
                    <p className="text-xl text-red-600 font-semibold">UNDER MAINTENANCE</p>
                    <p className="text-xl text-red-600 font-semibold">UNDER MAINTENANCE</p>
                    <p className="text-xl text-red-600 font-semibold">UNDER MAINTENANCE</p>
                    <p className="text-xl text-red-600 font-semibold">UNDER MAINTENANCE</p>
                    <p className="text-xl text-red-600 font-semibold">UNDER MAINTENANCE</p>
                </div>
            </main>
            <Footer />
            <div className="fixed bottom-6 right-6 z-50 cursor-pointer hover:scale-105 transition-transform">
                <div className="relative w-24 h-24">
                    <button
                        className="w-18 h-18 rounded-full overflow-hidden border-4 border-gray-700 bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                        onClick={() => navigate('/map')}
                    >
                        <TbMapPinFilled className="text-black text-5xl" />
                    </button>
                </div>
            </div>

            {/* MODALS */}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                }}
            />
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSwitchToLogin={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                }}
            />
        </div>
    );
}

export default account;
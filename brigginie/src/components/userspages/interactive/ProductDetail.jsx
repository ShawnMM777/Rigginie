import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { authAPI, clearAuthData, getUser, cartAPI, productAPI, pointsAPI, PCSpecs } from '../../../services/api';
import logo from '../../../assets/logo.png';
import gcash from '../../../assets/gcash.png';
import paypal from '../../../assets/paypal.png';
import visa from '../../../assets/visa.png';
import maya from '../../../assets/maya.png';
import homecredit from '../../../assets/homecredit.png';
import mastercard from '../../../assets/mastercard.png';
import usdt from '../../../assets/usdt.png';
import ethereum from '../../../assets/ethereum.png';
import xmr from '../../../assets/xmr.png';
import btc from '../../../assets/btc.png';
import Searchengine from '../../../components/userspages/interactive/searchbar';
import { FaThreads } from 'react-icons/fa6';
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser } from 'react-icons/fa';
import { MdLogout, MdHistory, MdShoppingCart, MdVerified } from 'react-icons/md';
import { TbShieldCheck, TbTruckDelivery } from 'react-icons/tb';
import { GiTwoCoins } from 'react-icons/gi';
import { fallbackProductImage, remoteProductImage } from '../../../services/productImages';

const CATEGORY_LABELS = {
    GPU: 'Graphics Card', CPU: 'Processor', MB: 'Motherboard', RAM: 'Memory',
    SSD: 'SSD Storage', HDD: 'HDD Storage', PSU: 'Power Supply', CASE: 'Case',
    COOL: 'Cooling', PERI: 'Peripherals',
};
const BRANCHES = {
    ALL: 'ALL BRANCHES', PasigMain: 'Pasig City Main Branch', QC: 'Quezon City Branch', MALABON: 'Malabon Branch', PARAÑAQUE: 'PARAÑAQUE BRANCH', TAGUIG: 'Taguig Branch', PASAY: 'Pasay Branch', CEBU: 'Cebu City Branch'
};

function Toast({ message }) {
    if (!message) return null;
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl">
            {message}
        </div>
    );
}

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = getUser();
    const [product, setProduct] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [cart, setCart] = useState(null);
    const [toast, setToast] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [hardwareTab, setHardwareTab] = useState('hardware');
    const [hardwarenameTab, setHardwarenameTab] = useState('hardwarename')
    const [added, setAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [brokenImages, setBrokenImages] = useState({});

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500); }
    

    useEffect(() => { productAPI.getAll() .then((res) => { 
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
                const found = data.find((p) => String(p.id) === String(id));
                if (found) setProduct(found);
                else setNotFound(true);
            })
            .catch((err) => {
                const detail = err.response
                    ? `HTTP ${err.response.status}: ${err.response.statusText || 'error'}`
                    : err.request
                        ? 'No response received (network or CORS issue)'
                        : err.message;
                setFetchError(detail);
                setNotFound(true);
            });
        if (user) { cartAPI.getCart().then((res) => setCart(res.data)).catch(() => { }); }
    }, [id]);

    const handleCartUpdated = (updatedCart) => setCart(updatedCart);

    const handleAdd = async () => {
        if (!user) { navigate('/login'); return; }
        setLoading(true);
        try {
            const res = await cartAPI.addItem(product.id, quantity);
            setAdded(true);
            handleCartUpdated(res.data);
            setTimeout(() => setAdded(false), 1500);
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to add to cart.');
        } finally {
            setLoading(false);
        }
    };

    if (notFound) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6">
                <p className="text-gray-400 text-sm">Product not found.</p>
                {fetchError && <p className="text-red-500 text-xs font-mono max-w-lg text-center bg-red-50 border border-red-200 rounded-lg px-4 py-3">{fetchError}</p>}
                <Link to="/" className="text-orange-500 font-semibold hover:underline">← Back to Home</Link>
            </div>
        );
    }
    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Loading product…</p>
            </div>
        );
    }

    const images = [product.mainimg, product.img1, product.img2, product.img3, product.img4, product.img5].filter(Boolean);
    const fallbackImage = fallbackProductImage(product);
    const resolveImage = (source, index) => {
        if (brokenImages[index]) return fallbackImage;
        return remoteProductImage(source);
    };
    const mainImage = resolveImage(images[activeImage], activeImage);
    const markImageBroken = (index) => setBrokenImages((previous) => ({ ...previous, [index]: true }));
    const inStock = product.stock === undefined || product.stock > 0;
    const maxQty = product.stock ?? 99;
    const PESOS_PER_POINT = 100;
    const pointsEarned = Math.floor((product.price * quantity) / PESOS_PER_POINT);

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
                        <img src={logo} alt="Logo" className="h-12 w-auto cursor-pointer" />
                    </button>
                    <div className="hidden md:block flex-1 min-w-0">
                        <Searchengine />
                    </div>
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
                            <button onClick={() => navigate('/login')} className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors">
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
                                <button onClick={() => { setIsNavOpen(false); navigate('/cart'); }} className="relative bg-white text-orange-500 p-3 rounded hover:bg-gray-100">
                                    <MdShoppingCart className="text-xl" />
                                    {cart?.item_count > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cart.item_count > 99 ? '99+' : cart.item_count}</span>)}
                                </button>
                                <button className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-8 py-3 rounded hover:bg-gray-100 cursor-pointer" onClick={() => { setIsNavOpen(false); user ? navigate('/profile') : navigate('/login'); }}>
                                    <FaUser className="text-sm" />
                                    <span>{user ? `${user.firstName}'s Profile` : 'Account'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
                    <div className="text-xs text-gray-500 mb-6">
                        <Link to="/" className="hover:text-orange-500">Home</Link>
                        <span className="mx-1.5">/</span>
                        <span className="text-gray-700">{CATEGORY_LABELS[product.category] || product.category}</span>
                        <span className="mx-1.5">/</span>
                        <span className="text-gray-900 font-medium">{product.name}</span>
                        <span className="mx-1.5">/</span>
                        <span>{BRANCHES[product.branches] || product.branches}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-7 flex gap-4">
                            <div className="flex flex-col gap-2">
                                {images.map((thumb, i) => {
                                    const thumbSrc = resolveImage(thumb, i);
                                    return (
                                        <button key={i} onClick={() => setActiveImage(i)} className={`w-16 h-16 rounded-lg border-2 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center ${activeImage === i ? 'border-orange-500' : 'border-gray-200'}`}>
                                            {thumbSrc ? <img src={thumbSrc} alt="" onError={() => markImageBroken(i)} className="w-full h-full object-contain p-1" /> : <span className="text-xl">🎮</span>}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl h-[420px] flex items-center justify-center overflow-hidden">
                                {mainImage ? <img src={mainImage} alt={product.name} onError={() => markImageBroken(activeImage)} className="w-full h-full object-contain p-8" /> : <span className="text-8xl select-none">🎮</span>}
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="text-xs font-bold text-gray-500 uppercase">Available Branch:</span>
                                <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">{BRANCHES[product.branches] || product.branches || 'N/A'}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="text-xs font-bold text-gray-500 uppercase">Category:</span>
                                <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">{CATEGORY_LABELS[product.category] || product.category}</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">{product.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 pb-5 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-xs text-gray-600"><TbShieldCheck className="text-xl text-orange-500" />Warranty Included</div>
                                <div className="flex items-center gap-2 text-xs text-gray-600"><TbTruckDelivery className="text-xl text-orange-500" />Metro Manila Delivery</div>
                                <div className="flex items-center gap-2 text-xs text-gray-600"><MdVerified className="text-xl text-orange-500" />Quality Checked</div>
                            </div>
                            <p className="text-3xl font-bold text-orange-500 mt-5">₱ {Number(product.price).toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Earn {pointsEarned} pts on this purchase</p>
                            <p className={`text-sm font-semibold mt-1 ${inStock ? 'text-green-600' : 'text-red-500'}`}>{inStock ? 'In Stock' : 'Out of Stock'}</p>
                            <div className="flex items-center gap-4 mt-6">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:text-orange-500">−</button>
                                    <span className="px-4 py-2 text-sm font-semibold">{quantity}</span>
                                    <button onClick={() => setQuantity((q) => Math.min(q + 1, maxQty))} className="px-3 py-2 text-gray-600 hover:text-orange-500">+</button>
                                </div>
                                <button onClick={handleAdd} disabled={loading || !inStock} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 ${added ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-orange-500'}`}>
                                    {loading ? 'Adding…' : added ? '✓ Added to Cart' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16">
                        <div className="flex gap-8 border-b border-gray-200">
                            {['description', 'specs', 'reviews'].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-semibold capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="py-8 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {activeTab === 'description' && (product.description || 'No description available for this product yet.')}
                            {activeTab === 'specs' && (
                                product.specifications?.length ? (
                                    <dl className="divide-y divide-gray-100 whitespace-normal">
                                        {product.specifications.map((spec) => (
                                            <div key={spec.hardware} className="flex justify-between py-3">
                                                <dt className="text-gray-500">{spec.hardware}</dt>
                                                <dd className="font-medium text-gray-900">{spec.hardwarename}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                ) : 'No specifications available.'
                            )}
                            {activeTab === 'reviews' && 'No reviews yet.'}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <Toast message={toast} />
        </div>
    );
}

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-10 border-t-4 border-orange-500 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-center">
                        <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-orange-400 transition-colors">Support & Warranty</a></li>
                        <li><a href="#" className="hover:text-orange-400 transition-colors">Mission & Vision</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Contact Us</h3>
                    <ul className="space-y-2 text-sm text-gray-400 text-center">
                        <li>Email: rigginieph@email.com</li>
                        <li>Phone: +63 09919883132</li>
                        <li>Location: Pasig, Metro Manila</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Join Our Community</h3>
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
                    <h3 className="text-lg font-semibold text-white mb-3 text-center">Payment Methods</h3>
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
            <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-800 text-sm text-gray-500">
                © {new Date().getFullYear()} Rigginie PH. All rights reserved.
            </div>
        </footer>
    );
}

function ProfileDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState(user?.picture || '');
    const [profilePictureError, setProfilePictureError] = useState(false);
    const navigate = useNavigate();
    const handleLogout = async () => { try { await authAPI.logout(localStorage.getItem('refresh_token')); } catch (err) { console.log('Logout error:', err); } finally { clearAuthData(); setIsOpen(false); window.location.href = '/'; } };
    const handleNavigation = (path) => { navigate(path); setIsOpen(false); };
    useEffect(() => { pointsAPI.getBalance().then(res => setBalance(res.data.points)).catch(err => { console.error(err); setBalance(0); }).finally(() => setLoading(false)); }, []);
    
    const profilePictureUrl = profilePicture && (profilePicture.startsWith('http') ? profilePicture : `http://localhost:8000${profilePicture}`);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors">
                <FaUser className="text-sm" />
                <span>{user?.firstName || 'Account'}</span>
                <span className="text-xl">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
                    <div className="bg-orange-50 border-b border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                        <div data-role={user?.usertype || user?.userType || user?.user_type || user?.role || 'enthusiast'} className="profile-role-avatar flex h-12 w-12 items-center justify-center overflow-hidden rounded-full font-bold text-white">
                                {profilePictureUrl && !profilePictureError ? <img src={profilePictureUrl} alt="Profile" onError={() => setProfilePictureError(true)} className="h-full w-full object-cover" /> : user?.firstName?.charAt(0).toUpperCase() || <FaUser />}
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
                            <span className="text-xl font-bold text-orange-600">{loading ? '...' : `${balance} pts`}</span>
                        </div>
                    </div>
                    <div className="py-2">
                        <button onClick={() => handleNavigation('/profile')} className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left"><FaUser className="text-orange-500" /><span>My Profile</span></button>
                        <button onClick={() => handleNavigation('/purchase-history')} className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left"><MdHistory className="text-orange-500 text-lg" /><span>Purchase History</span></button>
                        <button onClick={() => handleNavigation('/cart')} className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left"><MdShoppingCart className="text-orange-500 text-lg" /><span>Shopping Cart</span></button>
                        <button onClick={() => handleNavigation('/cart')} className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left"><GiTwoCoins className="text-orange-500 text-lg" /><span>Points Shop</span></button>
                    </div>
                    <div className="border-t border-gray-200 p-2">
                        <button onClick={handleLogout} className="w-full px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 font-semibold text-left rounded"><MdLogout className="text-lg" /><span>Logout</span></button>
                    </div>
                </div>
            )}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
        </div>
    );
}

export default ProductDetail;
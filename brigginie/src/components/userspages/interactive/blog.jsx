import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { authAPI, clearAuthData, getUser, cartAPI } from '../../../services/api';
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
import ryzen from '../../../assets/amdseries.png';
import nvidia from '../../../assets/nvidia.png';

import { FaThreads } from 'react-icons/fa6';
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser } from 'react-icons/fa';
import { TbMapPinFilled } from 'react-icons/tb';
import { MdLogout, MdHistory, MdShoppingCart } from 'react-icons/md';
import { Newspaper, TrendingUp, TrendingDown, Cpu, Headphones, Server, Laptop, Clock, ArrowRight } from 'lucide-react'; 

const PRICE_OVERVIEW = [
  { category: 'Components', icon: Cpu, range: '₱2,500 – ₱250,000', trend: 'down', change: '3.2%', link: '/pc-stores' },
  { category: 'Peripherals', icon: Headphones, range: '₱500 – ₱15,000', trend: 'up', change: '1.5%', link: '/components' },
  { category: 'Servers', icon: Server, range: '₱45,000 – ₱500,000', trend: 'up', change: '4.8%', link: '/servers' },
  { category: 'Laptops', icon: Laptop, range: '₱25,000 – ₱180,000', trend: 'down', change: '2.1%', link: '/laptops' },
];
const ARTICLES = [
  {
    id: 1, topic: 'PC Components', tag: 'Price Update', featured: true,
    title: 'RTX 5000 and RX 9000 GPUs: Where Prices Stand This Month',
    excerpt: 'We track current graphics card pricing, stock movement, and the value sweet spots for 1080p, 1440p, and creator-focused builds in the Philippines.',
    date: 'Aug 28, 2026', readTime: '4 min read', color: 'from-green-950 to-gray-900',
  },
  {
    id: 2, topic: 'PC Components', tag: 'Price Update',
    title: 'DDR5 Memory Pricing: How Much RAM Should Your Next Build Have?',
    excerpt: 'With DDR5 kits spanning more capacities and speeds, we compare practical 16GB, 32GB, and 64GB upgrade paths for gamers and creators.',
    date: 'Aug 24, 2026', readTime: '3 min read', color: 'from-blue-950 to-gray-900',
  },
  {
    id: 3, topic: 'PC Components', tag: 'Guide',
    title: 'Best Component Pairings for Budget Builds Under ₱50,000',
    excerpt: 'From entry-level esports rigs to 1080p high-refresh builds, here is how to balance your CPU, GPU, storage, and power supply budget.',
    date: 'Aug 21, 2026', readTime: '6 min read', color: 'from-orange-950 to-gray-900',
  },
  {
    id: 4, topic: 'PC Components', tag: 'News',
    title: 'PCIe 5.0 Storage Moves Into More Mid-Range PC Builds',
    excerpt: 'Faster SSDs are becoming easier to find across new desktops. We explain thermals, real-world gains, and when PCIe 4.0 remains the smarter buy.',
    date: 'Aug 18, 2026', readTime: '5 min read', color: 'from-slate-800 to-gray-900',
  },
  {
    id: 5, topic: 'Laptops', tag: 'Guide',
    title: 'The 2026 Laptop Buying Guide for Students and Creators',
    excerpt: 'Color accuracy, sustained performance, battery life, and repairability: the details that matter when choosing a laptop for work or school.',
    date: 'Aug 15, 2026', readTime: '5 min read', color: 'from-purple-950 to-gray-900',
  },
  {
    id: 6, topic: 'Peripherals', tag: 'Guide',
    title: 'Peripherals Roundup: The Best Mechanical Keyboards Under ₱5,000',
    excerpt: 'Hot-swappable switches, wireless connectivity, and compact layouts are no longer premium-only features. These are the details worth checking.',
    date: 'Aug 11, 2026', readTime: '4 min read', color: 'from-red-950 to-gray-900',
  },
  {
    id: 7, topic: 'Peripherals', tag: 'News',
    title: 'Wireless Peripherals Are Getting Better Without the Premium',
    excerpt: 'Lower-latency mice, keyboards, and headsets are changing the everyday desk setup. We look at battery life, connectivity, and value.',
    date: 'Aug 08, 2026', readTime: '7 min read', color: 'from-green-950 to-gray-900',
  },
  {
    id: 8, topic: 'Laptops', tag: 'Price Update',
    title: 'Laptop Prices Settle: Where the Best Value Is in 2026',
    excerpt: 'We compare entry, mid-range, and creator laptop pricing so you can spend on the features that will make a difference every day.',
    date: 'Aug 03, 2026', readTime: '3 min read', color: 'from-amber-950 to-gray-900',
  },
];

const CATEGORIES = ['All', 'News', 'Price Update', 'Guide'];
const TOPICS = ['All', 'PC Components', 'Peripherals', 'Laptops'];

function Blog() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTag, setActiveTag] = useState('All');
  const [activeTopic, setActiveTopic] = useState('All');
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (user) {
      cartAPI.getCart().then((res) => setCart(res.data)).catch(() => { });
    }
  }, []);

  const filtered = ARTICLES.filter((article) =>
    (activeTag === 'All' || article.tag === activeTag) &&
    (activeTopic === 'All' || article.topic === activeTopic)
  );
  const featured = ARTICLES.find((a) => a.featured);
  const rest = filtered.filter((a) => !a.featured || activeTag !== 'All');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="w-full bg-black py-1 px-2 flex justify-end items-center gap-x-3">
        <button className="text-white border-2 border-white bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-sm font-medium rounded-sm px-3 py-1 transition"
          onClick={() => navigate('/forum')}>FORUM</button>
        <a onClick={() => navigate('/help')} className="font-medium hover:underline text-amber-100 cursor-pointer">Help & Support</a>
        <a onClick={() => navigate('/blog')} className="font-medium hover:underline text-amber-100 cursor-pointer">Blog</a>
        <a onClick={() => navigate('/survey')} className="font-medium hover:underline text-amber-100 cursor-pointer">Survey</a>
      </nav>

      <nav className="w-full bg-orange-500 py-5 px-7 md:px-10 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex-shrink-0">
            <img src={logo} alt="Logo" className="h-12 w-auto cursor-pointer" />
          </button>
          <div className="hidden md:flex flex-1 justify-center items-center gap-5 text-white font-medium text-sm lg:text-base">
            <Link to="/pc-stores" className="hover:text-orange-200 transition-colors px-4 py-2">PC STORE</Link>
            <Link to="/laptops" className="hover:text-orange-200 transition-colors px-4 py-2">LAPTOPS</Link>
            <Link to="/components" className="hover:text-orange-200 transition-colors px-4 py-2">NETWORKING</Link>
            <Link to="/servers" className="hover:text-orange-200 transition-colors px-4 py-2">SERVERS</Link>
            <Link to="/ai-build" className="hover:text-orange-200 transition-colors px-4 py-2">AI BUILD</Link>
          </div>
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <button onClick={() => navigate('/cart')}
              className="relative bg-white text-orange-500 p-3 rounded hover:bg-gray-100 transition-colors">
              <MdShoppingCart className="text-xl" />
              {cart?.item_count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.item_count > 99 ? '99+' : cart.item_count}
                </span>
              )}
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

      <main className="flex-1">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-orange-900 text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 text-center">
            <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
              <Newspaper size={12} /> Rigginie Blog
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">PC News & Price Updates</h1>
            <p className="text-gray-400 mt-3 text-sm md:text-base max-w-xl mx-auto">Component pricing, product launches, and buying guides — updated regularly for the Philippine market. </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">

          {/* Price overview */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-6 bg-orange-500 rounded-full" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Price Overview</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PRICE_OVERVIEW.map((p) => {const Icon = p.icon;const TrendIcon = p.trend === 'up' ? TrendingUp : TrendingDown;
              const trendColor = p.trend === 'up' ? 'text-red-500' : 'text-green-600';
                return (
                  <Link key={p.category} to={p.link}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                        <Icon size={16} className="text-orange-500" />
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-bold ${trendColor}`}>
                        <TrendIcon size={12} /> {p.change}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-800">{p.category}</p>
                    <p className="text-xs text-gray-500 mt-1">{p.range}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {TOPICS.map((topic) => (
              <button key={topic} onClick={() => setActiveTopic(topic)} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTopic === topic ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {topic}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-6 overflow-x-auto">
            {CATEGORIES.map((c) => (
            <button key={c}onClick={() => setActiveTag(c)}className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTag === c ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`} >
                {c} </button>
            ))}
          </div>

          {/* Featured article */}
          {activeTag === 'All' && featured && (
            <Link to="#" className="block mb-8 group">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 md:flex">
                <div className={`bg-gradient-to-br ${featured.color} h-48 md:h-auto md:w-2/5 flex items-center justify-center relative overflow-hidden flex-shrink-0`}>
                  < img src={ryzen} alt={featured.title} className="text-white opacity-20 h-[20vh]" />
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    Featured · {featured.tag}
                  </span>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    <span>{featured.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-orange-500 font-semibold text-sm mt-4 group-hover:gap-2 transition-all">Read more <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Article grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(activeTag === 'All' ? rest.filter((a) => !a.featured) : rest).map((article) => (
              <Link key={article.id} to="#" className="group">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                  <div className={`bg-gradient-to-br ${article.color} h-36 flex items-center justify-center relative overflow-hidden`}>
                    <img src={nvidia} alt={article.title} className="text-white opacity-20 h-full w-full object-cover" />
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                      {article.tag}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{article.excerpt}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span>{article.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-16">No articles in this category yet.</p>
          )}
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
            {user?.role === 'admin' && (
              <button onClick={() => handleNavigation('/admin')}
                className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left">
                <FaUser className="text-orange-500" /><span>Admin Dashboard</span>
              </button>
            )}
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

export default Blog;
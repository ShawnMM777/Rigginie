import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { authAPI, storeAuthData, getUser, homePathForRole, clearAuthData } from '../../../services/api';
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

import { FaThreads, FaApple, FaGoogle } from 'react-icons/fa6';
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { TbMapPinFilled } from 'react-icons/tb';
import { MdLogout, MdHistory, MdShoppingCart } from 'react-icons/md';


function Login() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [cartCount] = useState(0);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const googleButtonRef = useRef(null);
  const navigate = useNavigate();
  const user = getUser();
  const inputClassName = 'w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 shadow-sm outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10';
  useEffect(() => { if (user) navigate(homePathForRole(user.role)); }, [user, navigate]);
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const initializeGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          setLoginError('');
          setLoginLoading(true);
          try {
            const res = await authAPI.googleLogin(credential);
            storeAuthData(res.data.access, res.data.user, res.data.refresh);
            window.location.href = homePathForRole(res.data.user.role);
          } catch (err) {
            setLoginError(err.response?.data?.message || 'Google sign-in failed.');
          } finally {
            setLoginLoading(false);
          }
        },
      });
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 280,
          text: 'signin_with',
        });
      }
    };

    if (window.google?.accounts?.id) initializeGoogle();
    else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = initializeGoogle;
      script.onerror = () => setLoginError('Google sign-in could not load. Check your internet connection or browser extensions.');
      document.head.appendChild(script);
    }
  }, []);

  const handleSocialLogin = (provider) => {
    setLoginError(`${provider} sign-in is not available yet. Please use your email and password.`);
  };
  const handleLogin = async (e) => { e.preventDefault(); setLoginError(''); if (!loginEmail || !loginPassword) { setLoginError('Please fill in all fields.'); return; } setLoginLoading(true); try { const res = await authAPI.login({ email: loginEmail, password: loginPassword }); storeAuthData(res.data.access, res.data.user, res.data.refresh); window.location.href = homePathForRole(res.data.user.role); } catch (err) { setLoginError( err.response?.data?.message || err.response?.data?.detail || 'Invalid email or password.' ); } finally { setLoginLoading(false); } };

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
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
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
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
                <button className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-8 py-3 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => { setIsNavOpen(false); user ? navigate('/profile') : navigate('/Register'); }}>
                  <FaUser className="text-sm" />
                  <span>{user ? `${user.firstName}'s Profile` : 'Account'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 px-7 py-20">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <div className="bg-orange-500 px-8 py-7 text-center">
            <img src={logo} alt="Rigginie PH" className="h-12 w-auto mx-auto" />
            <h1 className="text-2xl font-bold text-white mt-4">Welcome back</h1>
            <p className="text-orange-100 mt-1 text-sm">Sign in to continue shopping with Rigginie PH.</p>
          </div>

          <div className="px-8 pt-6">
            <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-1" role="tablist" aria-label="Account access">
              <button type="button" role="tab" aria-selected="true" className="rounded-md bg-white py-2 text-sm font-bold text-orange-600 shadow-sm transition-all">
                Login
              </button>
              <button type="button" role="tab" aria-selected="false" onClick={() => navigate('/Register')} className="rounded-md py-2 text-sm font-semibold text-gray-500 hover:bg-white/70 hover:text-orange-600 transition-all">
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="px-8 py-8 space-y-5 text-center">
            {loginError && (
              <div role="alert" className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {loginError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative h-12 w-full" aria-label="Sign in with Google">
                <div className="pointer-events-none flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold shadow-sm">
                  <FaGoogle className="text-[#4285F4]" aria-hidden="true" />
                  <span>Google / Gmail</span>
                </div>
                <div ref={googleButtonRef} className="absolute inset-0 z-10 h-12 w-full overflow-hidden opacity-0" />
              </div>
              <button type="button" onClick={() => handleSocialLogin('Apple')} className="flex items-center justify-center gap-2 h-12 bg-gray-950 text-white font-semibold rounded-xl shadow-sm hover:-translate-y-0.5 hover:bg-black hover:shadow-md focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all">
                <FaApple aria-hidden="true" />
                <span>Apple account</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400 uppercase tracking-wider">
              <span className="h-px flex-1 bg-gray-200" />
              <span>or use email</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" className={inputClassName}/>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type={showLoginPass ? "text" : "password"} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" className={`${inputClassName} pr-12`} />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition"
                >
                  {showLoginPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500" />
                Remember me
              </label>
              <a onClick={() => navigate('/ForgotPassword')} className="text-orange-600 hover:text-orange-700 font-medium cursor-pointer transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 hover:-translate-y-0.5 disabled:bg-orange-300 disabled:hover:translate-y-0 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </main>

      <Footer />

      {/* Map button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-700 bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow hover:scale-105"
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

export default Login;
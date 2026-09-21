import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { authAPI, clearAuthData, getUser, cartAPI, productAPI, pointsAPI } from '../../../services/api';
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
import gigabyte from '../../../assets/gigabyte.png';
import dell from '../../../assets/dell.png';
import asus from '../../../assets/asus.png';
import acer from '../../../assets/acer.png';
import apple from '../../../assets/apple.png';
import lenovo from '../../../assets/lenovo.png';
import btc from '../../../assets/btc.png';
import RTX5070 from '../../../assets/products/GRAPHICS CARD/2.png';
import PROART5090 from '../../../assets/products/GRAPHICS CARD/4.png'
import Searchengine from '../../../components/userspages/interactive/searchbar';
import { FaThreads } from 'react-icons/fa6';
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser, FaRobot, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { TbMapPinFilled } from 'react-icons/tb';
import { MdLogout, MdHistory, MdShoppingCart } from 'react-icons/md';
import { HiPlus } from 'react-icons/hi';
import { GiTwoCoins } from "react-icons/gi";
import { fallbackProductImage, remoteProductImage } from '../../../services/productImages';

const CATEGORY_LABELS = {
    GPU: 'Graphics Card', CPU: 'Processor', MB: 'Motherboard', RAM: 'Memory',
    SSD: 'SSD Storage', HDD: 'HDD Storage', PSU: 'Power Supply', CASE: 'Case',
    COOL: 'Cooling', PERI: 'Peripherals', LAP: 'Laptop',
};
//LAPTOP MENU
const laptopMenu = {
    categories: [
        { label: 'Browse all laptops', to: '/laptops', key: 'all' },
        { label: 'For gaming', to: '/category/gaming_laptop', key: 'gaming' },
        { label: 'For work and study', to: '/category/working', key: 'working' },
        { label: 'Thin and light', to: '/category/ultrabook', key: 'ultrabook' },
        { label: '2-in-1 laptops', to: '/category/2-in-1', key: 'twoInOne' },
        { label: 'Chromebooks', to: '/category/chromebook', key: 'chromebook' },
    ],
    families: {
        all: [
            { label: 'Every laptop', to: '/laptops' },
        ],
        gaming: [
            { label: 'Aorus', to: '/laptops' },
            { label: 'ROG Strix', to: '/laptops' },
            { label: 'Predator', to: '/laptops' },
            { label: 'Alienware', to: '/laptops' },
            { label: 'TUF Gaming', to: '/laptops' },
        ],
        working: [
            { label: 'ThinkPad', to: '/laptops' },
            { label: 'MacBook', to: '/laptops/apple' },
            { label: 'ASUS ExpertBook', to: '/laptops' },
            { label: 'Dell Latitude', to: '/laptops' },
            { label: 'Lenovo ThinkBook', to: '/laptops' },
        ],
        ultrabook: [
            { label: 'MacBook Air', to: '/laptops/apple' },
            { label: 'Dell XPS', to: '/laptops' },
            { label: 'ASUS Zenbook', to: '/laptops' },
            { label: 'HP Spectre', to: '/laptops' },
            { label: 'Acer Swift', to: '/laptops' },
        ],
        twoInOne: [
            { label: 'Microsoft Surface', to: '/laptops' },
            { label: 'Lenovo Yoga', to: '/laptops' },
            { label: 'HP Envy x360', to: '/laptops' },
            { label: 'Acer Spin', to: '/laptops' },
        ],
        chromebook: [
            { label: 'Acer Chromebook', to: '/laptops' },
            { label: 'Google Chromebook', to: '/laptops' },
            { label: 'Lenovo IdeaPad', to: '/laptops' },
        ],
    },
};
//PC SYSTEMS MENU 
const pcSystemsMenu = {
    categories: [
        { key: 'gaming', label: 'Gaming PCs', to: '/category/gaming-pc' },
        { key: 'workstation', label: 'Powerful work PCs', to: '/category/workstation-pc' },
        { key: 'home', label: 'Home and office PCs', to: '/category/home-pc' },
        { key: 'mini', label: 'Small-space PCs', to: '/category/mini-pc' },
    ],
    families: {
        gaming: [
            { label: 'Budget Gaming Builds', to: '/category/gaming-pc-budget' },
            { label: 'Mid-Range Gaming Builds', to: '/category/gaming-pc-midrange' },
            { label: 'High-End Gaming Builds', to: '/category/gaming-pc-highend' },
            { label: 'RGB & Show Builds', to: '/category/gaming-pc-rgb' },
        ],
        workstation: [
            { label: 'Content Creation PCs', to: '/category/workstation-content' },
            { label: 'CAD & 3D Rendering PCs', to: '/category/workstation-cad' },
            { label: 'AI & Data Science PCs', to: '/category/workstation-ai' },
        ],
        home: [
            { label: 'Everyday Home PCs', to: '/category/home-everyday' },
            { label: 'Office & Productivity PCs', to: '/category/home-office' },
        ],
        mini: [
            { label: 'Compact Desktop PCs', to: '/category/mini-compact' },
            { label: 'HTPC & Media Center PCs', to: '/category/mini-htpc' },
        ],
    },
};
const HARDWARE = {
    ROUTER: 'Wi-Fi routers', SWITCH: 'Network switches', MODEM: 'Modems', HUB: 'USB and network hubs', MBD: 'Motherboards',
};

const serversMenu = {
    columns: [
        {
            title: 'By Form Factor', links: [
                { label: 'Rack Servers', to: '/category/server-rack' },
                { label: 'Tower Servers', to: '/category/server-tower' },
                { label: 'Blade Servers', to: '/category/server-blade' },
            ]
        },
        {
            title: 'By Use Case', links: [
                { label: 'Storage & NAS Servers', to: '/category/server-storage' },
                { label: 'Hosting & Virtualization', to: '/category/server-hosting' },
                { label: 'Server Components', to: '/category/server-components' },
            ]
        },
    ],
};
function Toast({ message }) {
    if (!message) return null;
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl">
            {message}
        </div>
    );
}
const slidepage = [
    {
        id: 1,
        title: "RTX 5070 FOR BEAST IN YOUR FAVORITE TRIPPLE A GAMES",
        cta: "SHOP GPU",
        ctaLink: 'graphicscardcategories',
        img: RTX5070,
        bg: "bg-black",
    },
    {
        id: 2,
        title: "MAKE BEUTIFUL AND SMOOTH EDITING",
        cta: "SHOP GPU",
        ctaLink: 'graphicscardcategories',
        img: PROART5090,
        bg: "bg-black",
    },
]

function Frontpage() {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(0);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isLaptopMenuOpen, setIsLaptopMenuOpen] = useState(false);
    const [isPcSystemsMenuOpen, setIsPcSystemsMenuOpen] = useState(false);
    const [isNetworkingMenuOpen, setIsNetworkingMenuOpen] = useState(false);
    const [isServersMenuOpen, setIsServersMenuOpen] = useState(false);
    const [activeLaptopCategory, setActiveLaptopCategory] = useState('gaming');
    const [activePcSystemsCategory, setActivePcSystemsCategory] = useState('all');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState(null);
    const [toast, setToast] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [priceSort, setPriceSort] = useState('');
    const navigate = useNavigate();
    const user = getUser();
    const usertype = user?.usertype || user?.user_type || 'working';
    const gpuProducts = products.filter((p) => p.category === 'GPU');
    const laptops = products.filter((p) => p.category === 'LAP');
    const recommendedProducts = products
        .filter((product) => product.recommended_for === usertype)
        .filter((product) => !minPrice || Number(product.price) >= Number(minPrice))
        .filter((product) => !maxPrice || Number(product.price) <= Number(maxPrice))
        .sort((first, second) => {
            if (priceSort === 'low-to-high') return Number(first.price) - Number(second.price);
            if (priceSort === 'high-to-low') return Number(second.price) - Number(first.price);
            return 0;
        });
    const recommendedByCategory = recommendedProducts.reduce((groups, product) => {
        const category = product.category || 'Other';
        groups[category] = groups[category] || [];
        groups[category].push(product);
        return groups;
    }, {});


    const menuItems = [{ label: 'Map', icon: <TbMapPinFilled className="text-2xl" />, onClick: () => navigate('/map') }, { label: 'Shilja Chatbot', icon: <FaRobot className="text-2xl" />, onClick: () => navigate('/chatbot') }];
    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500); }
    useEffect(() => { productAPI.getAll().then((res) => setProducts(res.data)).catch(() => showToast('Failed to load products.')); if (user) { cartAPI.getCart().then((res) => setCart(res.data)).catch(() => { }); } }, []);
    useEffect(() => { const timer = setInterval(() => { setCurrent((prev) => (prev + 1) % slidepage.length); }, 5000); return () => clearInterval(timer); }, []);
    const prev = () => setCurrent((c) => (c === 0 ? slidepage.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c + 1) % slidepage.length);
    const handleCartUpdated = (updatedCart) => setCart(updatedCart);
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="w-full bg-gray-950 px-5 py-2 text-xs text-gray-300">
                <div className="max-w-7xl mx-auto flex justify-end items-center gap-5">
                    <a onClick={() => navigate('/forum')} className="hover:text-orange-400 cursor-pointer transition-colors">Forum</a>
                    <a onClick={() => navigate('/help')} className="hover:text-orange-400 cursor-pointer transition-colors">Help & Support</a>
                    <a onClick={() => navigate('/blog')} className="hover:text-orange-400 cursor-pointer transition-colors">Blog</a>
                    <a onClick={() => navigate('/survey')} className="hover:text-orange-400 cursor-pointer transition-colors">Survey</a>
                </div>
            </nav>
            <nav className="relative w-full bg-orange-400 py-3 px-5 md:px-10 shadow-sm sticky top-0 z-40 border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-col gap-4">
                    <div className="flex items-center gap-4 md:gap-6">
                        <button onClick={() => navigate('/')} className="shrink-0">
                            <img src={logo} alt="Rigginie PH" className="h-11 w-auto cursor-pointer" />
                        </button>
                        <div className="hidden md:block flex-1 min-w-0">
                            <Searchengine />
                        </div>
                        <div className="hidden md:flex items-center gap-3 shrink-0 ml-auto">
                            {user ? <ProfileDropdown user={user} /> : (
                                <button onClick={() => navigate('/login')}
                                    className="rgb-button flex items-center gap-2 bg-orange-500 text-white font-semibold px-5 py-3 rounded-xl shadow-sm hover:-translate-y-0.5 transition-all">
                                    <FaUser className="text-sm" /><span>Account</span>
                                </button>
                            )}
                            <button onClick={() => navigate('/cart')} aria-label="Shopping cart" className="rgb-button relative bg-gray-100 text-gray-900 p-3 rounded-xl hover:bg-orange-50 hover:text-orange-500 transition-colors">
                                <MdShoppingCart className="text-xl" />{cart?.item_count > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cart.item_count > 99 ? '99+' : cart.item_count}</span>)}
                            </button>
                        </div>
                        <button onClick={() => setIsNavOpen(!isNavOpen)} aria-label="Toggle navigation" className="rgb-button md:hidden ml-auto rounded-lg p-1 text-4xl text-gray-900 focus:outline-none">
                            {isNavOpen ? '✕' : '☰'}
                        </button>
                    </div>
                    <div className="hidden md:flex items-center justify-center gap-6 text-amber-900 font-semibold text-sm lg:text-base antialised">

                    <div onMouseEnter={() => setIsPcSystemsMenuOpen(true)} onMouseLeave={() => setIsPcSystemsMenuOpen(false)}>
                        <button type="button" aria-expanded={isPcSystemsMenuOpen} aria-haspopup="true" onClick={() => setIsPcSystemsMenuOpen((isOpen) => !isOpen)} className={`relative py-2 transition-colors ${isPcSystemsMenuOpen ? 'text-sky-50' : 'hover:text-orange-500'}`}>PC SYSTEMS<span className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-orange-600 transition-transform ${isPcSystemsMenuOpen ? 'scale-x-100' : 'scale-x-0'}`} /></button>
                        {isPcSystemsMenuOpen && (
                            <div className="absolute left-1/2 top-full z-50 w-[calc(100vw-2rem)] max-w-7xl -translate-x-1/2 pt-4">
                                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-sm font-medium shadow-[0_18px_55px_rgba(17,24,39,0.2)]">
                                        <div className="flex items-center justify-between border-b border-gray-100 px-7 py-4">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500 transition">PC systems</p>
                                                <p className="mt-1 text-lg font-bold tracking-tight text-gray-950">A ready-to-use PC for the way you work and play</p>
                                            </div>
                                            <Link to="/pc-stores" className="rounded-full bg-gray-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-500">Shop all PC systems <span className="ml-1">→</span></Link>
                                        </div>
                                        <div className="grid max-h-[min(34rem,calc(100vh-12rem))] grid-cols-4 overflow-y-auto">
                                            <div className="bg-gray-50 p-5 text-gray-700">
                                                <p className="mb-4 border-b border-gray-200 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">What are you looking for?</p>
                                                <div className="space-y-1">
                                                    {pcSystemsMenu.categories.map((item) => (
                                                        <Link key={item.label} to={item.to} onMouseEnter={() => setActivePcSystemsCategory(item.key)} onFocus={() => setActivePcSystemsCategory(item.key)} className={`group flex items-center justify-between rounded-lg border-l-2 px-3 py-3 transition ${activePcSystemsCategory === item.key ? 'border-orange-500 bg-white text-orange-600 shadow-sm' : 'border-transparent hover:border-orange-300 hover:bg-white hover:text-orange-500'}`}>
                                                            <span>{item.label}</span><span className="text-lg text-gray-400 transition-transform group-hover:translate-x-1">›</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="border-r border-gray-100 p-6 text-gray-700">
                                                <p className="mb-4 border-b border-gray-100 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">{pcSystemsMenu.categories.find((item) => item.key === activePcSystemsCategory)?.label || 'PC System types'}</p>
                                                <div className="space-y-1">
                                                    {(pcSystemsMenu.families[activePcSystemsCategory] || []).map((item) => (
                                                        <Link key={item.label} to={item.to} className="group flex items-center rounded-lg px-3 py-3 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"><span className="mr-3 h-1.5 w-1.5 rounded-full bg-orange-300 transition group-hover:bg-orange-500" />{item.label}</Link>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="border-r border-gray-100 p-6 text-gray-700">
                                                <p className="mb-4 border-b border-gray-100 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Built for</p>
                                                <div className="space-y-1">
                                                    {[
                                                        { label: 'Gaming', to: '/category/gaming-pc' },
                                                        { label: 'Streaming & Content Creation', to: '/category/workstation-content' },
                                                        { label: 'Office & Productivity', to: '/category/home-office' },
                                                        { label: 'AI & Data Science', to: '/category/workstation-ai' },
                                                    ].map((item) => (
                                                        <Link key={item.label} to={item.to} className="block rounded-lg px-3 py-3 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600">{item.label}</Link>
                                                    ))}
                                                </div>
                                                <Link to="/pc-stores" className="mt-5 block px-3 text-xs font-semibold text-orange-600 hover:text-orange-700">Explore every PC system →</Link>
                                            </div>
                                            <div className="bg-gray-950 p-6 text-white">
                                                <p className="mb-4 border-b border-gray-800 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-300">Why choose a ready-made PC?</p>
                                                <ul className="space-y-3 text-sm text-gray-300">
                                                    <li>Assembled & stress-tested before shipping</li>
                                                    <li>Full warranty on the whole system</li>
                                                    <li>Free upgrade consultation</li>
                                                </ul>
                                                <p className="mt-5 text-xs leading-relaxed text-gray-400">We make choosing your next PC easier.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                     
                        <div className="" onMouseEnter={() => setIsLaptopMenuOpen(true)} onMouseLeave={() => setIsLaptopMenuOpen(false)}>
                            <button type="button" aria-expanded={isLaptopMenuOpen} aria-haspopup="true" onClick={() => setIsLaptopMenuOpen((isOpen) => !isOpen)} className={`relative py-2 transition-colors ${isLaptopMenuOpen ? 'text-sky-50' : 'hover:text-orange-500'}`} >
                                LAPTOPS
                                <span className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-orange-600 transition-transform ${isLaptopMenuOpen ? 'scale-x-100' : 'scale-x-0'}`} />
                            </button>
                            {isLaptopMenuOpen && (
                                <div className="absolute left-1/2 top-full z-50 w-[calc(100vw-2rem)] max-w-7xl -translate-x-1/2 pt-4">
                                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-sm font-medium shadow-[0_18px_55px_rgba(17,24,39,0.2)]">
                                        <div className="flex items-center justify-between border-b border-gray-100 px-7 py-4">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500 transition ">Laptops</p>
                                                <p className="mt-1 text-lg font-bold tracking-tight text-gray-950">Find a laptop that fits your day</p>
                                            </div>
                                            <Link to="/laptops" className="rounded-full bg-gray-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-500">Shop all laptops <span className="ml-1">→</span></Link>
                                        </div>
                                        <div className="grid max-h-[min(34rem,calc(100vh-12rem))] grid-cols-4 overflow-y-auto">
                                        <div className="bg-gray-50 p-5 text-gray-700">
                                            <p className="mb-4 border-b border-gray-200 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Choose what suits you</p>
                                            <div className="space-y-1">
                                                {laptopMenu.categories.map((item) => (
                                                    <Link key={item.label} to={item.to} onMouseEnter={() => item.key && setActiveLaptopCategory(item.key)} onFocus={() => item.key && setActiveLaptopCategory(item.key)} className={`group flex items-center justify-between rounded-lg border-l-2 px-3 py-3 transition ${activeLaptopCategory === item.key ? 'border-orange-500 bg-white text-orange-600 shadow-sm' : 'border-transparent hover:border-orange-300 hover:bg-white hover:text-orange-500'}`}>
                                                        <span>{item.label}</span><span className="text-lg text-gray-400 transition-transform group-hover:translate-x-1">›</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="border-r border-gray-100 p-6 text-gray-700">
                                            <p className="mb-4 border-b border-gray-100 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">{laptopMenu.categories.find((item) => item.key === activeLaptopCategory)?.label || 'Laptop types'}</p>
                                            <div className="space-y-1">
                                                {(laptopMenu.families[activeLaptopCategory] || []).map((item) => (
                                                    <Link key={item.label} to={item.to} className="group flex items-center rounded-lg px-3 py-3 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"><span className="mr-3 h-1.5 w-1.5 rounded-full bg-orange-300 transition group-hover:bg-orange-500" />{item.label}</Link>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="border-r border-gray-100 p-6 text-gray-700">
                                            <p className="mb-4 border-b border-gray-100 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Best for</p>
                                            <div className="space-y-1">
                                                {[
                                                    { label: 'Gaming', to: '/category/gaming_laptop' },
                                                    { label: 'Business', to: '/category/working' },
                                                    { label: 'School', to: '/laptops' },
                                                    { label: 'Creative Work', to: '/laptops' },
                                                    { label: 'Portable', to: '/category/ultrabook' },
                                                ].map((item) => (
                                                    <Link key={item.label} to={item.to} className="block rounded-lg px-3 py-3 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600">{item.label}</Link>
                                                ))}
                                            </div>
                                            <Link to="/laptops" className="mt-5 block px-3 text-xs font-semibold text-orange-600 hover:text-orange-700">Explore every laptop →</Link>
                                        </div>
                                        <div className="bg-gray-950 p-6 text-white">
                                            <p className="mb-4 border-b border-gray-800 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-300">Featured brands</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { name: 'Gigabyte', image: gigabyte, to: '/laptops/gigabyte' },
                                                    { name: 'ASUS', image: asus, to: '/laptops/asus' },
                                                    { name: 'Lenovo', image: lenovo, to: '/laptops/lenovo' },
                                                    { name: 'Apple', image: apple, to: '/laptops/apple' },
                                                    { name: 'Acer', image: acer, to: '/laptops' },
                                                    { name: 'Dell', image: dell, to: '/laptops' },
                                                ].map((brand) => (
                                                    <Link key={brand.name} to={brand.to} aria-label={`Shop ${brand.name} laptops`} className="flex h-14 items-center justify-center rounded-lg border border-gray-800 bg-white px-3 transition hover:border-orange-400 hover:bg-orange-500">
                                                        <img src={brand.image} alt={`${brand.name} logo`} className="max-h-9 w-full object-contain" />
                                                    </Link>
                                                ))}
                                            </div>
                                            <p className="mt-5 text-xs leading-relaxed text-gray-400">From everyday essentials to serious performance.</p>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div onMouseEnter={() => setIsNetworkingMenuOpen(true)} onMouseLeave={() => setIsNetworkingMenuOpen(false)}>
    <button type="button" aria-expanded={isNetworkingMenuOpen} aria-haspopup="true" onClick={() => setIsNetworkingMenuOpen((isOpen) => !isOpen)} className={`relative py-2 transition-colors ${isNetworkingMenuOpen ? 'text-sky-50' : 'hover:text-orange-500'}`}>
        NETWORKING
        <span className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-orange-600 transition-transform ${isNetworkingMenuOpen ? 'scale-x-100' : 'scale-x-0'}`} />
    </button>
    {isNetworkingMenuOpen && (
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4">
            <div className="w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white text-sm font-medium shadow-[0_18px_55px_rgba(17,24,39,0.2)]">
                <div className="border-b border-gray-100 px-6 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">Networking</p>
                    <p className="mt-1 text-lg font-bold tracking-tight text-gray-950">Keep your home or office connected</p>
                </div>
                <div className="p-3">
                    {Object.entries(HARDWARE).map(([key, label]) => (
                        <Link key={key} to={`/networking?type=${key.toLowerCase()}`} className="block rounded-lg px-3 py-3 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600">{label}</Link>
                    ))}
                </div>
            </div>
        </div>
    )}
</div>

<div onMouseEnter={() => setIsServersMenuOpen(true)} onMouseLeave={() => setIsServersMenuOpen(false)}>
    <button type="button" aria-expanded={isServersMenuOpen} aria-haspopup="true" onClick={() => setIsServersMenuOpen((isOpen) => !isOpen)} className={`relative py-2 transition-colors ${isServersMenuOpen ? 'text-sky-50' : 'hover:text-orange-500'}`}>
        SERVERS
        <span className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-orange-600 transition-transform ${isServersMenuOpen ? 'scale-x-100' : 'scale-x-0'}`} />
    </button>
    {isServersMenuOpen && (
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4">
            <div className="w-[36rem] overflow-hidden rounded-2xl border border-gray-200 bg-white text-sm font-medium shadow-[0_18px_55px_rgba(17,24,39,0.2)]">
                <div className="border-b border-gray-100 px-6 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">Servers</p>
                    <p className="mt-1 text-lg font-bold tracking-tight text-gray-950">Reliable hardware for your growing workload</p>
                </div>
                <div className="grid grid-cols-2 gap-8 p-6">
                    {serversMenu.columns.map((col) => (
                        <div key={col.title}>
                            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">{col.title}</p>
                            <div className="space-y-1">
                                {col.links.map((link) => (
                                    <Link key={link.label} to={link.to} className="block rounded-lg px-3 py-3 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600">{link.label}</Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )}
</div>

<Link to="/ai-build" className="relative py-2 hover:text-orange-500 transition-colors group">
    AI BUILD
    <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-orange-600 transition-transform group-hover:scale-x-100" />
</Link>
                    </div>
                </div>

                {isNavOpen && (
                    <div className="md:hidden mt-6 pt-6 border-t border-gray-200 bg-white">
                        <div className="mb-4">
                            <Searchengine />
                        </div>
                        <div className="flex flex-col gap-4 text-gray-700 font-semibold text-center py-4">
                            <Link to="/pc-stores" className="hover:text-orange-500 transition-colors px-4 py-2">PC STORE</Link>
                            <Link to="/laptops" className="hover:text-orange-500 transition-colors px-4 py-2">LAPTOPS</Link>
                            <Link to="/components" className="hover:text-orange-500 transition-colors px-4 py-2">NETWORKING</Link>
                            <Link to="/servers" className="hover:text-orange-500 transition-colors px-4 py-2">SERVERS</Link>
                            <Link to="/ai-build" className="hover:text-orange-500 transition-colors px-4 py-2">AI BUILD</Link>
                            <div className="flex items-center justify-center gap-3 mt-4">
                                <button onClick={() => { setIsNavOpen(false); navigate('/cart'); }}
                                    className="rgb-button relative bg-gray-100 text-gray-900 p-3 rounded-xl hover:bg-orange-50 hover:text-orange-500">
                                    <MdShoppingCart className="text-xl" />
                                    {cart?.item_count > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                            {cart.item_count > 99 ? '99+' : cart.item_count}
                                        </span>
                                    )}
                                </button>
                                <button className="rgb-button flex items-center gap-2 bg-orange-500 text-white font-semibold px-8 py-3 rounded-xl cursor-pointer"
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
                <div className="relative w-full h-[420px] md:h-[540px] overflow-hidden bg-gray-950">
                    {slidepage.map((slide, index) => (
                        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                            <img src={slide.img} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
                            <div className="relative z-20 h-full flex items-center">
                                <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
                                    <div className="max-w-2xl text-white">
                                        <p className="text-orange-300 text-xs md:text-sm font-bold tracking-[0.2em] mb-4">RIGGINIE PH PERFORMANCE PICKS</p>
                                        <h1 className="text-3xl md:text-6xl font-bold leading-[1.05] max-w-xl whitespace-pre-line drop-shadow-lg">{slide.title}</h1>
                                        {slide.subtitle && <p className="mt-4 text-base md:text-lg text-gray-200">{slide.subtitle}</p>}
                                        <button onClick={() => navigate(slide.ctaLink)} className="rgb-button mt-8 px-7 py-3.5 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all">{slide.cta}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={prev} aria-label="Previous promotion" className="rgb-button absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 text-white text-xl leading-none flex items-center justify-center transition-colors"><FaAngleDoubleLeft /> </button>
                    <button onClick={next} aria-label="Next promotion" className="rgb-button absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 text-white text-xl leading-none flex items-center justify-center transition-colors"><FaAngleDoubleRight /></button>
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {slidepage.map((_, i) => (
                            <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition ${i === current ? "bg-white" : "bg-white/40"}`} />
                        ))}
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
                    <div className="flex items-end justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-7 bg-orange-500 rounded-full" />
                                <h2 className="text-xl md:text-2xl font-bold text-gray-950">Best For You</h2>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5 ml-3">Best For You Products</p>
                        </div>
                        <Link to="/pc-stores" className="text-sm text-orange-500 font-semibold hover:underline">View All →</Link>
                    </div>
                    {user && (
                        <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-900">Shop by budget</p>
                                <p className="mt-1 text-xs text-gray-500">Filter products recommended for your profile.</p>
                            </div>
                            <div className="flex items-end gap-2">
                                <label className="text-xs font-semibold text-gray-600">
                                    Min price
                                    <input
                                        type="number"
                                        min="0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="₱ 0"
                                        className="mt-1 h-10 w-28 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                                    />
                                </label>
                                <span className="pb-3 text-gray-400">to</span>
                                <label className="text-xs font-semibold text-gray-600">
                                    Max price
                                    <input
                                        type="number"
                                        min="0"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="No limit"
                                        className="mt-1 h-10 w-28 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                                    />
                                </label>
                                <label className="text-xs font-semibold text-gray-600">
                                    Sort by
                                    <select
                                        value={priceSort}
                                        onChange={(e) => setPriceSort(e.target.value)}
                                        className="mt-1 h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-normal text-gray-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                                    >
                                        <option value="">Recommended</option>
                                        <option value="low-to-high">Price: Low to high</option>
                                        <option value="high-to-low">Price: High to low</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                    )}
                    {!user ? (
                        <p className="text-gray-400 text-sm py-10 text-center"><Link to="/login">Log In First</Link></p>
                    ) : Object.keys(recommendedByCategory).length === 0 ? (
                        <p className="text-gray-400 text-sm py-10 text-center">Login First</p>
                    ) : (
                        Object.entries(recommendedByCategory).map(([cat, items]) => (
                            <div key={cat} className="mb-8">
                                <p className="text-sm font-bold text-gray-700 mb-3">
                                    {CATEGORY_LABELS[cat] || cat} <span className="text-gray-400 font-normal">· {items.length}</span>
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                                    {items.map((product) => (
                                        <ProductCard key={product.id} product={product} onCartUpdated={handleCartUpdated} onError={showToast} />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-7 bg-orange-500 rounded-full" />
                                <h2 className="text-xl md:text-2xl font-bold text-gray-950">New Releases</h2>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5 ml-3">Latest GPUs · {gpuProducts.length} products</p>
                        </div>
                        <Link to="/pc-stores" className="text-sm text-orange-500 font-semibold hover:underline">View All →</Link>
                    </div>
                    {gpuProducts.length === 0 ? (<p className="text-gray-400 text-sm py-10 text-center">UNDER MAINTENANCE</p>) : (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">{gpuProducts.map((product) => (<ProductCard key={product.id} product={product} onCartUpdated={handleCartUpdated} onError={showToast} />))}</div>)}
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-7 bg-orange-500 rounded-full" />
                                <h2 className="text-xl md:text-2xl font-bold text-gray-950">New Releases</h2>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5 ml-3">Latest Laptops · {laptops.length} products</p>
                        </div>
                        <Link to="/product_laptop" className="text-sm text-orange-500 font-semibold hover:underline">View All →</Link>
                    </div>
                    {laptops.length === 0 ? (<p className="text-gray-400 text-sm py-10 text-center">UNDER MAINTENANCE</p>) : (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">{laptops.map((product) => (<ProductCard key={product.id} product={product} onCartUpdated={handleCartUpdated} onError={showToast} />))}</div>)}
                </div>
            </main>
            <div className="fixed bottom-15 right-6 z-50 flex flex-col items-end gap-6">
                <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    {menuItems.map((item, index) => (
                        <button key={index} onClick={() => { item.onClick(); setOpen(false); }} className="flex items-center gap-3 group">
                            <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</span>
                            <div className="w-14 h-14 rounded-full border-4 border-gray-700 bg-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all">{item.icon}</div>
                        </button>
                    ))}
                </div>
                <button onClick={() => setOpen(!open)} className={`rgb-button w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${open ? 'rotate-45 bg-gray-100' : ''}`}>
                    <HiPlus className="text-3xl text-black" />
                </button>
            </div>
            <Footer />
            <Toast message={toast} />
        </div>
    );
}
function ProductCard({ product, onCartUpdated, onError }) {
    const [added, setAdded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [imageSrc, setImageSrc] = useState(remoteProductImage(product.img1 || product.mainimg));
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const fallbackImage = fallbackProductImage(product);
    const handleAdd = async () => {
    const user = getUser(); if (!user) { navigate('/login'); return; } setLoading(true); try { const res = await cartAPI.addItem(product.id, 1); setAdded(true); onCartUpdated?.(res.data); setTimeout(() => setAdded(false), 1500); } catch (err) { onError?.(err.response?.data?.error || 'Failed to add to cart.'); } finally { setLoading(false); }
    };

    const bgColor = product.name.toLowerCase().includes('radeon') || product.name.toLowerCase().includes('rx')
        ? 'from-red-950 to-gray-900'
        : 'from-green-950 to-gray-900';
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
            <div className={`bg-gradient-to-br ${bgColor} h-36 sm:h-44 flex items-center justify-center relative overflow-hidden cursor-pointer`} onClick={() => navigate(`/product/${product.id}`)}>
                {imageSrc && !imgError
                    ? <img src={imageSrc} alt={product.name} onError={() => {
                        if (fallbackImage && imageSrc !== fallbackImage) setImageSrc(fallbackImage);
                        else setImgError(true);
                    }}
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
                    className={`rgb-button w-full mt-auto py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 ${added ? 'bg-green-500 text-white' : 'bg-gray-950 text-white hover:bg-orange-500'}`}>
                    {loading ? 'Adding…' : added ? '✓ Added to Cart' : 'Add to Cart'}
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
    useEffect(() => {
        pointsAPI.getBalance().then(res => setBalance(res.data.points)).catch(err => { console.error(err); setBalance(0); }).finally(() => setLoading(false));
        authAPI.getProfile().then(({ data }) => setProfilePicture(data.picture || '')).catch(() => { });
    }, []);

    const profilePictureUrl = profilePicture && (profilePicture.startsWith('http') ? profilePicture : `http://localhost:8000${profilePicture}`);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)}
                className="rgb-button flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors">
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
                            <span className="text-xl font-bold text-orange-600">{loading ? '...' : `${balance} pts`} </span>
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
                        <button onClick={() => handleNavigation('/cart')}
                            className="w-full px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-3 text-gray-700 text-left">
                            <GiTwoCoins className="text-orange-500 text-lg" /><span>Points Shop</span>
                        </button>                    </div>
                    <div className="border-t border-gray-200 p-2">
                        <button onClick={handleLogout}
                            className="rgb-button w-full px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 font-semibold text-left rounded">
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
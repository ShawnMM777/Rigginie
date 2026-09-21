import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Zap, Check, Info } from 'lucide-react';
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
import ROGSTRIX5070 from "../../../assets/products/GRAPHICS CARD/1.png";
import T1ASUS from "../../../assets/products/GRAPHICS CARD/t1.png";
import proart from "../../../assets/products/GRAPHICS CARD/proart.png";
import aorusmaster from "../../../assets/products/GRAPHICS CARD/2.png";
import aerooc from "../../../assets/products/GRAPHICS CARD/3.png";
import rx9070 from "../../../assets/products/GRAPHICS CARD/10.png";
import gamingoc from "../../../assets/products/GRAPHICS CARD/6.png";
import hof from "../../../assets/products/GRAPHICS CARD/8.png";
import { FaThreads } from "react-icons/fa6";
import PCBuildViewer from '../../userspages/interactive/PCBuildViewer';
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser } from "react-icons/fa";
import { TbMapPinFilled } from "react-icons/tb";
import { MdLogout, MdHistory, MdShoppingCart } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import { authAPI, clearAuthData, getUser, pointsAPI } from '../../../services/api';

const GPUS = [
    { id: "rtx5090", name: "GeForce RTX™ 5090 32GB ProArt OC", image: proart, vram: "32GB GDDR7", tier: "Flagship", score: 100, price: 238983, description: "The ceiling of consumer graphics cards — locked 4K at max settings with ray tracing on, and enough VRAM headroom for creator and AI workloads on the side." },
    { id: "rtx5080", name: "GeForce RTX™ 5080 16GB HOF Gaming (Black Ed.)", image: hof, vram: "16GB GDDR7", tier: "Enthusiast", score: 80, price: 110495, description: "A serious 4K/1440p card with plenty of headroom for high refresh rates and ray tracing, well below flagship pricing." },
    { id: "rx9070xt", name: "Radeon RX™ 9070 XT 16GB GAMING OC", image: gamingoc, vram: "16GB GDDR6", tier: "High-End", score: 67, price: 57400, description: "Strong 1440p performance with capable 4K when needed — excellent value per peso at the high-end tier." },
    { id: "rtx5070ti", name: "GeForce RTX™ 5070Ti ROG STRIX", image: ROGSTRIX5070, vram: "16GB GDDR7", tier: "High-End", score: 70, price: 86980, description: "A well-rounded 1440p powerhouse that handles ray tracing comfortably, with enough legs for light 4K gaming." },
    { id: "rtx5070a", name: "GeForce RTX™ 5070 12GB AORUS MASTER", image: aorusmaster, vram: "12GB GDDR7", tier: "High-End", score: 60, price: 56850, description: "Confident 1440p performance backed by premium cooling that stays quiet under sustained load." },
    { id: "rtx5070b", name: "GeForce RTX™ 5070 12GB AERO OC", image: aerooc, vram: "12GB GDDR7", tier: "High-End", score: 58, price: 50585, description: "The same 1440p-class performance as its siblings, in a more compact, quieter cooler." },
    { id: "rx9070gre", name: "Radeon RX™ 9070XT 12GB GRE AORUS", image: rx9070, vram: "12GB GDDR6", tier: "Mid-Range", score: 55, price: 40980, description: "A strong value pick for 1080p and entry 1440p gaming without stretching the budget." },
    { id: "rtx5060ti", name: "GeForce RTX™ 5060Ti 16GB ASUS T1", image: T1ASUS, vram: "16GB GDDR7", tier: "Mid-Range", score: 39, price: 17970, description: "The budget-friendly entry point for 1080p gaming, with enough VRAM to stay relevant for a few years." },
];

const CPUS = [
    { id: "r9-9950x3d", name: "Ryzen 9 9950X3D", score: 100, price: 34990, description: "The fastest gaming CPU in the lineup, with 3D V-Cache that gives it a real edge in CPU-bound titles." },
    { id: "r7-9800x3d", name: "Ryzen 7 9800X3D", score: 93, price: 24990, description: "The sweet spot for gaming price-to-performance — often keeps pace with pricier chips in CPU-heavy games." },
    { id: "i9-14900k", name: "Core i9-14900K", score: 87, price: 29990, description: "A strong all-rounder for gaming and productivity, with muscle to spare for streaming or editing." },
    { id: "r5-9600x", name: "Ryzen 5 9600X", score: 67, price: 13990, description: "A capable mid-range chip that won't bottleneck a mid-to-high-end GPU at 1080p or 1440p." },
    { id: "i5-14600k", name: "Core i5-14600K", score: 63, price: 15990, description: "A reliable everyday chip for gaming and general use, with room to overclock for extra headroom." },
];

const GAMES = [
    { id: "valorant", name: "Valorant", baseFps: 380, gpuWeight: 0.30, cpuWeight: 0.70 },
    { id: "fortnite", name: "Fortnite", baseFps: 260, gpuWeight: 0.55, cpuWeight: 0.45 },
    { id: "codbo6", name: "Call of Duty: Black Ops 6", baseFps: 200, gpuWeight: 0.62, cpuWeight: 0.38 },
    { id: "eldenring", name: "Elden Ring Nightreign", baseFps: 145, gpuWeight: 0.70, cpuWeight: 0.30 },
    { id: "cyberpunk", name: "Cyberpunk 2077 (RT Ultra)", baseFps: 85, gpuWeight: 0.85, cpuWeight: 0.15 },
];

const RESOLUTIONS = [
    { id: "1080p", label: "1920×1080", mult: 1.00 },
    { id: "1440p", label: "2560×1440", mult: 0.67 },
    { id: "4k", label: "3840×2160", mult: 0.40 },
];

const SETTINGS = [
    { id: "low", label: "Low", mult: 1.35 },
    { id: "med", label: "Medium", mult: 1.00 },
    { id: "high", label: "High", mult: 0.78 },
    { id: "ultra", label: "Ultra", mult: 0.55 },
];

function getTier(fps) {
    if (fps >= 144) return { label: "Excellent", color: "#10b981" };
    if (fps >= 90) return { label: "Great", color: "#84cc16" };
    if (fps >= 60) return { label: "Good", color: "#eab308" };
    if (fps >= 30) return { label: "Playable", color: "#f59e0b" };
    return { label: "Poor", color: "#ef4444" };
}

function PerformanceDial({ fps, maxFps, color, label }) {
    const size = 200;
    const strokeWidth = 15;
    const r = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;
    const sweep = 270;
    const sweepLen = circumference * (sweep / 360);
    const percent = Math.max(0, Math.min(100, (fps / maxFps) * 100));
    const fillLen = sweepLen * (percent / 100);
    const startRotate = 135;

    const ticks = [0, 0.5, 1].map((f) => {
        const angleDeg = startRotate + f * sweep;
        const angleRad = (angleDeg * Math.PI) / 180;
        const outerR = r + strokeWidth / 2 + 8;
        const innerR = r + strokeWidth / 2 + 2;
        const labelR = outerR + 13;
        return {
            f,
            x1: cx + innerR * Math.cos(angleRad),
            y1: cy + innerR * Math.sin(angleRad),
            x2: cx + outerR * Math.cos(angleRad),
            y2: cy + outerR * Math.sin(angleRad),
            lx: cx + labelR * Math.cos(angleRad),
            ly: cy + labelR * Math.sin(angleRad),
            value: Math.round(f * maxFps),
        };
    });

    return (
        <div className="relative" style={{ width: size, height: size + 24 }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={cx} cy={cy} r={r} fill="none"
                    stroke="#e5e7eb" strokeWidth={strokeWidth} strokeLinecap="round"
                    strokeDasharray={`${sweepLen} ${circumference - sweepLen}`}
                    transform={`rotate(${startRotate} ${cx} ${cy})`}
                />
                <circle
                    cx={cx} cy={cy} r={r} fill="none"
                    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
                    strokeDasharray={`${fillLen} ${circumference - fillLen}`}
                    transform={`rotate(${startRotate} ${cx} ${cy})`}
                    style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease" }}
                />
                {ticks.map((t) => (
                    <g key={t.f}>
                        <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#d1d5db" strokeWidth="2" />
                        <text
                            x={t.lx} y={t.ly} textAnchor="middle" dominantBaseline="middle"
                            fontSize="10" fill="#9ca3af" fontFamily="ui-monospace, monospace"
                        >
                            {t.value}
                        </text>
                    </g>
                ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                    className="text-4xl font-black"
                    style={{ color: "#1f2937", fontFamily: "ui-monospace, SFMono-Regular, monospace", letterSpacing: "-0.02em" }}
                >
                    {Math.round(fps)}
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-gray-400 mt-1">Avg FPS</span>
                <span
                    className="mt-2 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${color}1a`, color: color }}
                >
                    {label}
                </span>
            </div>
        </div>
    );
}

function GpuCard({ gpu, isSelected, onSelect }) {
    const bgColor = gpu.name.toLowerCase().includes('radeon')
        ? 'from-red-950 to-gray-900'
        : 'from-green-950 to-gray-900';

    return (
        <button
            onClick={onSelect}
            className={`relative text-left bg-white rounded-xl border overflow-hidden transition-all duration-200 ${isSelected
                    ? 'border-orange-500 ring-2 ring-orange-200 -translate-y-1 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md'
                }`}
        >
            <div className={`bg-linear-to-br ${bgColor} h-28 flex items-center justify-center relative overflow-hidden`}>
                <img src={gpu.image} alt={gpu.name} className="w-full h-full object-contain p-3" />
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                    {gpu.tier}
                </span>
                {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                        <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                )}
            </div>
            <div className="p-3">
                <h3 className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{gpu.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{gpu.vram}</p>
                <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Benchmark</span>
                        <span className="text-xs font-bold text-gray-500">{gpu.score}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${gpu.score}%` }} />
                    </div>
                </div>
                <p className="text-base font-bold text-orange-500 mt-2">₱ {gpu.price.toLocaleString()}</p>
            </div>
        </button>
    );
}

function Aibuild() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const user = getUser();

    const [gpuId, setGpuId] = useState(GPUS[3].id);
    const [cpuId, setCpuId] = useState(CPUS[1].id);
    const [gameId, setGameId] = useState(GAMES[2].id);
    const [resId, setResId] = useState(RESOLUTIONS[0].id);
    const [settingId, setSettingId] = useState(SETTINGS[2].id);

    const gpu = GPUS.find((g) => g.id === gpuId);
    const cpu = CPUS.find((c) => c.id === cpuId);
    const game = GAMES.find((g) => g.id === gameId);
    const res = RESOLUTIONS.find((r) => r.id === resId);
    const setting = SETTINGS.find((s) => s.id === settingId);

    const fps = useMemo(() => {
        const combined = (gpu.score / 100) * game.gpuWeight + (cpu.score / 100) * game.cpuWeight;
        return Math.max(1, Math.round(game.baseFps * combined * res.mult * setting.mult));
    }, [gpu, cpu, game, res, setting]);

    const tier = getTier(fps);

    const { gpuShare, cpuShare } = useMemo(() => {
        const gpuC = (gpu.score / 100) * game.gpuWeight;
        const cpuC = (cpu.score / 100) * game.cpuWeight;
        const total = gpuC + cpuC;
        const gShare = Math.round((gpuC / total) * 100);
        return { gpuShare: gShare, cpuShare: 100 - gShare };
    }, [gpu, cpu, game]);

    const buildPrice = gpu.price + cpu.price;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="w-full bg-orange-500 py-5 px-6 md:px-10 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="shrink-0">
                        <img src={logo} alt="Logo" className="h-12 w-auto cursor-pointer" />
                    </button>
                    <div className="hidden md:flex flex-1 justify-center items-center gap-5 text-white font-medium text-sm lg:text-base">
                        <Link to="/pc-stores" className="hover:text-orange-200 transition-colors px-4 py-2">PC STORE</Link>
                        <Link to="/laptops" className="hover:text-orange-200 transition-colors px-4 py-2">LAPTOPS</Link>
                        <Link to="/components" className="hover:text-orange-200 transition-colors px-4 py-2">NETWORKING</Link>
                        <Link to="/servers" className="hover:text-orange-200 transition-colors px-4 py-2">SERVERS</Link>
                        <Link to="/ai-build" className="hover:text-orange-200 transition-colors px-4 py-2">AI BUILD</Link>
                    </div>
                    <div className="hidden md:block shrink-0">
                        {user ? <ProfileDropdown user={user} /> : (
                            <button onClick={() => navigate('/login')} className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors">
                                <FaUser className="text-sm" />
                                <span>Account</span>
                            </button>
                        )}
                    </div>
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-4xl focus:outline-none">
                        {isOpen ? '✕' : '☰'}
                    </button>
                </div>
                {isOpen && (
                    <div className="md:hidden mt-6 pt-6 border-t border-orange-400 bg-orange-500">
                        <div className="flex flex-col gap-4 text-white font-medium text-center py-4">
                            <Link to="/pc-stores" className="hover:text-orange-200 transition-colors px-4 py-2">PC STORE</Link>
                            <Link to="/laptops" className="hover:text-orange-200 transition-colors px-4 py-2">LAPTOPS</Link>
                            <Link to="/components" className="hover:text-orange-200 transition-colors px-4 py-2">NETWORKING</Link>
                            <Link to="/servers" className="hover:text-orange-200 transition-colors px-4 py-2">SERVERS</Link>
                            <Link to="/ai-build" className="hover:text-orange-200 transition-colors px-4 py-2">AI BUILD</Link>
                            <button className="mt-6 mx-auto flex items-center gap-2 bg-white text-orange-500 font-semibold px-8 py-3 rounded hover:bg-gray-100" onClick={() => navigate(user ? '/account' : '/login')}>
                                <FaUser className="text-sm" />
                                <span>{user ? 'My Account' : 'Account'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-1">
                <div className="max-w-6xl mx-auto px-4 md:px-10 py-10">

                
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                            <Zap size={12} /> 3D Build FPS Calculator
                        </span>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Will It Run Well?</h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            Pick a GPU and CPU, spin the 3D case, and see estimated FPS before you buy.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8 mb-10">
                        <div className="grid lg:grid-cols-5 gap-8">
                            <div className="lg:col-span-3 space-y-4">
                                <PCBuildViewer gpu={gpu} cpu={cpu} fps={fps} tier={tier} />
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                        <PerformanceDial fps={fps} maxFps={400} color={tier.color} label={tier.label} />
                                    </div>
                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 flex flex-col justify-center">
                                        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                                            <span>GPU load {gpuShare}%</span>
                                            <span>CPU load {cpuShare}%</span>
                                        </div>
                                        <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-200 mb-5">
                                            <div className="h-full bg-orange-500" style={{ width: `${gpuShare}%` }} />
                                            <div className="h-full bg-gray-400" style={{ width: `${cpuShare}%` }} />
                                        </div>
                                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                            <span className="text-xs font-semibold text-gray-500">This build</span>
                                            <span className="text-lg font-black text-gray-800">₱ {buildPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="mt-3 flex items-start gap-1.5">
                                            <Info size={12} className="text-gray-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                Estimates only. Fans, GPU size, and RGB react to your parts and FPS.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Graphics Card</p>
                                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center shrink-0">
                                            <img src={gpu.image} alt={gpu.name} className="w-full h-full object-contain p-1" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-gray-800 truncate">{gpu.name}</p>
                                            <p className="text-xs text-gray-400">{gpu.vram} · Score {gpu.score}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{gpu.description}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Processor</p>
                                    <p className="text-xs text-gray-500 mb-2 leading-relaxed">{cpu.description}</p>
                                    <div className="grid sm:grid-cols-2 gap-2">
                                        {CPUS.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => setCpuId(c.id)}
                                                className={`text-left rounded-xl border px-3 py-2.5 transition-colors ${cpuId === c.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                    }`}
                                            >
                                                <p className={`text-xs font-bold ${cpuId === c.id ? 'text-orange-600' : 'text-gray-700'}`}>{c.name}</p>
                                                <p className="text-xs text-gray-400">₱ {c.price.toLocaleString()}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Game</p>
                                    <div className="space-y-2">
                                        {GAMES.map((g) => (
                                            <button
                                                key={g.id}
                                                onClick={() => setGameId(g.id)}
                                                className={`w-full flex items-center justify-between rounded-xl border px-3 py-2.5 transition-colors ${gameId === g.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                    }`}
                                            >
                                                <span className={`text-xs font-bold ${gameId === g.id ? 'text-orange-600' : 'text-gray-700'}`}>{g.name}</span>
                                                <span className="text-xs text-gray-400">{g.gpuWeight > g.cpuWeight ? 'GPU-Intensive' : 'CPU-Intensive'}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Resolution</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {RESOLUTIONS.map((r) => (
                                            <button
                                                key={r.id}
                                                onClick={() => setResId(r.id)}
                                                className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${resId === r.id ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Settings</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {SETTINGS.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => setSettingId(s.id)}
                                                className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${settingId === s.id ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="w-1 h-6 bg-orange-500 rounded-full" />
                                <h2 className="text-lg md:text-xl font-bold text-gray-900">Choose Your Graphics Card</h2>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5 ml-3">{GPUS.length} cards · tap to update the calculator</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                        {GPUS.map((g) => (
                            <GpuCard key={g.id} gpu={g} isSelected={g.id === gpuId} onSelect={() => setGpuId(g.id)} />
                        ))}
                    </div>
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
    const [profileOpen, setProfileOpen] = useState(false);
    const [balance, setBalance] = useState(null);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const navigate = useNavigate();
    const profilePicture = user?.picture ? (user.picture.startsWith('http') ? user.picture : `http://localhost:8000${user.picture}`) : '';

    useEffect(() => {
        pointsAPI.getBalance()
            .then(({ data }) => setBalance(data.points))
            .catch(() => setBalance(0))
            .finally(() => setLoadingBalance(false));
    }, []);

    const handleLogout = async () => {
        try {
            await authAPI.logout(localStorage.getItem('refresh_token'));
        } catch {
            // Clear local authentication even if the server session is unavailable.
        } finally {
            clearAuthData();
            setProfileOpen(false);
            window.location.href = '/';
        }
    };

    const goTo = (path) => {
        setProfileOpen(false);
        navigate(path);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setProfileOpen((isOpen) => !isOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded bg-white px-6 py-3 font-semibold text-orange-500 transition-colors hover:bg-gray-100"
            >
                <FaUser className="text-sm" />
                <span>{user?.firstName || 'Account'}</span>
                <span aria-hidden="true" className="text-xl">{profileOpen ? '▲' : '▼'}</span>
            </button>
            {profileOpen && (
                <div role="menu" className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-2xl">
                    <div className="border-b border-gray-200 bg-orange-50 p-4">
                        <div className="flex items-center gap-3">
                            <div data-role={user?.usertype || user?.userType || user?.user_type || user?.role || 'enthusiast'} className="profile-role-avatar flex h-12 w-12 items-center justify-center overflow-hidden rounded-full font-bold text-white">
                                {profilePicture ? <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" /> : user?.firstName?.charAt(0).toUpperCase() || <FaUser />}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                                <p className="truncate text-sm text-gray-600">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-gray-200 bg-linear-to-r from-orange-50 to-yellow-50 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-medium text-gray-700">Points Balance</span>
                            <span className="text-lg font-bold text-orange-600">{loadingBalance ? '...' : `${balance} pts`}</span>
                        </div>
                    </div>
                    <div className="py-2">
                        <button onClick={() => goTo('/profile')} className="flex w-full items-center gap-3 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-orange-50"><FaUser className="text-orange-500" />My Profile</button>
                        <button onClick={() => goTo('/purchase-history')} className="flex w-full items-center gap-3 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-orange-50"><MdHistory className="text-lg text-orange-500" />Purchase History</button>
                        <button onClick={() => goTo('/cart')} className="flex w-full items-center gap-3 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-orange-50"><MdShoppingCart className="text-lg text-orange-500" />Shopping Cart</button>
                        <button onClick={() => goTo('/cart')} className="flex w-full items-center gap-3 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-orange-50"><GiTwoCoins className="text-lg text-orange-500" />Points Shop</button>
                    </div>
                    <div className="border-t border-gray-200 p-2">
                        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded px-4 py-2 text-left font-semibold text-red-600 transition-colors hover:bg-red-50"><MdLogout className="text-lg" />Logout</button>
                    </div>
                </div>
            )}
            {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
        </div>
    );
}

export default Aibuild;

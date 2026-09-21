import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { FaSearch, FaTimes, FaArrowRight } from 'react-icons/fa';
import { productAPI } from '../../../services/api';

const CATEGORY_LABELS = {
    GPU: 'Graphics Card', CPU: 'Processor', MB: 'Motherboard', RAM: 'Memory',
    SSD: 'SSD Storage', HDD: 'HDD Storage', PSU: 'Power Supply', CASE: 'Case',
    COOL: 'Cooling', PERI: 'Peripherals', LAP: 'Laptop',
};

function productImage(product) {
    const src = product.img1 || product.img2 || product.mainimg;
    if (!src) return null;
    return src.startsWith('http') ? src : `http://localhost:8000${src}`;
}

function Highlight({ text, query }) {
    const q = query.trim();
    if (!q) return text;
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return text;
    return (
        <>
            {text.slice(0, i)}
            <mark className="bg-orange-100 text-orange-700 rounded-sm px-0.5">{text.slice(i, i + q.length)}</mark>
            {text.slice(i + q.length)}
        </>
    );
}

function SearchBar() {
    const [query, setQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const boxRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        productAPI.getAll().then((res) => setAllProducts(res.data)).catch(() => setAllProducts([]));
    }, []);

    useEffect(() => {
        const onClick = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setOpen(false);
                setFocused(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const runSearch = (value) => {
        setQuery(value);
        setActiveIndex(-1);
        const q = value.trim().toLowerCase();
        if (!q) {
            setResults([]);
            setOpen(false);
            return;
        }
        const matches = allProducts.filter((p) =>
            p.name.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q)
        );
        setResults(matches.slice(0, 8));
        setOpen(true);
    };

    const goToProduct = (id) => {
        setOpen(false);
        setQuery('');
        setFocused(false);
        navigate(`/product/${id}`);
    };

    const goToSearchPage = () => {
        if (!query.trim()) return;
        setOpen(false);
        setFocused(false);
        navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            activeIndex >= 0 && results[activeIndex] ? goToProduct(results[activeIndex].id) : goToSearchPage();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Escape') {
            setOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div ref={boxRef} className="relative w-full z-[100]">
            <div
                className={`flex items-center h-12 rounded-full bg-white pl-4 pr-1.5 gap-2 transition-shadow duration-200 ${
                    focused
                        ? 'shadow-lg ring-2 ring-white/80'
                        : 'shadow-md ring-1 ring-black/5 hover:shadow-lg'
                }`}
            >
                <FaSearch className="text-orange-500 text-sm shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => runSearch(e.target.value)}
                    onFocus={() => {
                        setFocused(true);
                        if (query.trim()) setOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search products, brands, or categories…"
                    className="flex-1 min-w-0 h-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    aria-label="Search products"
                    autoComplete="off"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            runSearch('');
                            inputRef.current?.focus();
                        }}
                        aria-label="Clear search"
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <FaTimes className="text-xs" />
                    </button>
                )}
                <button
                    type="button"
                    onClick={goToSearchPage}
                    className="shrink-0 h-9 px-4 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                    <span className="hidden sm:inline">Search</span>
                    <FaSearch className="sm:hidden text-xs" />
                </button>
            </div>

            {open && (
                <div className="absolute z-[100] left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl ring-1 ring-black/8 overflow-hidden">
                    {results.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                            <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                <FaSearch className="text-sm" />
                            </div>
                            <p className="text-sm font-medium text-gray-800">No matches for “{query}”</p>
                            <p className="text-xs text-gray-400 mt-1">Try a product name or category</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Products</span>
                                <span className="text-xs text-gray-400">{results.length} result{results.length === 1 ? '' : 's'}</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto py-1">
                                {results.map((p, i) => {
                                    const img = productImage(p);
                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => goToProduct(p.id)}
                                            onMouseEnter={() => setActiveIndex(i)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                                i === activeIndex ? 'bg-orange-50' : 'bg-white hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-gray-50 ring-1 ring-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                                {img
                                                    ? <img src={img} alt="" className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display = 'none'; }} />
                                                    : <span className="text-lg">🎮</span>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    <Highlight text={p.name} query={query} />
                                                </p>
                                                <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                                                    {CATEGORY_LABELS[p.category] || p.category}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-orange-500 shrink-0">
                                                ₱{Number(p.price).toLocaleString()}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                type="button"
                                onClick={goToSearchPage}
                                className="w-full px-4 py-3 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 flex items-center justify-center gap-2 transition-colors"
                            >
                                See all results for “{query}”
                                <FaArrowRight className="text-xs" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
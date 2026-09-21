import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { FaSearch, FaArrowLeft, FaTimes } from 'react-icons/fa';
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
            <mark className="bg-orange-100 text-orange-700 rounded-sm px-0.5">
                {text.slice(i, i + q.length)}
            </mark>
            {text.slice(i + q.length)}
        </>
    );
}

function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('query') || '';
    
    const [allProducts, setAllProducts] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        setLoading(true);
        productAPI
            .getAll()
            .then((res) => {
                setAllProducts(res.data);
                filterResults(res.data, query);
            })
            .catch(() => {
                setAllProducts([]);
                setResults([]);
            })
            .finally(() => setLoading(false));
    }, [query]);

    const filterResults = (products, searchQuery) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) {
            setResults([]);
            return;
        }
        const matches = products.filter((p) =>
            p.name.toLowerCase().includes(q) || 
            (p.category || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q)
        );
        setResults(matches);
    };

    const filteredByCategory = selectedCategory === 'all'
        ? results
        : results.filter((p) => p.category === selectedCategory);

    const uniqueCategories = [...new Set(results.map((p) => p.category).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Go back"
                        >
                            <FaArrowLeft className="text-gray-600" />
                        </button>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">Search Results</p>
                            <h1 className="text-xl font-bold text-gray-900 truncate">
                                {query ? `"${query}"` : 'No search term'}
                            </h1>
                        </div>
                        <p className="text-sm font-semibold text-orange-600">
                            {filteredByCategory.length} result{filteredByCategory.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin">
                            <FaSearch className="text-orange-500 text-4xl" />
                        </div>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 mb-4">
                            <FaSearch className="text-orange-500 text-2xl" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No results found</h2>
                        <p className="text-gray-600">
                            {query
                                ? `We couldn't find any products matching "${query}"`
                                : 'Try entering a search term'}
                        </p>
                    </div>
                ) : (
                    <div className="flex gap-8">
                        {/* Sidebar Filters */}
                        <div className="w-48 flex-shrink-0">
                            <div className="bg-white rounded-lg p-4 shadow-sm sticky top-24">
                                <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                            selectedCategory === 'all'
                                                ? 'bg-orange-50 text-orange-600 font-semibold'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        All Categories ({results.length})
                                    </button>
                                    {uniqueCategories.map((cat) => {
                                        const count = results.filter((p) => p.category === cat).length;
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                                                    selectedCategory === cat
                                                        ? 'bg-orange-50 text-orange-600 font-semibold'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span className="block">{CATEGORY_LABELS[cat] || cat}</span>
                                                <span className="text-xs text-gray-500">({count})</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="flex-1">
                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                                {filteredByCategory.map((product) => {
                                    const img = productImage(product);
                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => navigate(`/product/${product.id}`)}
                                            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                                        >
                                            <div className="relative overflow-hidden bg-gray-100 h-40">
                                                {img ? (
                                                    <img
                                                        src={img}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-3xl">
                                                        🎮
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                                    <Highlight text={product.name} query={query} />
                                                </p>
                                                <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded mb-2">
                                                    {CATEGORY_LABELS[product.category] || product.category}
                                                </span>
                                                <p className="text-sm font-bold text-orange-600">
                                                    ₱{Number(product.price).toLocaleString()}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchResults;

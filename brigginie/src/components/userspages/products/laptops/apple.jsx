import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaApple, FaUser } from 'react-icons/fa6';
import { MdShoppingCart } from 'react-icons/md';
import logo from '../../../../assets/logo.png';
import { cartAPI, getUser, productAPI } from '../../../../services/api';

function Apple() {
    const navigate = useNavigate();
    const user = getUser();
    const [products, setProducts] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productAPI.getAll('LAP')
            .then(({ data }) => {
                const items = Array.isArray(data) ? data : data?.results || [];
                setProducts(items.filter((product) => {
                    const searchable = `${product.name} ${product.subbrand || ''} ${product.brand || ''}`.toLowerCase();
                    return searchable.includes('apple') || searchable.includes('macbook');
                }));
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));

        if (user) {
            cartAPI.getCart().then(({ data }) => setCartCount(data?.item_count || 0)).catch(() => { });
        }
    }, [user]);

    const addToCart = async (product) => {
        if (!user) {
            navigate('/login');
            return;
        }
        await cartAPI.addItem(product.id, 1);
        setCartCount((count) => count + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="w-full bg-gray-950 px-5 py-2 text-right text-xs text-gray-300">
                <button onClick={() => navigate('/forum')} className="hover:text-orange-400">Forum</button>
            </div>
            <nav className="sticky top-0 z-40 border-b border-orange-300 bg-orange-400 px-5 py-3 shadow-sm md:px-10">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <button onClick={() => navigate('/')} aria-label="Go to Rigginie home">
                        <img src={logo} alt="Rigginie PH" className="h-11 w-auto" />
                    </button>
                    <div className="hidden items-center gap-6 text-sm font-semibold text-amber-950 md:flex">
                        <Link to="/laptops" className="hover:text-white">All Laptops</Link>
                        <Link to="/category/working" className="hover:text-white">Working Laptops</Link>
                        <span className="border-b-2 border-amber-950 pb-1">Apple</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(user ? '/account' : '/login')} aria-label="Account" className="rounded-xl bg-white p-3 text-gray-900 hover:text-orange-500"><FaUser /></button>
                        <button onClick={() => navigate('/cart')} aria-label="Shopping cart" className="relative rounded-xl bg-gray-950 p-3 text-white hover:bg-orange-600">
                            <MdShoppingCart className="text-xl" />
                            {cartCount > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold">{cartCount > 99 ? '99+' : cartCount}</span>}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-10">
                <section className="relative overflow-hidden rounded-2xl bg-gray-950 px-6 py-12 text-white shadow-xl md:px-12">
                    <div className="relative z-10 max-w-xl">
                        <div className="mb-4 flex items-center gap-3 text-orange-400"><FaApple className="text-3xl" /><span className="text-xs font-bold uppercase tracking-[0.22em]">Apple collection</span></div>
                        <h1 className="text-4xl font-black tracking-tight md:text-6xl">Mac that moves with you.</h1>
                        <p className="mt-4 max-w-md text-gray-300">Explore Apple laptops selected for focused work, creative flow, and everyday performance.</p>
                    </div>
                    <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full border-28 border-orange-400/20" />
                    <div className="absolute -bottom-36 right-20 h-72 w-72 rounded-full border-18 border-white/10" />
                </section>

                <section className="mt-12">
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2"><span className="h-6 w-1 rounded-full bg-orange-500" /><h2 className="text-xl font-bold">APPLE LAPTOPS</h2></div>
                            <p className="ml-3 mt-1 text-sm text-gray-500">MacBook models for work, study, and creative pursuits</p>
                        </div>
                        <Link to="/laptops" className="shrink-0 text-sm font-semibold text-orange-500 hover:underline">View all laptops →</Link>
                    </div>
                    {loading ? <p className="text-sm text-gray-400">Loading Apple products...</p> : products.length === 0 ? <p className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">No Apple products are available right now.</p> : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
                            {products.map((product) => <AppleProductCard key={product.id} product={product} onAdd={addToCart} />)}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

function AppleProductCard({ product, onAdd }) {
    const [added, setAdded] = useState(false);
    const image = product.mainimg || product.img1;
    const imageUrl = image ? (image.startsWith('http') ? image : `http://localhost:8000${image}`) : null;
    const handleAdd = async () => { await onAdd(product); setAdded(true); setTimeout(() => setAdded(false), 1400); };

    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
            <Link to={`/product/${product.id}`} className="flex h-36 items-center justify-center bg-linear-to-br from-gray-100 to-gray-300 p-4 sm:h-44">
                {imageUrl ? <img src={imageUrl} alt={product.name} className="h-full w-full object-contain transition duration-300 hover:scale-105" /> : <FaApple className="text-5xl text-gray-500" />}
            </Link>
            <div className="flex flex-1 flex-col p-3">
                <h3 className="min-h-10 text-xs font-semibold leading-snug text-gray-800">{product.name}</h3>
                <p className="mt-2 text-base font-bold text-orange-500">₱ {Number(product.price).toLocaleString()}</p>
                <button onClick={handleAdd} className={`mt-auto rounded py-2 text-xs font-semibold text-white transition ${added ? 'bg-green-500' : 'bg-gray-950 hover:bg-orange-500'}`}>
                    {added ? 'Added to cart' : 'Add to cart'}
                </button>
            </div>
        </article>
    );
}

export default Apple;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { cartAPI, getUser, clearAuthData } from '../../../services/api';
import { MdDelete, MdAdd, MdRemove, MdShoppingCart } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import logo from '../../../assets/logo.png';

function Toast({ message }) {
    if (!message) return null;
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl">
            {message}
        </div>
    );
}
function ProductThumb({ product }) {
    const [imgError, setImgError] = useState(false);
    const src = product.mainimg ? `http://localhost:8000${product.mainimg}` : null;

    return (
        <div className="w-20 h-20 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {src && !imgError ? ( <img src={src} alt={product.name}onError={() => setImgError(true)}className="w-full h-full object-contain p-1" /> ) : ( <span className="text-3xl select-none">🎮</span> )}
        </div>
    );
}
function CartItemRow({ item, isPending, onIncrease, onDecrease, onRemove }) {
    const atMaxStock = item.quantity >= item.product.stock;
    const remaining   = item.product.stock - item.quantity;
    const lowStock    = remaining > 0 && remaining <= 3;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 shadow-sm">
            <ProductThumb product={item.product} />

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.product.name}</h3>
                <p className="text-orange-500 font-bold mt-1">₱ {Number(item.product.price).toLocaleString()}</p>

                {lowStock && (
                    <p className="text-xs text-amber-600 font-medium mt-0.5">Only {remaining} left in stock</p>
                )}

                <div className="flex items-center gap-3 mt-2">
                    <button
                        onClick={onDecrease}
                        disabled={isPending}
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <MdRemove className="text-sm" />
                    </button>
                    <span className="font-semibold w-6 text-center">
                        {isPending ? (
                            <span className="inline-block w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            item.quantity
                        )}
                    </span>
                    <button
                        onClick={onIncrease}
                        disabled={isPending || atMaxStock}
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title={atMaxStock ? 'Maximum stock reached' : ''}
                    >
                        <MdAdd className="text-sm" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between">
                <button
                    onClick={onRemove}
                    disabled={isPending}
                    className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <MdDelete className="text-xl" />
                </button>
                <p className="font-bold text-gray-800">₱ {Number(item.subtotal).toLocaleString()}</p>
            </div>
        </div>
    );
}

function Cart() {
    const navigate = useNavigate();
    const user = getUser();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [toast, setToast] = useState('');
    const [pendingIds, setPendingIds] = useState(new Set());
    const [clearing, setClearing] = useState(false);

    function showToast(msg) { setToast(msg);setTimeout(() => setToast(''), 2500);}

    function setPending(id, isPending) {
        setPendingIds((prev) => {  const next = new Set(prev); if (isPending) next.add(id); else next.delete(id);return next;}); }

    useEffect(() => {
        if (!user) { navigate('/'); return; }
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await cartAPI.getCart();
            setCart(res.data);
        } catch {
            setLoadError('Failed to load your cart.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (item, newQty) => {
        if (newQty > item.product.stock) {
            showToast(`Only ${item.product.stock} in stock.`);
            return;
        }
        setPending(item.id, true);
        try {
            const res = await cartAPI.updateItem(item.id, newQty);
            setCart(res.data);
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to update quantity.');
        } finally {
            setPending(item.id, false);
        }
    };

    const handleRemove = async (item) => {
        setPending(item.id, true);
        try {
            const res = await cartAPI.removeItem(item.id);
            setCart(res.data);
            showToast('Item removed.');
        } catch {
            showToast('Failed to remove item.');
            setPending(item.id, false);
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Clear your entire cart?')) return;
        setClearing(true);
        try {
            await cartAPI.clearCart();
            setCart((prev) => ({ ...prev, items: [], total: 0, item_count: 0 }));
        } catch {
            showToast('Failed to clear cart.');
        } finally {
            setClearing(false);
        }
    };

    const handleLogout = async () => {
        try { await cartAPI.logout?.(); } catch { /* ignore */ }
        clearAuthData();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="w-full bg-black py-1 px-2 flex justify-end items-center gap-x-3">
                <button className="text-white border-2 border-white bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-sm px-3 py-1 transition" onClick={() => navigate('/forum')}>FORUM</button>
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
                        <button
                            onClick={() => navigate('/cart')}
                            className="relative bg-white text-orange-500 p-3 rounded hover:bg-gray-100 transition-colors"
                        >
                            <MdShoppingCart className="text-xl" />
                            {cart?.item_count > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cart.item_count > 99 ? '99+' : cart.item_count}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors"
                        >
                            <FaUser className="text-sm" />
                            <span>{user?.firstName || 'Account'}</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Cart content */}
            <main className="flex-1">
                <div className="max-w-4xl mx-auto px-6 py-8">

                    <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <MdShoppingCart className="text-orange-500" />
                        Shopping Cart
                        {cart?.item_count > 0 && (
                            <span className="text-sm font-normal text-gray-500">({cart.item_count} items)</span>
                        )}
                    </h1>

                    {loadError && (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            ❌ {loadError}
                        </div>
                    )}

                    {!cart || cart.items.length === 0 ? (
                        <div className="text-center py-20">
                            <MdShoppingCart className="text-gray-300 text-8xl mx-auto mb-4" />
                            <p className="text-gray-500 text-xl font-semibold">Your cart is empty</p>
                            <p className="text-gray-400 text-sm mt-2">Add some products to get started</p>
                            <button
                                onClick={() => navigate('/pc-stores')}
                                className="mt-6 bg-orange-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Shop Now
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cart.items.map((item) => (
                                    <CartItemRow
                                        key={item.id}
                                        item={item}
                                        isPending={pendingIds.has(item.id)}
                                        onIncrease={() => handleUpdateQuantity(item, item.quantity + 1)}
                                        onDecrease={() => handleUpdateQuantity(item, item.quantity - 1)}
                                        onRemove={() => handleRemove(item)}
                                    />
                                ))}

                                <button
                                    onClick={handleClearCart}
                                    disabled={clearing}
                                    className="text-red-500 text-sm font-semibold hover:underline disabled:opacity-50"
                                >
                                    {clearing ? 'Clearing…' : '🗑️ Clear Cart'}
                                </button>
                            </div>

                            {/* Order summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
                                    <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex justify-between">
                                            <span>Items ({cart.item_count})</span>
                                            <span>₱ {Number(cart.total).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span className="text-green-600">Free</span>
                                        </div>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between font-bold text-gray-800">
                                        <span>Total</span>
                                        <span className="text-orange-500 text-xl">₱ {Number(cart.total).toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="w-full mt-6 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Checkout
                                    </button>
                                    <button onClick={() => navigate('/pc-stores')}className="w-full mt-2 border border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm"> Continue Shopping</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Toast message={toast} />
        </div>
    );
}

export default Cart;
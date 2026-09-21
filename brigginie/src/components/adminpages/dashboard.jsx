import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, RefreshCw, Search, ShieldCheck, XCircle } from 'lucide-react';
import { adminAPI, clearAuthData, getUser } from '../../services/api';

const STATUS_STYLES = {
  paid: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-rose-100 text-rose-700',
};

function peso(value) {
  return `₱${Number(value || 0).toLocaleString()}`;
}

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = () => {
    setLoading(true);
    setError('');
    Promise.all([adminAPI.getOrders(filter), adminAPI.getProducts()])
      .then(([ordersResponse, productsResponse]) => {
        setOrders(ordersResponse.data);
        setProducts(productsResponse.data);
      })
      .catch(() => setError('Unable to load payment records. Check the API connection and try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, [filter]);

  const visibleOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();
    return !query || [order.purchase_number, order.customer, order.payment_method]
      .some((value) => String(value || '').toLowerCase().includes(query));
  });
  const paid = orders.filter((order) => order.status === 'paid');
  const pending = orders.filter((order) => order.status === 'pending');
  const revenue = paid.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const visibleProducts = products.filter((product) => product.is_active && product.stock > 0);

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <header className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">RIGGINIE CONTROL</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight">Payment & checkout audit</h1>
          </div>
          <button onClick={() => { clearAuthData(); window.location.href = '/login'; }} className="text-sm font-semibold text-slate-300 hover:text-orange-400">Sign out</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="text-sm font-semibold text-orange-600">Operations overview</p><p className="mt-1 text-slate-500">Review whether customer checkouts have reached a confirmed payment state.</p></div>
          <button onClick={loadOrders} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-500 disabled:opacity-60"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh</button>
        </div>

        {error && <div role="alert" className="mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700"><AlertTriangle size={18} />{error}</div>}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={<ShieldCheck />} label="Paid orders" value={paid.length} tone="text-emerald-600" />
          <Stat icon={<Clock3 />} label="Needs review" value={pending.length} tone="text-amber-600" />
          <Stat icon={<XCircle />} label="Cancelled" value={orders.filter((order) => order.status === 'cancelled').length} tone="text-rose-600" />
          <Stat icon={<CheckCircle2 />} label="Confirmed revenue" value={peso(revenue)} tone="text-orange-600" />
          <Stat icon={<ShieldCheck />} label="Products visible" value={`${visibleProducts.length}/${products.length}`} tone="text-sky-600" />
        </section>

        <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5"><h2 className="text-lg font-black">Product visibility check</h2><p className="mt-1 text-sm text-slate-500">Products marked visible and in stock can appear in the customer store.</p></div>
          {products.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No products have been added yet.</div> : <div className="overflow-x-auto"><table className="w-full min-w-190 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Website state</th></tr></thead><tbody className="divide-y divide-slate-100">{products.map((product) => { const visible = product.is_active && product.stock > 0; return <tr key={product.id} className="hover:bg-slate-50"><td className="px-5 py-4 font-bold text-slate-900">{product.name}</td><td className="px-5 py-4 text-slate-600">{product.category}</td><td className="px-5 py-4 font-semibold">{peso(product.price)}</td><td className="px-5 py-4 text-slate-600">{product.stock}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${visible ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>{visible ? 'Visible in store' : product.is_active ? 'Hidden: out of stock' : 'Hidden: inactive'}</span></td></tr>; })}</tbody></table></div>}
        </section>

        <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div><h2 className="text-lg font-black">Checkout records</h2><p className="mt-1 text-sm text-slate-500">{visibleOrders.length} record{visibleOrders.length === 1 ? '' : 's'} shown</p></div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search purchase or customer" className="w-full outline-none sm:w-56" /></label>
              <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none"><option value="">All statuses</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option></select>
            </div>
          </div>
          {loading ? <div className="p-12 text-center text-sm text-slate-500">Loading payment records...</div> : visibleOrders.length === 0 ? <div className="p-12 text-center text-sm text-slate-500">No checkout records match this view.</div> : (
            <div className="overflow-x-auto"><table className="w-full min-w-190 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Purchase</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Checkout time</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleOrders.map((order) => <tr key={order.id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-bold text-slate-900">{order.purchase_number}</p><p className="mt-1 text-xs text-slate-400">#{order.id}</p></td><td className="px-5 py-4 text-slate-600">{order.customer}</td><td className="px-5 py-4 font-semibold capitalize text-slate-700">{order.payment_method.replace('_', ' ')}</td><td className="px-5 py-4 font-black">{peso(order.total)}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-600'}`}>{order.status}</span></td><td className="px-5 py-4 text-slate-500">{new Date(order.created_at).toLocaleString()}</td></tr>)}</tbody></table></div>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({ icon, label, value, tone }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 ${tone}`}>{icon}</div><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-slate-950">{value}</p></article>;
}

export default Dashboard;

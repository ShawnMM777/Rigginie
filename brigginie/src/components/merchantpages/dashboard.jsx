import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Area, AreaChart, CartesianGrid,  Line, ResponsiveContainer,  Tooltip, XAxis, YAxis, } from 'recharts';
import { authAPI, clearAuthData, getUser, merchantAPI } from '../../services/api';
import logo from '../../assets/logo.png';

const STATUS_STYLES = {
    sold_out: 'bg-red-100 text-red-700',
    low_stock: 'bg-amber-100 text-amber-800',
    in_stock: 'bg-emerald-100 text-emerald-700',
    unavailable: 'bg-gray-100 text-gray-500',
};

function peso(value) {
    return `₱${Number(value || 0).toLocaleString()}`;
}

function SalesTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    const revenue = payload.find((item) => item.dataKey === 'revenue')?.value;
    const units = payload.find((item) => item.dataKey === 'units_sold')?.value;

    return (
        <div className="min-w-36 rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-xl">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
            <div className="flex items-center justify-between gap-5 text-xs">
                <span className="flex items-center gap-1.5 text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-orange-500" /> Revenue
                </span>
                <span className="font-bold text-gray-900">{peso(revenue)}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-5 text-xs">
                <span className="flex items-center gap-1.5 text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-slate-400" /> Units
                </span>
                <span className="font-bold text-gray-900">{units ?? 0}</span>
            </div>
        </div>
    );
}

function MerchantDashboard() {
    const navigate = useNavigate();
    const user = getUser();
    const [days, setDays] = useState(30);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        merchantAPI.getSales(days)
            .then((res) => {
                setData(res.data);
                setError('');
            })
            .catch(() => setError('Could not load branch sales. Sign in as a merchant and try again.'))
            .finally(() => setLoading(false));
    }, [days]);

    const handleLogout = async () => {
        try {
            await authAPI.logout(localStorage.getItem('refresh_token'));
        } catch {
            /* still clear local session */
        } finally {
            clearAuthData();
            window.location.href = '/login';
        }
    };

    const chart = (data?.sales_by_day || []).map((row) => ({
        ...row,
        label: row.date?.slice(5),
        units_sold: Number(row.units_sold || 0),
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="w-full bg-orange-500 py-4 px-6 md:px-10 shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <button onClick={() => navigate('/merchant')} className="flex items-center gap-3">
                        <img src={logo} alt="Rigginie" className="h-10 w-auto" />
                        <span className="text-white font-bold hidden sm:inline">Merchant</span>
                    </button>
                    <div className="text-white text-sm font-semibold truncate">
                        {data?.branch_label || 'Your branch'}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white text-orange-500 font-semibold px-4 py-2 rounded hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-10 py-8 space-y-8">
                <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-orange-500">Branch sales</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
                        Welcome{user?.firstName ? `, ${user.firstName}` : ''}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Track products, sold-out stock, and revenue for {data?.branch_label || 'your assigned branch'}.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
                )}

                <div className="flex gap-2">
                    {[7, 30, 90].map((d) => (
                        <button
                            key={d}
                            onClick={() => {
                                setLoading(true);
                                setDays(d);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                                days === d ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-200 text-gray-600'
                            }`}
                        >
                            {d} days
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Revenue" value={peso(data?.revenue)} />
                    <StatCard label="Units sold" value={data?.units_sold ?? '—'} />
                    <StatCard label="Products" value={data?.product_count ?? '—'} />
                    <StatCard label="Sold out" value={data?.sold_out_count ?? '—'} accent />
                </div>

                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-gray-900">Sales overview</h2>
                                <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-600">Live</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-400">Revenue and units sold over the last {days} days</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-500" /> Revenue</span>
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400" /> Units sold</span>
                        </div>
                    </div>
                    {loading ? (
                        <div className="h-72 flex items-center justify-center text-gray-400 text-sm">Loading chart...</div>
                    ) : (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <AreaChart data={chart} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.28} />
                                            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="#eef0f2" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                                    <YAxis yAxisId="revenue" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(value) => `₱${value >= 1000 ? `${value / 1000}k` : value}`} />
                                    <YAxis yAxisId="units" orientation="right" hide />
                                    <Tooltip content={<SalesTooltip />} cursor={{ stroke: '#fdba74', strokeDasharray: '4 4' }} />
                                    <Area yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#f97316" fill="url(#salesFill)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#f97316', stroke: '#fff', strokeWidth: 3 }} />
                                    <Line yAxisId="units" type="monotone" dataKey="units_sold" stroke="#94a3b8" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#94a3b8', stroke: '#fff', strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </section>

                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Sold out</h2>
                    <p className="text-sm text-gray-500 mb-4">Items at this branch with 0 stock.</p>
                    {!data?.sold_out_products?.length ? (
                        <p className="text-sm text-gray-400">No sold-out products right now.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b">
                                        <th className="py-2 font-semibold">Product</th>
                                        <th className="py-2 font-semibold">Category</th>
                                        <th className="py-2 font-semibold">Price</th>
                                        <th className="py-2 font-semibold">Units sold</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.sold_out_products.map((p) => (
                                        <tr key={p.id} className="border-b border-gray-100">
                                            <td className="py-2.5 font-medium text-gray-800">{p.name}</td>
                                            <td className="py-2.5 text-gray-500">{p.category}</td>
                                            <td className="py-2.5">{peso(p.price)}</td>
                                            <td className="py-2.5">{p.units_sold}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Branch products</h2>
                    <p className="text-sm text-gray-500 mb-4">Inventory and sales for this location.</p>
                    {!data?.products?.length ? (
                        <p className="text-sm text-gray-400">No products assigned to this branch yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b">
                                        <th className="py-2 font-semibold">Product</th>
                                        <th className="py-2 font-semibold">Stock</th>
                                        <th className="py-2 font-semibold">Status</th>
                                        <th className="py-2 font-semibold">Sold</th>
                                        <th className="py-2 font-semibold">Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.products.map((p) => (
                                        <tr key={p.id} className="border-b border-gray-100">
                                            <td className="py-2.5">
                                                <p className="font-medium text-gray-800">{p.name}</p>
                                                <p className="text-xs text-gray-400">{p.category} · {peso(p.price)}</p>
                                            </td>
                                            <td className="py-2.5">{p.stock}</td>
                                            <td className="py-2.5">
                                                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${STATUS_STYLES[p.status] || STATUS_STYLES.in_stock}`}>
                                                    {p.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-2.5">{p.units_sold}</td>
                                            <td className="py-2.5 font-semibold text-orange-600">{peso(p.revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

function StatCard({ label, value, accent }) {
    return (
        <div className={`rounded-2xl border p-4 ${accent ? 'bg-red-50 border-red-100' : 'bg-white border-gray-200'}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
            <p className={`text-2xl font-black mt-1 ${accent ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
        </div>
    );
}

export default MerchantDashboard;

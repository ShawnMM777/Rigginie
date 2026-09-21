import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, Check, LockKeyhole, ShieldCheck } from 'lucide-react';
import { authAPI, cartAPI, getUser, orderAPI } from '../../../services/api';
import gcash from '../../../assets/gcash.png';
import maya from '../../../assets/maya.png';
import btc from '../../../assets/btc.png';
import usdt from '../../../assets/usdt.png';
import xmr from '../../../assets/xmr.png';
import paypal from '../../../assets/paypal.png';
import homecredit from '../../../assets/homecredit.png';
import ethereum from '../../../assets/ethereum.png';
import mastercard from '../../../assets/mastercard.png';

const PAYMENT_METHODS = [
  { id: 'gcash', label: 'GCash', image: gcash },
  { id: 'paymaya', label: 'PayMaya', image: maya },
  { id: 'debit_card', label: 'Debit Card' },
  { id: 'bitcoin', label: 'Bitcoin', image: btc },
  { id: 'usdt', label: 'USDT', image: usdt },
  { id: 'monero', label: 'Monero', image: xmr },
  { id: 'paypal', label: 'PayPal', image: paypal },
  { id: 'homecredit', label: 'Home Credit', image: homecredit },
  { id: 'ethereum', label: 'Ethereum', image: ethereum },
  { id: 'mastercard', label: 'Mastercard', image: mastercard },
];
const BITCOIN_ADDRESS = import.meta.env.VITE_BITCOIN_ADDRESS || 'YOUR_BITCOIN_ADDRESS';

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('gcash');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [deliveryDetails, setDeliveryDetails] = useState({ address: '', contact: '' });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [purchaseNumber, setPurchaseNumber] = useState('');

  useEffect(() => {
    if (!getUser()) {
      navigate('/login');
      return;
    }

    Promise.all([cartAPI.getCart(), authAPI.getProfile()])
      .then(([cartResponse, profileResponse]) => {
        setCart(cartResponse.data);
        setDeliveryDetails({
          address: profileResponse.data.addresses || '',
          contact: profileResponse.data.contact || '',
        });
      })
      .catch(() => setError('Unable to load your cart or profile. Please try again.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setPlacingOrder(true);
    try {
      const { data } = await orderAPI.createOrder({
        shipping_address: deliveryDetails.address,
        contact_number: deliveryDetails.contact,
        payment_method: selectedMethod,
      });
      setPurchaseNumber(data.purchase_number);
      setNotice(`Payment recorded via ${PAYMENT_METHODS.find((method) => method.id === selectedMethod).label}. Order status: ${data.status}.`);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to complete your order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (error || !cart?.items?.length) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <section className="bg-white border border-gray-200 rounded-xl p-8 text-center max-w-md shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-600 mt-2">{error || 'Add a product before continuing to checkout.'}</p>
          <button onClick={() => navigate('/cart')} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg">Return to cart</button>
        </section>
      </main>
    );
  }

  const needsCardDetails = selectedMethod === 'debit_card' || selectedMethod === 'mastercard';

  if (purchaseNumber) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-6">
        <section className="w-full max-w-lg rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Check size={28} /></div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Order confirmed</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Thanks for your order</h1>
          <p className="mt-3 text-slate-500">Keep this purchase number for delivery updates and support.</p>
          <p className="mt-6 rounded-xl bg-slate-950 px-5 py-4 font-mono text-2xl font-black tracking-widest text-orange-400">{purchaseNumber}</p>
          <button onClick={() => navigate('/')} className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600">Continue shopping</button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <header className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-xl font-black tracking-[0.18em] text-orange-400">RIGGINIE</button>
          <div className="flex items-center gap-2 text-sm text-slate-300"><LockKeyhole size={15} /> Secure checkout</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-8 md:mb-10">
          <button onClick={() => navigate('/cart')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-6"><ArrowLeft size={16} /> Back to cart</button>
          <div>
            <p className="text-orange-500 font-bold text-xs tracking-[0.2em]">FINAL STEP</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Complete your order</h1>
            <p className="text-slate-500 mt-2">Choose how you would like to pay for your Rigginie build.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8 items-start">
          <form onSubmit={handlePlaceOrder} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div><h2 className="text-xl font-extrabold">Payment method</h2><p className="text-sm text-slate-500 mt-1">Select one option to continue.</p></div>
              <div className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shrink-0"><ShieldCheck size={14} /> Protected</div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <label key={method.id} className={`relative border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${selectedMethod === method.id ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'}`}>
                  <input type="radio" name="payment_method" value={method.id} checked={selectedMethod === method.id} onChange={() => { setSelectedMethod(method.id); setNotice(''); }} className="sr-only" />
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedMethod === method.id ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'}`}>{selectedMethod === method.id && <Check size={13} strokeWidth={3} />}</span>
                  <span className="w-12 h-8 flex items-center justify-center shrink-0 bg-white rounded-md">
                    {method.image ? <img src={method.image} alt="" className="max-h-8 max-w-12 object-contain" /> : <span className="text-xs font-bold text-gray-500">CARD</span>}
                  </span>
                  <span className="font-bold text-slate-800 text-sm">{method.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="mb-4"><h3 className="text-lg font-extrabold">Delivery details</h3><p className="mt-1 text-sm text-slate-500">Where should we send your order?</p></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Delivery address
                  <textarea required value={deliveryDetails.address} onChange={(event) => setDeliveryDetails({ ...deliveryDetails, address: event.target.value })} placeholder="House number, street, barangay, city, province" rows={3} className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Contact number
                  <input required value={deliveryDetails.contact} onChange={(event) => setDeliveryDetails({ ...deliveryDetails, contact: event.target.value.replace(/[^0-9+\- ]/g, '') })} placeholder="09XXXXXXXXX" inputMode="tel" maxLength={15} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
              </div>
            </div>

            {selectedMethod === 'bitcoin' && (
              <div className="mt-7 border-t border-slate-100 pt-6 flex flex-col items-center text-center">
                <h3 className="font-bold text-gray-900">Bitcoin payment QR</h3>
                <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                  <QRCodeCanvas value={`bitcoin:${BITCOIN_ADDRESS}?amount=${cart.total}`} size={200} includeMargin />
                </div>
                <p className="mt-3 text-sm text-gray-600">Scan to send the exact checkout total.</p>
                <p className="mt-1 text-xs font-mono text-gray-500 break-all">{BITCOIN_ADDRESS}</p>
              </div>
            )}

            {needsCardDetails && (
              <div className="mt-6 border-t border-gray-100 pt-5 grid sm:grid-cols-2 gap-4">
                <label className="sm:col-span-2 text-sm font-semibold text-gray-700">Card number
                  <input required value={cardDetails.number} onChange={(event) => setCardDetails({ ...cardDetails, number: event.target.value })} placeholder="1234 5678 9012 3456" inputMode="numeric" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="text-sm font-semibold text-gray-700">Expiry date
                  <input required value={cardDetails.expiry} onChange={(event) => setCardDetails({ ...cardDetails, expiry: event.target.value })} placeholder="MM/YY" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="text-sm font-semibold text-gray-700">CVV
                  <input required value={cardDetails.cvv} onChange={(event) => setCardDetails({ ...cardDetails, cvv: event.target.value })} placeholder="123" inputMode="numeric" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
              </div>
            )}

            {notice && <p className="mt-5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3">{notice}</p>}
            {error && <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={placingOrder} className="mt-7 w-full rounded-xl bg-slate-950 py-3.5 font-bold text-white transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60">{placingOrder ? 'Confirming order...' : 'Complete payment and place order'}</button>
          </form>

          <aside className="bg-slate-950 text-white rounded-2xl p-6 shadow-[0_18px_50px_rgba(15,23,42,0.18)] lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-extrabold">Order summary</h2><span className="text-xs text-slate-400">{cart.item_count} item{cart.item_count === 1 ? '' : 's'}</span></div>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {cart.items.map((item) => <div key={item.id} className="flex justify-between gap-3 text-sm"><span className="text-slate-300 leading-5">{item.quantity} x {item.product.name}</span><span className="font-bold text-white whitespace-nowrap">₱ {Number(item.subtotal).toLocaleString()}</span></div>)}
            </div>
            <div className="border-t border-slate-700 mt-6 pt-5 flex justify-between items-end"><span className="text-slate-300">Total</span><span className="text-2xl font-black text-orange-400">₱ {Number(cart.total).toLocaleString()}</span></div>
            <div className="mt-6 pt-5 border-t border-slate-800 flex gap-3 text-xs text-slate-400 leading-5"><ShieldCheck size={17} className="text-emerald-400 shrink-0 mt-0.5" /><span>Your payment details are handled securely. Stock is checked before order confirmation.</span></div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;

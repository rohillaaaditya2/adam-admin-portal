'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Package, Truck, Phone, MessageCircle, ExternalLink, RefreshCw,
  ChevronDown, ChevronRight, AlertCircle, CheckCircle2, Clock,
  BookOpen, Plus, Search, Filter, X
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface OrderItem { title: string; image: string; qty: number; price: number; }
interface OrderCourier { name: string; awb: string; trackingUrl: string; dispatchedAt?: string; }
interface OrderShiprocket { orderId: string; shipmentId: string; pushedAt?: string; }
interface OrderPayment { provider: 'cod' | 'prepaid' | 'upi' | 'card'; subtotal: number; deliveryCharge: number; codFee: number; total: number; paid: boolean; transactionId: string; }
interface OrderCustomer { name: string; phone: string; email: string; address: { line1: string; line2: string; city: string; state: string; pincode: string; }; }
interface Order {
  _id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  payment: OrderPayment;
  status: string;
  courier: OrderCourier;
  shiprocket: OrderShiprocket;
  notes: string;
  createdAt: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const COURIERS = ['Delhivery','India Post','DTDC','Blue Dart','Shiprocket','Amazon Shipping','Xpressbees','Ecom Express','Shadowfax','Professional Courier'];

const COURIER_TRACKING: Record<string, string> = {
  'Delhivery': 'https://www.delhivery.com/track/package/{awb}',
  'India Post': 'https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx',
  'DTDC': 'https://www.dtdc.in/tracking.asp?TrkType=cnno&strTrknNo={awb}',
  'Blue Dart': 'https://www.bluedart.com/tracking?awb={awb}',
  'Shiprocket': 'https://shiprocket.co/tracking/{awb}',
  'Amazon Shipping': 'https://track.amazon.in/tracking/{awb}',
  'Xpressbees': 'https://www.xpressbees.com/shipment/tracking?awbNo={awb}',
  'Ecom Express': 'https://ecomexpress.in/tracking/?awb_field={awb}',
  'Shadowfax': 'https://tracker.shadowfax.in/?awb={awb}',
  'Professional Courier': 'https://www.tpcindia.com/tracking.aspx?id={awb}&type=0&service=0'
};

const ORDER_STATUSES = ['pending','confirmed','packed','shipped','out_for_delivery','delivered','cancelled','returned'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  packed: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
};

function genTrackingUrl(courier: string, awb: string): string {
  const tmpl = COURIER_TRACKING[courier] || '';
  return tmpl ? tmpl.replace('{awb}', encodeURIComponent(awb)) : '';
}

function fmt(n: number) { return `₹${Number(n || 0).toFixed(0)}`; }

// ─── Book Cover Thumbnail ─────────────────────────────────────────────────────
function BookCover({ src, title }: { src: string; title: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0 border border-pink-200">
        <BookOpen className="w-6 h-6 text-pink-400" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={title}
      onError={() => setErr(true)}
      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200"
    />
  );
}

// ─── COD Yellow Box ───────────────────────────────────────────────────────────
function CodBox({ payment }: { payment: OrderPayment }) {
  if (payment.provider !== 'cod') return null;
  return (
    <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">💰</span>
        <span className="font-bold text-amber-800 text-lg">CASH ON DELIVERY</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 border border-amber-200">
          <div className="text-xs text-gray-500 mb-1">Subtotal</div>
          <div className="font-semibold text-gray-800">{fmt(payment.subtotal)}</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-amber-200">
          <div className="text-xs text-gray-500 mb-1">Delivery Charge</div>
          <div className="font-semibold text-gray-800">{fmt(payment.deliveryCharge)}</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-amber-200">
          <div className="text-xs text-gray-500 mb-1">COD Fee</div>
          <div className="font-semibold text-gray-800">{fmt(payment.codFee)}</div>
        </div>
        <div className="bg-amber-400 rounded-lg p-3">
          <div className="text-xs text-amber-900 mb-1 font-medium">Collect on Delivery</div>
          <div className="font-extrabold text-amber-900 text-xl">{fmt(payment.total)}</div>
        </div>
      </div>
    </div>
  );
}

// ─── WhatsApp Green Box ───────────────────────────────────────────────────────
function WhatsAppBox({ order }: { order: Order }) {
  const phone = `91${order.customer.phone.replace(/\D/g, '').slice(-10)}`;
  const name = order.customer.name;
  const num = order.orderNumber;
  const awb = order.courier?.awb || '';
  const courier = order.courier?.name || '';
  const trackUrl = order.courier?.trackingUrl || '';

  function openWa(text: string) {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  }

  const confirmationMsg = `नमस्ते ${name} जी! 🙏\n\nShubham Xerox & Book Store पर आपका ऑर्डर #${num} मिल गया है। 📦\n\nआपकी किताबें जल्द ही पैक होकर डिस्पैच होंगी।\n\nधन्यवाद! 😊`;
  const trackingMsg = `नमस्ते ${name} जी! 🚚\n\nआपकी किताबें ${courier} द्वारा भेज दी गई हैं!\n\nAWB नंबर: ${awb}\n\nलाइव ट्रैकिंग: ${trackUrl}\n\nधन्यवाद! 📦`;
  const directChatMsg = `नमस्ते ${name} जी, आपके ऑर्डर #${num} के बारे में बात करनी है।`;

  return (
    <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">💬</span>
        <span className="font-bold text-green-800 text-lg">WhatsApp Automation</span>
        <span className="text-sm text-green-600 ml-1">+91{order.customer.phone.slice(-10)}</span>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => openWa(confirmationMsg)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Send Confirmation Greeting
        </button>
        <button
          onClick={() => openWa(trackingMsg)}
          disabled={!awb}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Truck className="w-4 h-4" />
          Send Tracking Link on WhatsApp
          {!awb && <span className="text-xs opacity-75">(AWB required)</span>}
        </button>
        <button
          onClick={() => openWa(directChatMsg)}
          className="flex items-center gap-2 bg-white border-2 border-green-400 hover:bg-green-50 text-green-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Phone className="w-4 h-4" />
          Chat on WhatsApp
        </button>
      </div>
    </div>
  );
}

// ─── Shiprocket Blue Box ──────────────────────────────────────────────────────
function ShiprocketBox({ order, token, onPush }: { order: Order; token: string; onPush: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function pushToShiprocket() {
    setLoading(true); setMsg('');
    try {
      const r = await fetch(`/api/admin/orders/${order._id}/shiprocket-push`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const d = await r.json();
      if (!r.ok) { setMsg(`❌ ${d.error || 'Push failed'}`); return; }
      onPush(d.shiprocket);
      setMsg('✅ Pushed to Shiprocket successfully!');
    } catch { setMsg('❌ Network error'); }
    finally { setLoading(false); }
  }

  const sr = order.shiprocket;
  return (
    <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🚀</span>
        <span className="font-bold text-blue-800 text-lg">Shiprocket Integration</span>
      </div>
      {sr?.orderId && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white rounded-lg p-2 border border-blue-200">
            <div className="text-xs text-gray-500">SR Order ID</div>
            <div className="font-mono text-sm font-semibold text-blue-700">#{sr.orderId}</div>
          </div>
          <div className="bg-white rounded-lg p-2 border border-blue-200">
            <div className="text-xs text-gray-500">Shipment ID</div>
            <div className="font-mono text-sm font-semibold text-blue-700">{sr.shipmentId}</div>
          </div>
        </div>
      )}
      {!sr?.orderId && (
        <p className="text-sm text-blue-600 mb-3">Not yet pushed to Shiprocket.</p>
      )}
      <button
        onClick={pushToShiprocket}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors w-full justify-center"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {sr?.orderId ? 'Re-push Order to Shiprocket' : 'Push Order to Shiprocket'}
      </button>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </div>
  );
}

// ─── Courier Quick-Select Pills ───────────────────────────────────────────────
function CourierSection({ order, token, onUpdate }: { order: Order; token: string; onUpdate: (updated: Order) => void }) {
  const [courierName, setCourierName] = useState(order.courier?.name || '');
  const [awb, setAwb] = useState(order.courier?.awb || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const computedUrl = courierName && awb ? genTrackingUrl(courierName, awb) : '';

  async function saveShipping() {
    if (!courierName) { setMsg('❌ Please select a courier'); return; }
    setSaving(true); setMsg('');
    try {
      const r = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ courier: { name: courierName, awb, trackingUrl: computedUrl }, status: awb ? 'shipped' : order.status })
      });
      const d = await r.json();
      if (!r.ok) { setMsg(`❌ ${d.error || 'Save failed'}`); return; }
      onUpdate(d.order);
      setMsg('✅ Shipping info saved!');
    } catch { setMsg('❌ Network error'); }
    finally { setSaving(false); }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📦</span>
        <span className="font-bold text-gray-700">Courier & Shipping</span>
      </div>

      {/* Courier Pills */}
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-500 mb-2 block">Quick Select Courier</label>
        <div className="flex flex-wrap gap-1.5">
          {COURIERS.map(c => (
            <button
              key={c}
              onClick={() => setCourierName(c)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                courierName === c
                  ? 'bg-pink-600 text-white border-pink-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-pink-400 hover:text-pink-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* AWB Input */}
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-500 mb-1 block">AWB / Tracking Number</label>
        <input
          type="text"
          value={awb}
          onChange={e => setAwb(e.target.value)}
          placeholder="Enter AWB number..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
        />
      </div>

      {/* Auto-generated tracking URL */}
      {computedUrl && (
        <div className="mb-3 p-2 bg-white border border-green-200 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Auto-generated Tracking URL</div>
          <a href={computedUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 break-all hover:underline flex items-center gap-1">
            {computedUrl} <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        </div>
      )}

      <button
        onClick={saveShipping}
        disabled={saving}
        className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors w-full"
      >
        {saving ? 'Saving...' : 'Save Shipping Info'}
      </button>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </div>
  );
}

// ─── Status Update ────────────────────────────────────────────────────────────
function StatusUpdate({ order, token, onUpdate }: { order: Order; token: string; onUpdate: (o: Order) => void }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function save() {
    setSaving(true); setMsg('');
    try {
      const r = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const d = await r.json();
      if (!r.ok) { setMsg(`❌ ${d.error}`); return; }
      onUpdate(d.order);
      setMsg('✅ Status updated!');
    } catch { setMsg('❌ Network error'); }
    finally { setSaving(false); }
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
      >
        {ORDER_STATUSES.map(s => (
          <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
        ))}
      </select>
      <button
        onClick={save}
        disabled={saving || status === order.status}
        className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
      >
        {saving ? '...' : 'Update'}
      </button>
      {msg && <span className="text-sm">{msg}</span>}
    </div>
  );
}

// ─── Order Detail Drawer ──────────────────────────────────────────────────────
function OrderDetailDrawer({ order: initialOrder, token, onClose, onUpdated }: {
  order: Order; token: string; onClose: () => void; onUpdated: (o: Order) => void;
}) {
  const [order, setOrder] = useState<Order>(initialOrder);

  function handleUpdate(updated: Order) {
    setOrder(updated);
    onUpdated(updated);
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <div>
            <div className="font-bold text-lg text-gray-800">#{order.orderNumber}</div>
            <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('en-IN')}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1">
          {/* COD Box */}
          <CodBox payment={order.payment} />

          {/* Status */}
          <StatusUpdate order={order} token={token} onUpdate={handleUpdate} />

          {/* Items with book covers */}
          <div className="mb-4">
            <div className="font-semibold text-gray-700 mb-2 text-sm">Order Items</div>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <BookCover src={item.image} title={item.title} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm truncate">{item.title}</div>
                    <div className="text-xs text-gray-500">Qty: {item.qty} × {fmt(item.price)}</div>
                  </div>
                  <div className="font-semibold text-gray-700 text-sm">{fmt(item.qty * item.price)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="font-semibold text-gray-700 mb-1 text-sm">Customer</div>
            <div className="text-sm text-gray-700 font-medium">{order.customer.name}</div>
            <div className="text-sm text-gray-600">📞 {order.customer.phone}</div>
            {order.customer.email && <div className="text-sm text-gray-600">✉️ {order.customer.email}</div>}
            {order.customer.address?.line1 && (
              <div className="text-xs text-gray-500 mt-1">
                {order.customer.address.line1}{order.customer.address.line2 ? ', ' + order.customer.address.line2 : ''}<br />
                {order.customer.address.city}, {order.customer.address.state} - {order.customer.address.pincode}
              </div>
            )}
          </div>

          {/* WhatsApp Box */}
          <WhatsAppBox order={order} />

          {/* Courier Pills */}
          <CourierSection order={order} token={token} onUpdate={handleUpdate} />

          {/* Shiprocket Box */}
          <ShiprocketBox
            order={order}
            token={token}
            onPush={sr => handleUpdate({ ...order, shiprocket: sr })}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Create Order Modal ───────────────────────────────────────────────────────
function CreateOrderModal({ token, onCreated, onClose }: { token: string; onCreated: () => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', line1: '', city: '', state: '', pincode: '',
    itemTitle: '', itemQty: '1', itemPrice: '', deliveryCharge: '69', codFee: '49', provider: 'cod' as string
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit() {
    if (!form.name || !form.phone || !form.itemTitle || !form.itemPrice) { setMsg('❌ Name, phone, book title & price required'); return; }
    setSaving(true); setMsg('');
    const subtotal = Number(form.itemPrice) * Number(form.itemQty);
    const deliveryCharge = Number(form.deliveryCharge);
    const codFee = form.provider === 'cod' ? Number(form.codFee) : 0;
    try {
      const r = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, phone: form.phone, email: form.email, address: { line1: form.line1, city: form.city, state: form.state, pincode: form.pincode } },
          items: [{ title: form.itemTitle, qty: Number(form.itemQty), price: Number(form.itemPrice) }],
          payment: { provider: form.provider, subtotal, deliveryCharge, codFee, total: subtotal + deliveryCharge + codFee }
        })
      });
      const d = await r.json();
      if (!r.ok) { setMsg(`❌ ${d.error}`); return; }
      onCreated();
    } catch { setMsg('❌ Network error'); }
    finally { setSaving(false); }
  }

  const f = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <span className="font-bold text-lg">New Order</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-gray-500">Customer Name*</label><input value={form.name} onChange={e => f('name', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="Ramesh Gupta" /></div>
            <div><label className="text-xs text-gray-500">Phone*</label><input value={form.phone} onChange={e => f('phone', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="9876543210" /></div>
          </div>
          <div><label className="text-xs text-gray-500">Email</label><input value={form.email} onChange={e => f('email', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="email@example.com" /></div>
          <div><label className="text-xs text-gray-500">Address Line 1</label><input value={form.line1} onChange={e => f('line1', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="House no, Street..." /></div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="text-xs text-gray-500">City</label><input value={form.city} onChange={e => f('city', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
            <div><label className="text-xs text-gray-500">State</label><input value={form.state} onChange={e => f('state', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
            <div><label className="text-xs text-gray-500">Pincode</label><input value={form.pincode} onChange={e => f('pincode', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          </div>
          <hr />
          <div><label className="text-xs text-gray-500">Book Title*</label><input value={form.itemTitle} onChange={e => f('itemTitle', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="NCERT Class 10 Science..." /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-gray-500">Qty</label><input type="number" min="1" value={form.itemQty} onChange={e => f('itemQty', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
            <div><label className="text-xs text-gray-500">Price (₹)*</label><input type="number" value={form.itemPrice} onChange={e => f('itemPrice', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="200" /></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="text-xs text-gray-500">Payment</label>
              <select value={form.provider} onChange={e => f('provider', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1">
                <option value="cod">COD</option><option value="prepaid">Prepaid</option><option value="upi">UPI</option>
              </select>
            </div>
            <div><label className="text-xs text-gray-500">Delivery (₹)</label><input type="number" value={form.deliveryCharge} onChange={e => f('deliveryCharge', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
            {form.provider === 'cod' && <div><label className="text-xs text-gray-500">COD Fee (₹)</label><input type="number" value={form.codFee} onChange={e => f('codFee', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>}
          </div>
          {msg && <p className="text-sm">{msg}</p>}
          <button onClick={submit} disabled={saving} className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white rounded-xl py-3 font-semibold transition-colors">
            {saving ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props { token: string; }

export function OrderManagementModule({ token }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const r = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (r.ok) { setOrders(d.orders || []); setTotal(d.total || 0); }
    } catch {}
    finally { setLoading(false); }
  }, [token, page, search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  function handleUpdated(updated: Order) {
    setOrders(prev => prev.map(o => o._id === updated._id ? updated : o));
    if (selected?._id === updated._id) setSelected(updated);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">📦 Order Management</h2>
          <p className="text-sm text-gray-500">{total} total orders</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order#, name, phone..."
            className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-pink-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-500 bg-white"
        >
          <option value="">All Status</option>
          {ORDER_STATUSES.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
          ))}
        </select>
        <button onClick={fetchOrders} className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50">
          <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No orders found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map(order => (
            <div
              key={order._id}
              onClick={() => setSelected(order)}
              className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-pink-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Book thumbnails */}
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <BookCover key={i} src={item.image} title={item.title} />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 border-2 border-white">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 text-sm">#{order.orderNumber}</div>
                    <div className="text-xs text-gray-500 truncate">{order.customer.name} · {order.customer.phone}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {order.items.slice(0, 2).map(i => i.title).join(', ')}{order.items.length > 2 ? ` +${order.items.length - 2} more` : ''}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <div className="font-bold text-gray-700 text-sm">₹{order.payment.total}</div>
                  {order.payment.provider === 'cod' && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">COD</span>
                  )}
                </div>
              </div>
              {order.courier?.awb && (
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <Truck className="w-3 h-3" />
                  {order.courier.name} · AWB: {order.courier.awb}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between mt-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Previous</button>
          <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total / 20)}</span>
          <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Next</button>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <OrderDetailDrawer
          order={selected}
          token={token}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}

      {/* Create Modal */}
      {creating && (
        <CreateOrderModal
          token={token}
          onCreated={() => { setCreating(false); fetchOrders(); }}
          onClose={() => setCreating(false)}
        />
      )}
    </div>
  );
}


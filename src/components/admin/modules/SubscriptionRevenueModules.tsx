'use client';
import React from 'react';
import { Plus, Check, Search, Trash2, Download } from 'lucide-react';
import { Row } from '../types';
import { downloadAdminFile } from '@/lib/api';

interface SubscriptionRevenueProps {
  tab: string;
  // Plan Builder
  plans: Row[];
  showCreatePlanModal: boolean;
  setShowCreatePlanModal: (v: boolean) => void;
  newPlanName: string;
  setNewPlanName: (v: string) => void;
  newPlanPriceINR: number;
  setNewPlanPriceINR: (v: number) => void;
  newPlanDurationDays: number;
  setNewPlanDurationDays: (v: number) => void;
  newPlanInterestLimit: number;
  setNewPlanInterestLimit: (v: number) => void;
  newPlanAndroidSku: string;
  setNewPlanAndroidSku: (v: string) => void;
  newPlanIosSku: string;
  setNewPlanIosSku: (v: string) => void;
  newPlanFeatures: string;
  setNewPlanFeatures: (v: string) => void;
  newPlanChat: boolean;
  setNewPlanChat: (v: boolean) => void;
  createNewPlan: () => void;
  editingPlanPrices: { [id: string]: number };
  setEditingPlanPrices: (v: { [id: string]: number }) => void;
  updatePlanPrice: (id: string, price: number) => void;
  togglePlanActive: (id: string, current: boolean) => void;
  // Subscribers
  subs: Row[];
  extendSubscription: (id: string, days?: number) => void;
  // Transactions
  transactions: Row[];
  transactionFilter: 'all' | 'ONLINE_GATEWAY' | 'OFFLINE_TRANSFER';
  setTransactionFilter: (f: 'all' | 'ONLINE_GATEWAY' | 'OFFLINE_TRANSFER') => void;
  transactionSearch: string;
  setTransactionSearch: (s: string) => void;
  // Refunds
  refunds: Row[];
  refundOrderId: string;
  setRefundOrderId: (s: string) => void;
  refundAmount: string;
  setRefundAmount: (s: string) => void;
  refundReason: string;
  setRefundReason: (s: string) => void;
  act: (fn: () => Promise<any>) => Promise<void>;
  post: (path: string, body: any) => Promise<any>;
  setError: (e: string) => void;
  // Coupons
  coupons: Row[];
  newCouponCode: string;
  setNewCouponCode: (s: string) => void;
  newCouponType: 'percentage' | 'fixed';
  setNewCouponType: (t: 'percentage' | 'fixed') => void;
  newCouponDiscount: number;
  setNewCouponDiscount: (n: number) => void;
  newCouponAmount: number;
  setNewCouponAmount: (n: number) => void;
  newCouponPlanId: string;
  setNewCouponPlanId: (s: string) => void;
  newCouponValidDays: number;
  setNewCouponValidDays: (n: number) => void;
  newCouponUsageLimit: number;
  setNewCouponUsageLimit: (n: number) => void;
  addCoupon: () => void;
  toggleCoupon: (id: string, current: boolean) => void;
  deleteCoupon: (id: string) => void;
}

export function SubscriptionRevenueModules(props: SubscriptionRevenueProps) {
  const {
    tab,
    plans, showCreatePlanModal, setShowCreatePlanModal, newPlanName, setNewPlanName,
    newPlanPriceINR, setNewPlanPriceINR, newPlanDurationDays, setNewPlanDurationDays,
    newPlanInterestLimit, setNewPlanInterestLimit, newPlanAndroidSku, setNewPlanAndroidSku,
    newPlanIosSku, setNewPlanIosSku, newPlanFeatures, setNewPlanFeatures, newPlanChat, setNewPlanChat,
    createNewPlan, editingPlanPrices, setEditingPlanPrices, updatePlanPrice, togglePlanActive,
    subs, extendSubscription,
    transactions, transactionFilter, setTransactionFilter, transactionSearch, setTransactionSearch,
    refunds, refundOrderId, setRefundOrderId, refundAmount, setRefundAmount, refundReason, setRefundReason,
    act, post, setError,
    coupons, newCouponCode, setNewCouponCode, newCouponType, setNewCouponType,
    newCouponDiscount, setNewCouponDiscount, newCouponAmount, setNewCouponAmount,
    newCouponPlanId, setNewCouponPlanId, newCouponValidDays, setNewCouponValidDays,
    newCouponUsageLimit, setNewCouponUsageLimit, addCoupon, toggleCoupon, deleteCoupon
  } = props;

  // MODULE 10: SUBSCRIPTION PLAN BUILDER
  if (tab === 'Subscription Plan Builder') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 10 · MEMBERSHIP PRICING &amp; CHARGES</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Subscription Plan Charges &amp; Pricing Control</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Admin determines all subscription charges directly. Modify fees, toggle active plans, or configure new membership tiers.
            </p>
          </div>
          <button className="btn btn-shaadi" onClick={() => setShowCreatePlanModal(!showCreatePlanModal)}>
            <Plus size={16} /> {showCreatePlanModal ? 'Close Plan Form' : 'Create New Subscription Plan'}
          </button>
        </div>

        {showCreatePlanModal && (
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 14, padding: 22, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 16, color: '#0f172a' }}>Add New Membership Tier</h3>
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <label>Plan Name *<input value={newPlanName} onChange={(e) => setNewPlanName(e.target.value)} placeholder="e.g. Diamond VIP (1 Year)" /></label>
              <label>Price in INR (₹) *<input type="number" min={0} value={newPlanPriceINR} onChange={(e) => setNewPlanPriceINR(Number(e.target.value))} /></label>
              <label>Duration (Days) *<input type="number" min={1} value={newPlanDurationDays} onChange={(e) => setNewPlanDurationDays(Number(e.target.value))} /></label>
              <label>Interest Requests Limit<input type="number" min={0} value={newPlanInterestLimit} onChange={(e) => setNewPlanInterestLimit(Number(e.target.value))} /></label>
              <label>Android Store SKU<input value={newPlanAndroidSku} onChange={(e) => setNewPlanAndroidSku(e.target.value)} placeholder="com.adamneve.sub1y" /></label>
              <label>iOS Store SKU<input value={newPlanIosSku} onChange={(e) => setNewPlanIosSku(e.target.value)} placeholder="com.adamneve.ios1y" /></label>
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Key Features (comma-separated):</label>
              <input value={newPlanFeatures} onChange={(e) => setNewPlanFeatures(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }} placeholder="Unlimited Messages, Verified Badge, 24/7 Relationship Advisor" />
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="chatEnabledCheck" checked={newPlanChat} onChange={(e) => setNewPlanChat(e.target.checked)} style={{ width: 18, height: 18 }} />
              <label htmlFor="chatEnabledCheck" style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Enable Direct 1-on-1 Chat for this tier</label>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
              <button className="btn btn-dark" onClick={createNewPlan}><Check size={16} /> Save &amp; Publish Plan</button>
              <button className="btn btn-outline" onClick={() => setShowCreatePlanModal(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 24 }}>
          {plans.map((p) => {
            const currentPrice = editingPlanPrices[p._id] !== undefined ? editingPlanPrices[p._id] : p.priceINR;
            return (
              <div key={p._id} className="plan-card" style={{ padding: 22, border: p.active !== false ? '1px solid #cbd5e1' : '1px dashed #94a3b8', opacity: p.active !== false ? 1 : 0.75 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="eyebrow tiny" style={{ color: '#c2185b' }}>DURATION: {p.durationDays} DAYS</span>
                  <span className={`status-pill ${p.active !== false ? 'success' : 'warn'}`} style={{ fontSize: 9 }}>
                    {p.active !== false ? 'Active Plan' : 'Inactive'}
                  </span>
                </div>
                <h3 style={{ margin: '6px 0 10px', fontSize: 18 }}>{p.name}</h3>

                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, margin: '10px 0', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Admin Controlled Price (INR):
                  </label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>₹</span>
                    <input
                      type="number"
                      min={0}
                      value={currentPrice}
                      onChange={(e) => setEditingPlanPrices({ ...editingPlanPrices, [p._id]: Number(e.target.value) })}
                      style={{ width: 110, padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontWeight: 800, fontSize: 15 }}
                    />
                    <button
                      className="btn btn-shaadi btn-sm"
                      style={{ padding: '6px 12px', fontSize: 11 }}
                      onClick={() => updatePlanPrice(p._id, currentPrice)}
                    >
                      Update Price
                    </button>
                  </div>
                </div>

                <ul style={{ margin: '14px 0', paddingLeft: 18, fontSize: 12, color: '#475569' }}>
                  {(p.features || []).map((f: string, i: number) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 14 }}>
                  Android SKU: <code>{p.storeProductIdAndroid || 'com.adamneve.sub3m'}</code><br />
                  iOS SKU: <code>{p.storeProductIdIos || 'com.adamneve.ios3m'}</code>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-outline btn-sm full"
                    style={{ fontSize: 11 }}
                    onClick={() => togglePlanActive(p._id, p.active !== false)}
                  >
                    {p.active !== false ? 'Deactivate Tier' : 'Activate Tier'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // MODULE 11: SUBSCRIBER MANAGEMENT
  if (tab === 'Subscriber Management') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 11 · ACTIVE &amp; EXPIRED SUBSCRIBERS</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Subscriber Management &amp; Access Controls</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Audit active paid subscribers, manage renewal grace periods, and extend membership access.
          </p>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Member Phone</th>
                <th style={{ padding: '10px 14px' }}>Plan Name</th>
                <th style={{ padding: '10px 14px' }}>Validity End Date</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px' }}>Staff Actions</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{s.user?.phone || 'Member'}</td>
                  <td style={{ padding: '10px 14px' }}>{s.plan?.name || 'Community Plan'}</td>
                  <td style={{ padding: '10px 14px' }}>{new Date(s.endsAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={`status-pill ${new Date(s.endsAt) > new Date() ? 'success' : 'danger'}`}>
                      {new Date(s.endsAt) > new Date() ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button className="chip-action" onClick={() => extendSubscription(s._id, 30)}>
                      +30 Days Extension
                    </button>
                  </td>
                </tr>
              ))}
              {!subs.length && (
                <tr>
                  <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                    No active subscribers found in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  // MODULE 12: TRANSACTION MANAGEMENT
  if (tab === 'Transaction Management') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 12 · BILLING &amp; FINANCIAL AUDIT</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Online &amp; Offline Payment Transactions</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Live stream of gateway orders (Razorpay/Cards/UPI) and approved bank transfer requests.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ padding: '8px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#16a34a', display: 'block' }}>Total Settled Volume</span>
              <strong style={{ fontSize: 16, color: '#15803d' }}>
                ₹{transactions.reduce((acc, t) => acc + (t.status === 'Completed' ? Number(t.amountINR || 0) : 0), 0).toLocaleString('en-IN')}
              </strong>
            </div>
            <div style={{ padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Transactions</span>
              <strong style={{ fontSize: 16 }}>{transactions.length}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by phone or reference ID..."
              value={transactionSearch}
              onChange={(e) => setTransactionSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              className="chip-action"
              onClick={() => downloadAdminFile('/admin/exports/csv?type=transactions', 'AdamNEve_Financial_Transactions.csv')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#059669', color: '#fff', borderColor: '#059669', fontWeight: 600 }}
              title="Download financial transactions as an Excel-ready CSV"
            >
              <Download size={14} /> Export to Excel
            </button>
            {(['all', 'ONLINE_GATEWAY', 'OFFLINE_TRANSFER'] as const).map((f) => (
              <button
                key={f}
                className={`chip-action ${transactionFilter === f ? 'active' : ''}`}
                onClick={() => setTransactionFilter(f)}
                style={transactionFilter === f ? { background: '#c2185b', color: '#fff', borderColor: '#c2185b' } : {}}
              >
                {f === 'all' ? 'ALL PAYMENTS' : (f === 'ONLINE_GATEWAY' ? 'ONLINE GATEWAY' : 'OFFLINE BANK')}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Channel / Type</th>
                <th style={{ padding: '10px 14px' }}>Member Phone</th>
                <th style={{ padding: '10px 14px' }}>Purchased Plan</th>
                <th style={{ padding: '10px 14px' }}>Reference / Order ID</th>
                <th style={{ padding: '10px 14px' }}>Amount (INR)</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter((t) => {
                  if (transactionFilter !== 'all' && t.type !== transactionFilter) return false;
                  if (transactionSearch) {
                    const q = transactionSearch.toLowerCase();
                    return t.phone?.includes(q) || t.reference?.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((t) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px' }}>{new Date(t.date).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`status-pill ${t.type === 'ONLINE_GATEWAY' ? 'success' : ''}`} style={t.type !== 'ONLINE_GATEWAY' ? { background: '#f1f5f9', color: '#475569' } : {}}>
                        {t.type === 'ONLINE_GATEWAY' ? '⚡ ONLINE' : '🏦 BANK SLIP'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{t.phone}</td>
                    <td style={{ padding: '10px 14px' }}>{t.planName}</td>
                    <td style={{ padding: '10px 14px' }}><code>{t.reference}</code></td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f766e' }}>₹{Number(t.amountINR).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`status-pill ${t.status === 'Completed' ? 'success' : (t.status === 'Pending' ? 'warn' : 'danger')}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              {!transactions.length && (
                <tr>
                  <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                    No payment transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  // MODULE 13: REFUND & CANCELLATION
  if (tab === 'Refund & Cancellation') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 13 · BILLING ADJUSTMENTS</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Member Refunds &amp; Subscription Cancellations</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Record authorized cancellations, dispute chargebacks, and track approved refund ledger records.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '10px 14px' }}>Date</th>
                  <th style={{ padding: '10px 14px' }}>Amount</th>
                  <th style={{ padding: '10px 14px' }}>Order Reference</th>
                  <th style={{ padding: '10px 14px' }}>Reason &amp; Status</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((r) => (
                  <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#b91c1c' }}>-₹{r.amountINR}</td>
                    <td style={{ padding: '10px 14px' }}><code>{r.gatewayOrderId || 'MANUAL-REF'}</code></td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className="status-pill success">{r.status}</span> · {r.reason}
                    </td>
                  </tr>
                ))}
                {!refunds.length && (
                  <tr>
                    <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                      No refund records logged. All transactions are settled.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: 15 }}>Issue Authorized Member Refund</h4>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              <label>
                Gateway Order ID / Transaction Reference *
                <input
                  placeholder="e.g. order_PlX10293 or Reference #"
                  value={refundOrderId}
                  onChange={(e) => setRefundOrderId(e.target.value)}
                />
              </label>
              <label>
                Refund Amount (INR) *
                <input
                  type="number"
                  placeholder="e.g. 1999"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </label>
              <label>
                Cancellation / Refund Reason *
                <textarea
                  rows={3}
                  placeholder="e.g. Candidate wedding finalized, requested plan cancellation within 7 days grace period."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </label>
            </div>
            <button
              className="btn btn-dark full"
              style={{ marginTop: 14 }}
              onClick={() => {
                if (!refundOrderId || !refundAmount) {
                  setError('Gateway Order ID and Refund Amount are required');
                  return;
                }
                act(async () => {
                  await post('/admin/refunds', {
                    gatewayOrderId: refundOrderId,
                    amountINR: Number(refundAmount),
                    reason: refundReason || 'Member requested cancellation'
                  });
                  setRefundOrderId('');
                  setRefundAmount('');
                  setRefundReason('');
                });
              }}
            >
              Process &amp; Record Refund
            </button>
          </div>
        </div>
      </section>
    );
  }

  // MODULE 14: COUPON & OFFERS
  if (tab === 'Coupon & Offers') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 14 · DISCOUNTS &amp; PROMOTIONS</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Coupons &amp; Promotional Offers</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Admin creates promotional coupons for members. Manage discount rates, usage limits, and plan restrictions.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {coupons.map((c) => {
                const isExpired = c.validTill && new Date(c.validTill) <= new Date();
                const isLimitReached = c.usageLimit > 0 && (c.usedCount || 0) >= c.usageLimit;
                return (
                  <div key={c._id} style={{ padding: 18, border: '1px dashed #c2185b', borderRadius: 12, background: c.active && !isExpired && !isLimitReached ? '#fdf2f8' : '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#c2185b', letterSpacing: '0.08em' }}>{c.code}</span>
                        <span className={`status-pill ${c.active && !isExpired && !isLimitReached ? 'success' : 'danger'}`} style={{ fontSize: 9 }}>
                          {!c.active ? 'Disabled' : isExpired ? 'Expired' : isLimitReached ? 'Limit Reached' : 'Active Promo'}
                        </span>
                      </div>
                      <strong style={{ display: 'block', fontSize: 22, color: '#1e293b', margin: '4px 0' }}>
                        {c.discountType === 'fixed' ? `₹${c.discountAmountINR || 0} FLAT OFF` : `${c.discountPercent || 0}% OFF`}
                      </strong>
                      <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
                        {c.usageLimit > 0 ? (
                          <div>Usage: <b>{c.usedCount || 0} / {c.usageLimit} uses</b></div>
                        ) : (
                          <div>Usage: <b>{c.usedCount || 0} uses (Unlimited)</b></div>
                        )}
                        {c.validTill && (
                          <div>Expires: <b>{new Date(c.validTill).toLocaleDateString('en-IN')}</b></div>
                        )}
                        {c.planId && (
                          <div>Plan: <b>Specific Plan Only</b></div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid #fce7f3' }}>
                      <button
                        className="btn btn-outline btn-sm full"
                        style={{ fontSize: 11, padding: '5px 8px' }}
                        onClick={() => toggleCoupon(c._id, c.active)}
                      >
                        {c.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 11, padding: '5px 8px', color: '#dc2626', borderColor: '#fca5a5' }}
                        onClick={() => deleteCoupon(c._id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {!coupons.length && (
              <div style={{ padding: 36, textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: 12, border: '1px dashed #cbd5e1' }}>
                No coupons created yet. Use the form on the right to create your first discount coupon.
              </div>
            )}
          </div>

          <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 15 }}>Create Promo Coupon</h4>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              <label>Coupon Code *
                <input
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BLESSED30 or WELCOME500"
                />
              </label>
              <label>Discount Type
                <select value={newCouponType} onChange={(e) => setNewCouponType(e.target.value as any)}>
                  <option value="percentage">Percentage (% Discount)</option>
                  <option value="fixed">Fixed Amount (₹ Flat OFF)</option>
                </select>
              </label>
              {newCouponType === 'percentage' ? (
                <label>Discount Percentage (%):
                  <input
                    type="number"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    min={1}
                    max={100}
                  />
                </label>
              ) : (
                <label>Flat Discount Amount (₹):
                  <input
                    type="number"
                    value={newCouponAmount}
                    onChange={(e) => setNewCouponAmount(Number(e.target.value))}
                    min={10}
                  />
                </label>
              )}
              <label>Applicable Plan
                <select value={newCouponPlanId} onChange={(e) => setNewCouponPlanId(e.target.value)}>
                  <option value="">All Membership Plans</option>
                  {plans.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} (₹{p.priceINR})</option>
                  ))}
                </select>
              </label>
              <label>Valid For (Days):
                <input
                  type="number"
                  value={newCouponValidDays}
                  onChange={(e) => setNewCouponValidDays(Number(e.target.value))}
                  min={1}
                  max={365}
                />
              </label>
              <label>Usage Limit (0 for Unlimited):
                <input
                  type="number"
                  value={newCouponUsageLimit}
                  onChange={(e) => setNewCouponUsageLimit(Number(e.target.value))}
                  min={0}
                />
              </label>
            </div>
            <button className="btn btn-dark full" style={{ marginTop: 14 }} onClick={addCoupon}>
              Publish Promo Coupon
            </button>
          </div>
        </div>
      </section>
    );
  }

  return null;
}

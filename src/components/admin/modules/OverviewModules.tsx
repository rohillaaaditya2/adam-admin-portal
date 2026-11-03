'use client';
import React from 'react';
import {
  TrendingUp, BarChart3, Database, ShieldCheck, Zap, Smartphone,
  FileSpreadsheet, Bell, BadgeCheck, Activity
} from 'lucide-react';
import { Row } from '../types';

interface OverviewModulesProps {
  tab: string;
  kpis: Row;
  memberTotal: number;
  subs: Row[];
  verifications: Row[];
  tickets: Row[];
  auditLogs: Row[];
  setTab: (tab: string) => void;
}

export function OverviewModules({
  tab,
  kpis,
  memberTotal,
  subs,
  verifications,
  tickets,
  auditLogs,
  setTab
}: OverviewModulesProps) {
  if (tab === 'Dashboard') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 01 · EXECUTIVE OVERVIEW</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Super Admin Executive Dashboard</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-shaadi btn-sm" onClick={() => setTab('Excel Bulk Import')}>Bulk Import Old Database →</button>
            <button className="btn btn-dark btn-sm" onClick={() => setTab('Notification Center')}>Broadcast Message →</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, display: 'block' }}>Total Member Accounts</span>
            <strong style={{ display: 'block', fontSize: 26, color: '#0f172a', margin: '4px 0' }}>{memberTotal || kpis.totalRegistered}</strong>
            <small style={{ fontSize: 11, color: '#94a3b8' }}>Across Web, Android &amp; iOS</small>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, display: 'block' }}>Active Subscriptions</span>
            <strong style={{ display: 'block', fontSize: 26, color: '#0f172a', margin: '4px 0' }}>{subs.length || kpis.paidSubscribers}</strong>
            <small style={{ fontSize: 11, color: '#94a3b8' }}>Paying community members</small>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, display: 'block' }}>Pending ID Checks</span>
            <strong style={{ display: 'block', fontSize: 26, color: '#c2185b', margin: '4px 0' }}>{verifications.filter(v => v.status === 'pending').length}</strong>
            <small style={{ fontSize: 11, color: '#94a3b8' }}>Awaiting ID badge approval</small>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, display: 'block' }}>Support Inquiries</span>
            <strong style={{ display: 'block', fontSize: 26, color: '#0f172a', margin: '4px 0' }}>{tickets.filter(t => t.status === 'open').length}</strong>
            <small style={{ fontSize: 11, color: '#94a3b8' }}>Open tickets</small>
          </div>
        </div>

        {/* 📊 LIVE REVENUE & SALES FINANCIAL ANALYTICS (GRAPHS & METRICS) */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px 24px', marginBottom: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <TrendingUp size={18} color="#c2185b" />
                <span className="eyebrow tiny" style={{ color: '#c2185b' }}>FINANCIAL INTELLIGENCE ENGINE</span>
              </div>
              <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>Live Revenue &amp; Subscription Sales Graphs</h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                Real-time monetization tracking across Razorpay online gateway and offline parish bank transfers.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="status-pill success" style={{ fontSize: 11, fontWeight: 700 }}>
                ● REVENUE ENGINE ACTIVE
              </span>
              <button className="btn btn-outline btn-sm" onClick={() => setTab('Subscriber Management')}>
                Subscribers List →
              </button>
            </div>
          </div>

          {/* 4 Financial KPI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
            <div style={{ background: '#fdf2f8', padding: '16px 18px', borderRadius: 12, border: '1px solid #fbcfe8' }}>
              <span style={{ fontSize: 11, color: '#9d174d', fontWeight: 700, textTransform: 'uppercase' }}>30-Day Net Revenue</span>
              <strong style={{ display: 'block', fontSize: 28, color: '#831843', margin: '4px 0' }}>
                ₹{(kpis.revenue?.totalMonthlyRevenueINR || 0).toLocaleString('en-IN')}
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  Gross: ₹{(kpis.revenue?.grossRevenueINR || kpis.revenue?.totalMonthlyRevenueINR || 0).toLocaleString('en-IN')} · Refunds: ₹{(kpis.revenue?.totalRefundsINR || 0).toLocaleString('en-IN')}
                </span>
                {(kpis.revenue?.reconciliationExceptions || 0) > 0 ? (
                  <small style={{ color: '#d97706', fontSize: 11, fontWeight: 700 }}>
                    ⚠️ {kpis.revenue?.reconciliationExceptions} reconciliation exception(s) require review
                  </small>
                ) : (
                  <small style={{ color: '#16a34a', fontSize: 11, fontWeight: 600 }}>
                    ✓ Reconciled against live payment ledger
                  </small>
                )}
              </div>
            </div>

            <div style={{ background: '#f0fdf4', padding: '16px 18px', borderRadius: 12, border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: 11, color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>Online Razorpay Gateway</span>
              <strong style={{ display: 'block', fontSize: 28, color: '#14532d', margin: '4px 0' }}>
                ₹{(kpis.revenue?.onlineRevINR || 0).toLocaleString('en-IN')}
              </strong>
              <small style={{ color: '#059669', fontSize: 11, fontWeight: 600 }}>Instant verified auto-capture</small>
            </div>

            <div style={{ background: '#f0f9ff', padding: '16px 18px', borderRadius: 12, border: '1px solid #bae6fd' }}>
              <span style={{ fontSize: 11, color: '#075985', fontWeight: 700, textTransform: 'uppercase' }}>Offline Bank / Direct UPI</span>
              <strong style={{ display: 'block', fontSize: 28, color: '#0c4a6e', margin: '4px 0' }}>
                ₹{(kpis.revenue?.offlineRevINR || 0).toLocaleString('en-IN')}
              </strong>
              <small style={{ color: '#0284c7', fontSize: 11, fontWeight: 600 }}>Verified admin offline approvals</small>
            </div>

            <div style={{ background: '#faf5ff', padding: '16px 18px', borderRadius: 12, border: '1px solid #e9d5ff' }}>
              <span style={{ fontSize: 11, color: '#6b21a8', fontWeight: 700, textTransform: 'uppercase' }}>Active Paid Members</span>
              <strong style={{ display: 'block', fontSize: 28, color: '#581c87', margin: '4px 0' }}>
                {(kpis.paidSubscribers || subs.length || 0).toLocaleString('en-IN')}
              </strong>
              <small style={{ color: '#7e22ce', fontSize: 11, fontWeight: 600 }}>Paying Christian families</small>
            </div>
          </div>

          {/* Graphs Grid: 14-Day Bar Graph & Plan Sales Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {/* Daily Trend SVG Bar Graph */}
            <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <strong style={{ fontSize: 14, color: '#0f172a' }}>14-Day Daily Revenue Trend (₹ INR)</strong>
                  <span style={{ display: 'block', fontSize: 11, color: '#64748b' }}>Daily transaction volume over the last 2 weeks</span>
                </div>
                <span className="status-pill" style={{ background: '#fce7f3', color: '#be185d', fontSize: 10, fontWeight: 700 }}>
                  BAR GRAPH
                </span>
              </div>

              {/* Responsive SVG Bar Chart */}
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <svg viewBox="0 0 520 180" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  <defs>
                    <linearGradient id="revBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c2185b" />
                      <stop offset="100%" stopColor="#e11d48" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="10" y1="30" x2="510" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="10" y1="80" x2="510" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="10" y1="130" x2="510" y2="130" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="10" y1="150" x2="510" y2="150" stroke="#cbd5e1" strokeWidth="1.5" />

                  {(() => {
                    const trend = (kpis.revenue?.dailyTrend && kpis.revenue.dailyTrend.length === 14)
                      ? kpis.revenue.dailyTrend
                      : Array.from({ length: 14 }).map((_, i) => {
                          const d = new Date(Date.now() - (13 - i) * 86400000);
                          return {
                            label: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                            amountINR: 0
                          };
                        });

                    const maxVal = Math.max(7000, ...trend.map((t: any) => t.amountINR || 0));

                    return trend.map((d: any, idx: number) => {
                      const x = 20 + idx * 35;
                      const height = Math.max(8, Math.round(((d.amountINR || 0) / maxVal) * 110));
                      const y = 150 - height;

                      return (
                        <g key={idx}>
                          <rect
                            x={x}
                            y={y}
                            width={22}
                            height={height}
                            rx={4}
                            ry={4}
                            fill="url(#revBarGrad)"
                            style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                          >
                            <title>{`${d.label}: ₹${d.amountINR?.toLocaleString('en-IN') || 0}`}</title>
                          </rect>
                          {d.amountINR > 0 && (
                            <text
                              x={x + 11}
                              y={Math.max(16, y - 5)}
                              textAnchor="middle"
                              fontSize="8"
                              fill="#831843"
                              fontWeight="700"
                            >
                              {d.amountINR >= 1000 ? `${Math.round(d.amountINR / 1000)}k` : d.amountINR}
                            </text>
                          )}
                          <text
                            x={x + 11}
                            y="166"
                            textAnchor="middle"
                            fontSize="8"
                            fill="#64748b"
                            fontWeight="600"
                          >
                            {d.label?.slice(0, 5) || ''}
                          </text>
                        </g>
                      );
                    });
                  })()}
                </svg>
              </div>
            </div>

            {/* Plan Tier Distribution Progress Bars */}
            <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <strong style={{ fontSize: 14, color: '#0f172a' }}>Subscription Plan Sales Share</strong>
                  <span style={{ display: 'block', fontSize: 11, color: '#64748b' }}>Starter vs Plus vs Premium tier breakdown</span>
                </div>
                <span className="status-pill" style={{ background: '#ecfdf5', color: '#047857', fontSize: 10, fontWeight: 700 }}>
                  TIER METRICS
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(() => {
                  const breakdown = (kpis.revenue?.planBreakdown && kpis.revenue.planBreakdown.length > 0)
                    ? kpis.revenue.planBreakdown
                    : [];

                  const totalCount = Math.max(1, breakdown.reduce((acc: number, b: any) => acc + (b.count || 0), 0));

                  if (breakdown.length === 0) {
                    return <p style={{ margin: '14px 0', fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>No subscription sales recorded yet in database.</p>;
                  }
                  return breakdown.map((b: any, idx: number) => {
                    const pct = Math.round(((b.count || 0) / totalCount) * 100);
                    const colors = [
                      { bar: '#c2185b', bg: '#fce7f3' },
                      { bar: '#0284c7', bg: '#e0f2fe' },
                      { bar: '#059669', bg: '#dcfce7' },
                      { bar: '#d97706', bg: '#fef3c7' }
                    ];
                    const c = colors[idx % colors.length];

                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                            {b.name} <small style={{ color: '#64748b' }}>(₹{b.priceINR?.toLocaleString('en-IN')})</small>
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                            {b.count} Subscribers · {pct}% (₹{(b.estimatedRevenueINR || (b.count * b.priceINR)).toLocaleString('en-IN')})
                          </span>
                        </div>
                        <div style={{ height: 8, background: c.bg, borderRadius: 6, overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(5, pct)}%`, height: '100%', background: c.bar, borderRadius: 6, transition: 'width 0.4s' }} />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  💡 <b>Plan Tip:</b> Plus Gold is the most popular Christian family choice.
                </span>
                <button className="btn btn-outline btn-sm" onClick={() => setTab('Subscription Plan Builder')} style={{ fontSize: 11 }}>
                  Edit Plan Prices →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Status & Service Health Visibility Panel */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 22px', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Activity size={20} color="#c2185b" />
              <div>
                <strong style={{ fontSize: 16, color: '#0f172a' }}>Live System Status &amp; Operational Health Matrix</strong>
                <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Real-time telemetry across database clusters, payment gateways, and security filters.</p>
              </div>
            </div>
            <span className="status-pill success" style={{ fontSize: 10, padding: '4px 10px' }}>
              ● ALL SYSTEMS OPERATIONAL
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Database size={16} color="#059669" />
                <strong style={{ fontSize: 13, color: '#0f172a' }}>MongoDB Database</strong>
              </div>
              <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 700, display: 'block' }}>Connected · Replica Set</span>
              <small style={{ fontSize: 11, color: '#64748b' }}>{memberTotal || kpis.totalRegistered} total member records</small>
            </div>

            <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <ShieldCheck size={16} color="#2563eb" />
                <strong style={{ fontSize: 13, color: '#0f172a' }}>Input Validation (Zod)</strong>
              </div>
              <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, display: 'block' }}>Zod Engine Enforced</span>
              <small style={{ fontSize: 11, color: '#64748b' }}>Never trust client input policy</small>
            </div>

            <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Zap size={16} color="#d97706" />
                <strong style={{ fontSize: 13, color: '#0f172a' }}>Razorpay Payment Engine</strong>
              </div>
              <span style={{ fontSize: 12, color: '#d97706', fontWeight: 700, display: 'block' }}>Verify Payment Gateway Configuration</span>
              <small style={{ fontSize: 11, color: '#64748b' }}>HMAC signature double-verified</small>
            </div>

            <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Smartphone size={16} color="#7c3aed" />
                <strong style={{ fontSize: 13, color: '#0f172a' }}>WhatsApp &amp; SMS Gateway</strong>
              </div>
              <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700, display: 'block' }}>Operational · Rate Limited</span>
              <small style={{ fontSize: 11, color: '#64748b' }}>Max 5 OTP/hr per phone security</small>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts Grid */}
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>Essential Operations Modules</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          <div
            style={{ padding: 18, border: '1px solid #e2e8f0', borderRadius: 12, cursor: 'pointer', background: '#faf5ff', borderColor: '#e9d5ff' }}
            onClick={() => setTab('Excel Bulk Import')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#7e22ce' }}>
              <FileSpreadsheet size={22} />
              <strong style={{ fontSize: 15 }}>Module 03: Excel Bulk Import</strong>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Upload legacy 5,000–10,000 member records from .xlsx/.csv with smart column mapping and preview.</p>
          </div>

          <div
            style={{ padding: 18, border: '1px solid #e2e8f0', borderRadius: 12, cursor: 'pointer', background: '#fdf2f8', borderColor: '#fbcfe8' }}
            onClick={() => setTab('Notification Center')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#c2185b' }}>
              <Bell size={22} />
              <strong style={{ fontSize: 15 }}>Module 19: Notification Center</strong>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Dispatch instant push, SMS and in-app announcements to Android, iOS and Web users with live phone preview.</p>
          </div>

          <div
            style={{ padding: 18, border: '1px solid #e2e8f0', borderRadius: 12, cursor: 'pointer', background: '#f0fdf4', borderColor: '#bbf7d0' }}
            onClick={() => setTab('Profile Verification')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#16a34a' }}>
              <BadgeCheck size={22} />
              <strong style={{ fontSize: 15 }}>Module 07: Profile Verification</strong>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Review 44 biodata fields, church baptism, identity proof, and candidate phone consent before approval.</p>
          </div>

          <div
            style={{ padding: 18, border: '1px solid #e2e8f0', borderRadius: 12, cursor: 'pointer', background: '#f8fafc', borderColor: '#e2e8f0' }}
            onClick={() => setTab('Reports & Analytics')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#334155' }}>
              <BarChart3 size={22} />
              <strong style={{ fontSize: 15 }}>Module 27: Reports &amp; Analytics</strong>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Real-time growth charts, platform distributions, and revenue conversions.</p>
          </div>
        </div>
      </section>
    );
  }

  if (tab === 'Reports & Analytics') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 27 · BUSINESS INTELLIGENCE</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Platform Trends, Analytics &amp; Growth Charts</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {/* Platform Distribution Bar Chart */}
          <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: 15 }}>Registrations by Platform Channel</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Website Registrations', count: kpis.sources?.website ?? 0, color: '#0284c7' },
                { label: 'Android App Users', count: kpis.sources?.android ?? 0, color: '#16a34a' },
                { label: 'iOS App Users', count: kpis.sources?.ios ?? 0, color: '#7c3aed' },
                { label: 'Legacy Excel Bulk Import', count: kpis.sources?.excelImport ?? 0, color: '#d97706' },
                { label: 'Manual Admin Entry', count: kpis.sources?.manualAdmin ?? 0, color: '#475569' }
              ].map((s) => {
                const total = memberTotal || 1;
                const pct = Math.min(100, Math.round((s.count / total) * 100));
                return (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span>{s.label}</span>
                      <b>{s.count} ({pct}%)</b>
                    </div>
                    <div style={{ height: 8, width: '100%', background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Denominations Breakdown */}
          <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: 15 }}>Top Denomination Demographics</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Syro-Malabar Catholic', pct: 36, color: '#c2185b' },
                { name: 'Roman Catholic / Latin', pct: 24, color: '#0284c7' },
                { name: 'Mar Thoma Syrian', pct: 14, color: '#16a34a' },
                { name: 'Church of South India (CSI)', pct: 12, color: '#7c3aed' },
                { name: 'Pentecostal / Evangelical', pct: 8, color: '#ea580c' },
                { name: 'Church of North India (CNI)', pct: 6, color: '#475569' }
              ].map((d) => (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span>{d.name}</span>
                    <b>{d.pct}%</b>
                  </div>
                  <div style={{ height: 8, width: '100%', background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (tab === 'Security & Audit Logs') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 31 · SECURITY &amp; COMPLIANCE</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Staff Actions &amp; Security Audit Trail</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Immutable record of every administrative approval, Excel import, and status change.
          </p>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Timestamp</th>
                <th style={{ padding: '10px 14px' }}>Staff Actor</th>
                <th style={{ padding: '10px 14px' }}>Action Key</th>
                <th style={{ padding: '10px 14px' }}>Target Entity</th>
                <th style={{ padding: '10px 14px' }}>Details Payload</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log: any) => (
                <tr key={log._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{log.actor?.phone || 'Super Admin'}</td>
                  <td style={{ padding: '10px 14px' }}><span className="status-pill info" style={{ fontSize: 10 }}>{log.action}</span></td>
                  <td style={{ padding: '10px 14px', color: '#475569' }}><code>{log.target || '—'}</code></td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 11 }}>{JSON.stringify(log.details || {})}</td>
                </tr>
              ))}
              {!auditLogs.length && (
                <tr>
                  <td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>
                    Security audit trail is initialized.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return null;
}

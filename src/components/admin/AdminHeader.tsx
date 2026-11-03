'use client';
import React from 'react';
import { RefreshCw, FileSpreadsheet, Bell } from 'lucide-react';
import { AdminKpis } from './types';

interface AdminHeaderProps {
  currentTab: string;
  role: string;
  onRefresh: () => void;
  onOpenExcel: () => void;
  onOpenBroadcast: () => void;
}

export function AdminHeader({
  currentTab,
  role,
  onRefresh,
  onOpenExcel,
  onOpenBroadcast
}: AdminHeaderProps) {
  return (
    <header className="admin-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
      <div style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span className="status-pill success" style={{ fontSize: 10 }}>● PRODUCTION READY SUPER ADMIN</span>
          <span style={{ fontSize: 12, color: '#64748b' }}>Active Module: <strong style={{ color: '#c2185b' }}>{currentTab}</strong></span>
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a', wordBreak: 'break-word' }}>
          Adam N Eve <span style={{ color: '#c2185b', fontWeight: 400 }}>| Super Admin Console</span>
        </h1>
      </div>

      <div className="admin-header-actions" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn btn-shaadi"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '7px 14px' }}
          onClick={onOpenExcel}
        >
          <FileSpreadsheet size={15} /> Import Excel
        </button>
        <button
          className="btn btn-dark"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '7px 14px' }}
          onClick={onOpenBroadcast}
        >
          <Bell size={15} /> Broadcast Alert
        </button>
        <button
          className="btn btn-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '7px 12px' }}
          onClick={onRefresh}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>
    </header>
  );
}

interface AdminKpiProps {
  kpis: AdminKpis;
}

export function AdminKpiSection({ kpis }: AdminKpiProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div className="admin-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
        <div style={{ background: '#fff', padding: '18px 22px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Registered</span>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>{kpis.totalRegistered}</div>
          <span style={{ fontSize: 11, color: '#16a34a' }}>↑ Live members in MongoDB</span>
        </div>

        <div style={{ background: '#fff', padding: '18px 22px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Active Profiles</span>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>{kpis.activeProfiles}</div>
          <span style={{ fontSize: 11, color: '#0284c7' }}>Verified &amp; active in search</span>
        </div>

        <div style={{ background: '#fff', padding: '18px 22px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Paid Subscribers</span>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>{kpis.paidSubscribers}</div>
          <span style={{ fontSize: 11, color: '#ca8a04' }}>Active membership access</span>
        </div>

        <div style={{ background: '#fff', padding: '18px 22px', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Pending Approval</span>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>{kpis.pendingApproval}</div>
          <span style={{ fontSize: 11, color: '#dc2626' }}>Awaiting ID &amp; profile review</span>
        </div>
      </div>

      {/* Sources Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '10px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>REGISTRATION SOURCES:</span>
        <span className="status-pill" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 11 }}>🌐 Web: {kpis.sources?.website || 0}</span>
        <span className="status-pill" style={{ background: '#dcfce7', color: '#15803d', fontSize: 11 }}>🤖 Android: {kpis.sources?.android || 0}</span>
        <span className="status-pill" style={{ background: '#f3e8ff', color: '#7e22ce', fontSize: 11 }}>🍏 iOS: {kpis.sources?.ios || 0}</span>
        <span className="status-pill" style={{ background: '#fef3c7', color: '#b45309', fontSize: 11 }}>📊 Excel Import: {kpis.sources?.excelImport || 0}</span>
        <span className="status-pill" style={{ background: '#fee2e2', color: '#b91c1c', fontSize: 11 }}>✍️ Manual: {kpis.sources?.manualAdmin || 0}</span>
      </div>
    </div>
  );
}

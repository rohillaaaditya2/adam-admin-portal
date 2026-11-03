'use client';
import React from 'react';
import {
  BarChart3, TrendingUp, ShieldCheck, Users, FileSpreadsheet, UserCheck,
  BookOpen, Layers, BadgeCheck, Camera, Sparkles, SlidersHorizontal,
  DollarSign, RotateCcw, Gift, CheckCheck, MessageCircle, Eye,
  ShieldAlert, Bell, Clock, ImageIcon, MessageSquare, LifeBuoy,
  FileText, Bookmark, Share2, Database, Settings as SettingsIcon,
  KeyRound, Lock, Menu, X, Package
} from 'lucide-react';
import { adminSignOut } from '@/lib/api';

export const MODULE_GROUPS = [
  {
    category: 'Overview & Analytics',
    modules: ['Dashboard', 'Reports & Analytics', 'Security & Audit Logs']
  },
  {
    category: 'Member Pipeline',
    modules: [
      'Registration Management',
      'Excel Bulk Import',
      'User Management',
      'Biodata Management',
      'Church Management',
      'Profile Verification',
      'Photo Management',
      'Identity & Consent',
      'Featured Profiles',
      'Relationship Manager CRM'
    ]
  },
  {
    category: 'Subscriptions & Revenue',
    modules: [
      'Subscription Plan Builder',
      'Subscriber Management',
      'Transaction Management',
      'Refund & Cancellation',
      'Coupon & Offers'
    ]
  },
  {
    category: 'Communication Center',
    modules: [
      'Notification Center',
      'Notifications Automation',
      'Posters & Banners',
      'Notification Templates',
      'Support & Complaints'
    ]
  },
  {
    category: 'Safety & System Rules',
    modules: [
      'Matchmaking Rules',
      'Interests Oversight',
      'Contact & Photo Requests',
      'Chat Safety',
      'Website Pages / CMS',
      'Success Stories',
      'Referral Management',
      'Export & Backup',
      'Website & App Settings',
      'Admin Roles & Staff',
      'Privacy & Data Requests'
    ]
  },
  {
    category: '📦 Book Store',
    modules: ['Order Management']
  }
];

export const MODULE_ICONS: Record<string, any> = {
  'Dashboard': BarChart3,
  'Reports & Analytics': TrendingUp,
  'Security & Audit Logs': ShieldCheck,
  'Registration Management': Users,
  'Excel Bulk Import': FileSpreadsheet,
  'User Management': UserCheck,
  'Biodata Management': BookOpen,
  'Church Management': Layers,
  'Profile Verification': BadgeCheck,
  'Photo Management': Camera,
  'Identity & Consent': Sparkles,
  'Featured Profiles': Sparkles,
  'Relationship Manager CRM': Users,
  'Subscription Plan Builder': SlidersHorizontal,
  'Subscriber Management': CheckCheck,
  'Transaction Management': DollarSign,
  'Refund & Cancellation': RotateCcw,
  'Coupon & Offers': Gift,
  'Matchmaking Rules': SlidersHorizontal,
  'Interests Oversight': MessageCircle,
  'Contact & Photo Requests': Eye,
  'Chat Safety': ShieldAlert,
  'Notification Center': Bell,
  'Notifications Automation': Clock,
  'Posters & Banners': ImageIcon,
  'Notification Templates': MessageSquare,
  'Support & Complaints': LifeBuoy,
  'Website Pages / CMS': FileText,
  'Success Stories': Bookmark,
  'Referral Management': Share2,
  'Export & Backup': Database,
  'Website & App Settings': SettingsIcon,
  'Admin Roles & Staff': KeyRound,
  'Privacy & Data Requests': Lock,
  'Order Management': Package
};

interface AdminSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  pendingPhotosCount?: number;
  currentPhone?: string;
  role?: string;
}

const POPULAR_MOBILE_MODULES = [
  'Dashboard',
  'User Management',
  'Excel Bulk Import',
  'Biodata Management',
  'Photo Management',
  'Subscriber Management',
  'Transaction Management',
  'Support & Complaints',
  'Chat Safety'
];

export function AdminSidebar({
  currentTab,
  onSelectTab,
  pendingPhotosCount = 0,
  currentPhone = '',
  role = 'admin'
}: AdminSidebarProps) {
  const [filterQuery, setFilterQuery] = React.useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const renderModuleNav = (isDrawer = false) => (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {MODULE_GROUPS.map((group) => {
        const matchingModules = group.modules.filter(m => !filterQuery || m.toLowerCase().includes(filterQuery.toLowerCase()));
        if (!matchingModules.length) return null;

        return (
          <div key={group.category}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', color: '#94a3b8', textTransform: 'uppercase', padding: '0 10px', display: 'block', marginBottom: 6 }}>
              {group.category}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {matchingModules.map((m) => {
                const Icon = MODULE_ICONS[m] || BarChart3;
                const isActive = currentTab === m;
                return (
                  <button
                    key={m}
                    onClick={() => {
                      onSelectTab(m);
                      if (isDrawer) setMobileDrawerOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: 'none',
                      background: isActive ? '#fdf2f8' : 'transparent',
                      color: isActive ? '#c2185b' : '#475569',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 13,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon size={16} color={isActive ? '#c2185b' : '#64748b'} />
                      <span>{m}</span>
                    </div>
                    {m === 'Photo Management' && pendingPhotosCount > 0 && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: '#fef3c7', color: '#b45309' }}>
                        {pendingPhotosCount} PENDING
                      </span>
                    )}
                    {m === 'Chat Safety' && (
                      <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: '#fee2e2', color: '#dc2626' }}>
                        LIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* 1. Mobile Quick Bar & Drawer Trigger (< 1024px) */}
      <div className="admin-mobile-nav-bar">
        <div className="admin-mobile-top-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#c2185b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 }}>
              ✝
            </div>
            <div>
              <strong style={{ fontSize: 14, color: '#0f172a', display: 'block', lineHeight: 1.1 }}>Adam N Eve</strong>
              <small style={{ fontSize: 9, color: '#c2185b', fontWeight: 700, textTransform: 'uppercase' }}>Admin Console</small>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#c2185b',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '7px 12px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Menu size={16} /> All 32 Modules
          </button>
        </div>

        {/* Quick Horizontal Scrollable Modules on Mobile */}
        <div className="admin-mobile-pills">
          {POPULAR_MOBILE_MODULES.map((mod) => {
            const isActive = currentTab === mod;
            return (
              <button
                key={mod}
                type="button"
                className={`admin-mobile-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(mod)}
              >
                {mod}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Mobile Slide-in Drawer Modal */}
      {mobileDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            style={{
              width: '85%',
              maxWidth: 320,
              height: '100%',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
              overflowY: 'auto',
              padding: '20px 16px',
              gap: 16
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#c2185b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  ✝
                </div>
                <strong style={{ fontSize: 14, color: '#0f172a' }}>Admin Navigation</strong>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Search */}
            <input
              type="text"
              placeholder="Search 32 modules..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, background: '#f8fafc', boxSizing: 'border-box' }}
            />

            {/* Modules List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {renderModuleNav(true)}
            </div>

            {/* Footer Sign Out */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>Admin: <b>{currentPhone || 'Staff'}</b></span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => adminSignOut()}
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Desktop Fixed Sticky Sidebar (>= 1024px) */}
      <aside
        className="admin-sidebar admin-sidebar-desktop"
        style={{
          width: 280,
          flexShrink: 0,
          background: '#fff',
          borderRight: '1px solid #e2e8f0',
          padding: '24px 16px',
          flexDirection: 'column',
          gap: 20,
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto'
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#c2185b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
            ✝
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Adam N Eve</h2>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#c2185b', textTransform: 'uppercase' }}>Super Admin Console</span>
          </div>
        </div>

        {/* Module Quick Filter */}
        <div style={{ padding: '0 8px' }}>
          <input
            type="text"
            placeholder="Search 32 modules..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, background: '#f8fafc', boxSizing: 'border-box' }}
          />
        </div>

        {/* Grouped Modules */}
        {renderModuleNav(false)}

        {/* Staff Account & Sign Out */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 8px 0' }}>
          <div>
            <span style={{ fontSize: 10, color: '#94a3b8', display: 'block' }}>SIGNED IN AS</span>
            <strong style={{ fontSize: 12, color: '#0f172a' }}>{currentPhone || 'Admin'}</strong>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => adminSignOut()}
            style={{ fontSize: 11, padding: '4px 10px' }}
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

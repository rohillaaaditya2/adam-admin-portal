'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Cookie, X, Check, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = localStorage.getItem('ane_cookie_consent');
    if (!existing) {
      // Short delay for smooth slide-in
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }

    const handleReopen = () => setVisible(true);
    window.addEventListener('ane_open_cookie_settings', handleReopen);
    return () => window.removeEventListener('ane_open_cookie_settings', handleReopen);
  }, []);

  if (!mounted || !visible || pathname?.startsWith('/admin') || pathname?.startsWith('/app')) return null;

  const handleChoice = (preference: 'all' | 'essential') => {
    localStorage.setItem('ane_cookie_consent', JSON.stringify({
      choice: preference,
      timestamp: new Date().toISOString()
    }));
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="cookie-consent-bar"
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        right: 20,
        maxWidth: 760,
        margin: '0 auto',
        zIndex: 9995,
        background: '#ffffff',
        border: '1.5px solid #fed7aa',
        borderRadius: 18,
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.16)',
        padding: '20px 24px',
        fontFamily: 'Inter, system-ui, sans-serif',
        animation: 'fadeInUp 0.25s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#fdf2f8',
              color: '#c2185b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid #fbcfe8'
            }}
          >
            <Cookie size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <strong style={{ fontSize: 14, color: '#0f172a' }}>
                {t('cookieBannerTitle', 'Privacy & Cookie Consent')}
              </strong>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#166534',
                  background: '#f0fdf4',
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Lock size={10} /> DPDP Act 2023 Compliant
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: '#475569' }}>
              {t('cookieBannerDesc', 'We use strictly necessary cookies to keep your matrimonial session secure, protect member phone numbers, and remember your regional language preferences.')}
            </p>
            <div style={{ marginTop: 8 }}>
              <Link
                href="/info/cookie-policy"
                style={{ fontSize: 12, color: '#c2185b', fontWeight: 700, textDecoration: 'underline' }}
              >
                Read Cookie Policy &amp; Storage Details →
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleChoice('essential')}
          aria-label="Dismiss cookie notice"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div
        style={{
          marginTop: 16,
          paddingTop: 14,
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => handleChoice('essential')}
          className="btn btn-outline btn-sm"
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: '8px 16px',
            borderRadius: 8,
            borderColor: '#cbd5e1',
            color: '#475569',
            background: '#ffffff',
            cursor: 'pointer'
          }}
        >
          {t('essentialOnly', 'Strictly Essential Only')}
        </button>
        <button
          onClick={() => handleChoice('all')}
          className="btn btn-shaadi btn-sm"
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: '8px 18px',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Check size={14} /> {t('acceptAll', 'Accept & Continue')}
        </button>
      </div>
    </div>
  );
}

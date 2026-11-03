'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBranding } from '@/lib/useBranding';
import { useLanguage } from '@/lib/useLanguage';
import { MessageCircle, Phone, LifeBuoy, X, ChevronRight, HelpCircle, ShieldCheck } from 'lucide-react';

export default function CustomerSupportWidget() {
  const pathname = usePathname();
  const branding = useBranding();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Never show on admin pages, member app, or auth/consent form pages where it blocks inputs/buttons
  if (
    !mounted ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/app') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/candidate-consent')
  ) {
    return null;
  }

  const rawPhone = branding.supportPhone || '';
  const supportPhone = rawPhone.replace(/[^+0-9]/g, '');
  const hasPhone = /^\+?[0-9]{10,15}$/.test(supportPhone);
  const displayPhone = hasPhone ? rawPhone : 'Use support tickets';
  const whatsappUrl = hasPhone ? `https://wa.me/${supportPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, I need account support with ${branding.communityName}.`)}` : '/support';

  return (
    <div className="customer-support-widget" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9990, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Expanded Support Card */}
      {isOpen && (
        <div
          className="customer-support-card"
          style={{
            position: 'absolute',
            bottom: 68,
            right: 0,
            width: 320,
            maxWidth: 'calc(100vw - 32px)',
            background: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.18)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            animation: 'fadeInUp 0.2s ease-out'
          }}
        >
          {/* Card Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #831843 0%, #be185d 100%)',
              color: '#ffffff',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>✝</span>
                <strong style={{ fontSize: 14, letterSpacing: '0.02em' }}>{branding.brandTitle} {t('supportHeader', 'Support')}</strong>
              </div>
              <small style={{ fontSize: 11, color: '#fbcfe8', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                {t('openSupportRequest', 'Open a support request')}
              </small>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '50%',
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Close support widget"
            >
              <X size={15} />
            </button>
          </div>

          {/* Quick Support Actions */}
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* WhatsApp Priority Action */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 12,
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                textDecoration: 'none',
                color: '#166534',
                transition: 'background 0.15s'
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageCircle size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ display: 'block', fontSize: 13, color: '#14532d' }}>{hasPhone ? t('whatsappConcierge', 'WhatsApp Concierge') : t('supportDesk', 'Contact Support')}</strong>
                <small style={{ fontSize: 11, color: '#15803d' }}>{t('whatsappSub', 'Instant responses from marriage counselor')}</small>
              </div>
              <ChevronRight size={15} color="#16a34a" />
            </a>

            {/* Helpline Phone Call */}
            <a
              href={hasPhone ? `tel:${supportPhone}` : '/support'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 12,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                color: '#1e293b',
                transition: 'background 0.15s'
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ display: 'block', fontSize: 13 }}>{hasPhone ? t('directPhoneDesk', 'Direct Phone Desk') : t('supportDesk', 'Help Center')}</strong>
                <small style={{ fontSize: 11, color: '#64748b' }}>{hasPhone ? displayPhone : t('directPhoneSub', 'Speak with our family alliance advisor')}</small>
              </div>
              <ChevronRight size={15} color="#94a3b8" />
            </a>

            {/* Support Ticket / Helpdesk */}
            <Link
              href="/support"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 12,
                background: '#fdf2f8',
                border: '1px solid #fbcfe8',
                textDecoration: 'none',
                color: '#831843',
                transition: 'background 0.15s'
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#c2185b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LifeBuoy size={17} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ display: 'block', fontSize: 13, color: '#831843' }}>{t('submitTicket', 'Submit Helpdesk Ticket')}</strong>
                <small style={{ fontSize: 11, color: '#9d174d' }}>{t('submitTicketSub', 'Track request with dedicated ticket ID')}</small>
              </div>
              <ChevronRight size={15} color="#c2185b" />
            </Link>

            {/* FAQs & Safety Link */}
            <Link
              href="/info/help-faq"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: '#64748b',
                fontSize: 12,
                fontWeight: 600
              }}
            >
              <HelpCircle size={15} color="#94a3b8" />
              <span>{t('readMatrimonyFaqs', 'Read Christian Matrimony FAQs')}</span>
            </Link>
          </div>

          {/* Footer note */}
          <div style={{ padding: '8px 14px', background: '#fafbfc', borderTop: '1px solid #f1f5f9', fontSize: 10, color: '#94a3b8', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <ShieldCheck size={13} color="#16a34a" /> {t('dignityParishPrivacy', 'Dignity & Parish Privacy Protected')}
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        className="support-fab-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'linear-gradient(135deg, #c2185b 0%, #831843 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '12px 18px',
          borderRadius: 50,
          boxShadow: '0 8px 24px rgba(194, 24, 91, 0.35)',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: 13,
          transition: 'all 0.2s',
          transform: isOpen ? 'scale(0.96)' : 'scale(1)'
        }}
        title="Need help? Contact support"
      >
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <LifeBuoy size={18} />
          <span style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: '#4ade80', border: '1.5px solid #fff' }} />
        </span>
        <span className="support-fab-text">{isOpen ? t('closeHelp', 'Close Help') : t('helpAndSupport', 'Help & Support')}</span>
      </button>
    </div>
  );
}

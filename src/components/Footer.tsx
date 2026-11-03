'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Heart, Phone, Mail, MapPin, Cookie } from 'lucide-react';
import { useBranding, resolveMediaUrl } from '@/lib/useBranding';
import { useLanguage } from '@/lib/useLanguage';

export default function Footer() {
  const pathname = usePathname();
  const branding = useBranding();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  // Do NOT render consumer footer inside administrative console or member app
  if (pathname.startsWith('/admin') || pathname.startsWith('/app')) {
    return null;
  }

  const openCookiePreferences = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ane_open_cookie_settings'));
    }
  };

  return (
    <footer className="footer" role="contentinfo" aria-label="Website Footer">
      {/* Brand & Mission Column */}
      <div>
        <Link href="/" className="logo footbrand" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#ffffff' }} aria-label={`${branding.communityName} - Go to Home`} suppressHydrationWarning>
          {branding.logoUrl ? (
            <img
              src={resolveMediaUrl(branding.logoUrl)}
              alt={branding.communityName}
              style={{ maxHeight: 38, maxWidth: 170, objectFit: 'contain', display: 'block', filter: 'brightness(1.1)' }}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                if (fallback) (fallback as HTMLElement).style.display = 'inline-flex';
              }}
            />
          ) : null}
          <div className="logo-fallback" style={{ display: branding.logoUrl ? 'none' : 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span className="logo-mark" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(194, 24, 91, 0.25)', border: '1px solid #c2185b' }}>
              <Heart size={20} fill="#f472b6" color="#f472b6" />
            </span>
            <span className="logo-text" suppressHydrationWarning>
              <b style={{ color: '#ffffff' }} suppressHydrationWarning>{branding.brandTitle}</b>
              <small style={{ color: '#fbcfe8' }}>{branding.brandSubtitle}</small>
            </span>
          </div>
        </Link>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: '#cbd5e1', marginTop: 14, maxWidth: 320 }}>
          {t('footerMission', 'Private, sacred Christian matrimonial matchmaking guided by church traditions, personal dignity, and verified family alliances.')}
        </p>

        {/* Legal Registered Entity & Contact Information */}
        <div style={{ marginTop: 18, fontSize: 12.5, lineHeight: 1.8, color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={15} color="#f472b6" />
            <span style={{ color: '#e2e8f0' }}>{t('locationAddress', 'Indore, Madhya Pradesh, India - 452001')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <Phone size={15} color="#4ade80" />
            <a href={`tel:${branding.supportPhone.replace(/\s+/g, '')}`} style={{ color: '#4ade80', fontWeight: 700, textDecoration: 'none' }}>
              {branding.supportPhone}
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <Mail size={15} color="#38bdf8" />
            <a href={`mailto:${branding.supportEmail}`} style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>
              {branding.supportEmail}
            </a>
          </div>
        </div>
      </div>

      {/* Member Journeys Column */}
      <div>
        <b style={{ color: '#ffffff', borderBottom: '2px solid #c2185b', paddingBottom: 4, display: 'inline-block', marginBottom: 8 }}>
          {t('memberJourneys', 'Member Journeys')}
        </b>
        <Link href="/register" style={{ color: '#cbd5e1' }}>{t('createABiodata', 'Create a biodata')}</Link>
        <Link href="/app" style={{ color: '#cbd5e1' }}>{t('discoverMatchesLink', 'Discover matches')}</Link>
        <Link href="/login" style={{ color: '#cbd5e1' }}>{t('memberLogin', 'Member login')}</Link>
        <Link href="/info/how-it-works" style={{ color: '#cbd5e1' }}>{t('howItWorksLink', 'How it works')}</Link>
        <Link href="/candidate-consent" style={{ color: '#cbd5e1' }}>{t('candidateConsent', 'Candidate phone consent')}</Link>
        <Link href="/member-tools" style={{ color: '#cbd5e1' }}>{t('toolsVerification', 'Tools & verification')}</Link>
      </div>

      {/* About & Community Column */}
      <div>
        <b style={{ color: '#ffffff', borderBottom: '2px solid #c2185b', paddingBottom: 4, display: 'inline-block', marginBottom: 8 }}>
          {t('aboutCommunity', 'About & Community')}
        </b>
        <Link href="/info/about-us" style={{ color: '#cbd5e1' }}>{t('aboutPlatform', 'About our platform')}</Link>
        <Link href="/info/community" style={{ color: '#cbd5e1' }}>{t('denominationalHeritage', 'Denominational heritage')}</Link>
        <Link href="/info/safety-centre" style={{ color: '#cbd5e1' }}>{t('safetyAntiFraud', 'Safety & anti-fraud')}</Link>
        <Link href="/support" style={{ color: '#cbd5e1' }}>{t('supportDesk', '24x7 Support desk')}</Link>
        <Link href="/info/help-faq" style={{ color: '#cbd5e1' }}>{t('helpFaqs', 'Help & FAQs')}</Link>
      </div>

      {/* Statutory Legal & Policies Column (DPDP Act Compliant) */}
      <div>
        <b style={{ color: '#ffffff', borderBottom: '2px solid #c2185b', paddingBottom: 4, display: 'inline-block', marginBottom: 8 }}>
          {t('legalCompliance', 'Legal & Compliance')}
        </b>
        <Link href="/info/privacy-policy" style={{ color: '#cbd5e1' }}>{t('privacyPolicy', 'Privacy policy (DPDP Act)')}</Link>
        <Link href="/info/terms-of-service" style={{ color: '#cbd5e1' }}>{t('termsOfService', 'Terms of service')}</Link>
        <Link href="/info/cookie-policy" style={{ color: '#cbd5e1' }}>{t('cookiePolicy', 'Cookie & storage policy')}</Link>
        <Link href="/info/refund-policy" style={{ color: '#cbd5e1' }}>{t('refundPolicy', 'Refund & cancellation policy')}</Link>
        <a
          href="#cookie-settings"
          onClick={openCookiePreferences}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#f472b6', fontWeight: 650, marginTop: 12 }}
        >
          <Cookie size={14} /> {t('cookiePreferences', 'Cookie preferences')}
        </a>
      </div>

      {/* Grievance & Technical Trust Column */}
      <div className="powered footer-full-width" style={{ textAlign: 'left', gridColumn: '1 / -1', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 24, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <strong style={{ fontSize: 13, color: '#ffffff', display: 'block', marginBottom: 3 }}>
            Statutory Grievance Redressal (IT Rules, 2021 &amp; DPDP Act 2023)
          </strong>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Grievance Officer: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Legal &amp; Compliance Desk</span> · Email:{' '}
            <a href="mailto:grievance@adamneve.in" style={{ color: '#f472b6', fontWeight: 700, textDecoration: 'underline', display: 'inline' }}>
              grievance@adamneve.in
            </a>
          </span>
        </div>

        <div className="footer-clearance" style={{ fontSize: 11.5, color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <ShieldCheck size={14} color="#4ade80" />
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Protected by TLS 1.3 &amp; AES-256-GCM encryption</span>
          </div>
          <div>
            © {currentYear} {branding.communityName}. {t('allRightsReserved', 'All rights reserved.')}
          </div>
        </div>
      </div>

      {/* Dedicated Full-Width Tech Partner & Engineering Bar — Left-Aligned & 100% Clear of Floating Help Button */}
      <div className="footer-partner-bar" style={{
        gridColumn: '1 / -1',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        marginTop: 16,
        paddingTop: 16,
        paddingBottom: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Left Side: Prominent, Completely Unobstructed Decodeax Company Attribution */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ color: '#cbd5e1', fontSize: 12.5, fontWeight: 500 }}>
            Designed, Developed &amp; Engineered by
          </span>
          <a
            href="https://decodeax.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#ffffff',
              fontWeight: 850,
              fontSize: 12.5,
              textDecoration: 'none',
              letterSpacing: '0.03em',
              background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.25) 0%, rgba(194, 24, 91, 0.45) 100%)',
              padding: '5px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(244, 114, 182, 0.45)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 2px 10px rgba(194, 24, 91, 0.25)'
            }}
            title="Decodeax — Technology Partner & Software Development Company"
          >
            <span style={{ color: '#fbcfe8', fontWeight: 900 }}>Decodeax</span>
            <span style={{
              fontSize: 9.5,
              background: '#c2185b',
              color: '#fff',
              padding: '2px 7px',
              borderRadius: 4,
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              Official Tech Partner
            </span>
          </a>
        </div>

        {/* Right Side: Reserved clear zone for floating Help & Support button */}
        <div className="footer-partner-arch" style={{ fontSize: 11, color: '#64748b' }}>
          <span>Enterprise Matrimonial Architecture</span>
        </div>
      </div>
    </footer>
  );
}

'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart, ShieldCheck, ArrowUpRight, LogOut, User as UserIcon,
  Globe, ChevronDown, Check, Menu, X, Sparkles, MessageCircle,
  Star, LifeBuoy, BookOpen, Compass, Award, SlidersHorizontal
} from 'lucide-react';
import { getToken, signOut, api } from '@/lib/api';
import { SUPPORTED_LANGUAGES, t } from '@/lib/i18n';
import { useBranding, resolveMediaUrl } from '@/lib/useBranding';

export default function Navbar() {
  const pathname = usePathname();
  const branding = useBranding();
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileName, setProfileName] = useState('');
  const [lang, setLang] = useState('en');
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
    setLangOpen(false);

    const refreshAuth = () => {
      const token = getToken();
      if (!token) {
        setIsAuth(false);
        setUser(null);
        setProfileName('');
        return;
      }

      setIsAuth(true);

      // Fetch user info for header display
      api('/auth/me')
        .then((d: any) => {
          if (d?.user) {
            setUser(d.user);
            setIsAuth(true);
            // If member, try to get profile name
            if (d.user.role === 'member') {
              api('/me/profile')
                .then((p: any) => {
                  const fn = p?.profile?.fields?.firstName;
                  const sn = p?.profile?.fields?.surname;
                  if (fn) {
                    setProfileName(`${fn} ${sn || ''}`.trim());
                  }
                })
                .catch(() => {});
            }
          } else {
            setIsAuth(false);
          }
        })
        .catch(() => {
          setIsAuth(!!getToken());
        });
    };

    refreshAuth();
    window.addEventListener('ane_auth_change', refreshAuth);
    window.addEventListener('storage', refreshAuth);
    return () => {
      window.removeEventListener('ane_auth_change', refreshAuth);
      window.removeEventListener('storage', refreshAuth);
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ane_lang') || 'en';
      setLang(saved);
      const handler = (e: any) => {
        const newLang = e?.detail || localStorage.getItem('ane_lang') || 'en';
        setLang(newLang);
      };
      window.addEventListener('ane_lang_change', handler);
      window.addEventListener('storage', handler);
      return () => {
        window.removeEventListener('ane_lang_change', handler);
        window.removeEventListener('storage', handler);
      };
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const selectLang = (code: string) => {
    setLang(code);
    setLangOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ane_lang', code);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = code;
      }
      window.dispatchEvent(new CustomEvent('ane_lang_change', { detail: code }));
    }
  };

  // Completely hide the consumer website Navbar when on admin pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/app')) {
    return null;
  }

  const isMember = isAuth && user?.role === 'member';
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      <header className="topbar">
        <Link className="logo" href="/" onClick={() => setMobileMenuOpen(false)} aria-label={`${branding.communityName} - Go to Home`} suppressHydrationWarning>
          {branding.logoUrl ? (
            <img
              src={resolveMediaUrl(branding.logoUrl)}
              alt={branding.communityName}
              style={{ maxHeight: 38, maxWidth: 170, objectFit: 'contain', display: 'block' }}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                if (fallback) (fallback as HTMLElement).style.display = 'inline-flex';
              }}
            />
          ) : null}
          <div className="logo-fallback" style={{ display: branding.logoUrl ? 'none' : 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span className="logo-mark"><Heart size={22} fill="currentColor" /></span>
            <span className="logo-text" suppressHydrationWarning>
              <b suppressHydrationWarning>{branding.brandTitle}</b>
              <small suppressHydrationWarning>{branding.brandSubtitle}</small>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav">
          {isMember ? (
            <>
              <Link href="/app?tab=discover" style={{ color: pathname === '/app' ? '#a57b52' : undefined }}>
                {t(lang, 'discoverMatches')}
              </Link>
              <Link href="/app?tab=profile">{t(lang, 'myBiodata')}</Link>
              <Link href="/app?tab=preferences">Match Preferences</Link>
              <Link href="/app?tab=shortlist">{t(lang, 'shortlisted')}</Link>
              <Link href="/app?tab=interests">{t(lang, 'interestsChat')}</Link>
              <Link href="/app?tab=plans">{t(lang, 'membershipPlans')}</Link>
              <Link href="/info/safety-centre">{t(lang, 'safety')}</Link>
              <Link href="/support">Support Desk</Link>
            </>
          ) : (
            <>
              <Link href="/info/how-it-works">{t(lang, 'howItWorks')}</Link>
              <Link href="/info/community">{t(lang, 'community')}</Link>
              <Link href="/info/safety-centre">{t(lang, 'safetyCentre')}</Link>
              <Link href="/support">24x7 Support</Link>
              <Link href="/app">{t(lang, 'discoverMatches')}</Link>
            </>
          )}
        </nav>

        {/* Actions & Language Selector */}
        <div className="nav-actions">
          {/* Pan-India Multi-Language Dropdown (Desktop) */}
          <div style={{ position: 'relative' }} ref={langDropdownRef} className="desktop-lang-wrap">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="btn btn-outline btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 750,
                padding: '6px 13px',
                borderRadius: '24px',
                borderColor: '#d1c7bc',
                background: langOpen ? '#f5ede3' : '#ffffff',
                color: '#334155',
                cursor: 'pointer'
              }}
              title="Choose Language"
            >
              <Globe size={15} color="#c2185b" />
              <span>{currentLangObj.nativeName}</span>
              <ChevronDown size={13} style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {langOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '270px',
                  background: '#ffffff',
                  border: '1px solid #e2d9cd',
                  borderRadius: '14px',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.14)',
                  padding: '8px 0',
                  zIndex: 9999,
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '6px 16px', borderBottom: '1px solid #f1ece4', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>
                    SELECT REGIONAL LANGUAGE
                  </span>
                </div>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => selectLang(l.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 16px',
                      border: 'none',
                      background: lang === l.code ? '#fbf3ea' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: lang === l.code ? '#c2185b' : '#1e293b',
                      fontWeight: lang === l.code ? 700 : 500,
                      fontSize: '13px',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e: any) => { if (lang !== l.code) e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e: any) => { if (lang !== l.code) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div>
                      <span style={{ display: 'block', fontSize: '13px', lineHeight: 1.2 }}>{l.nativeName}</span>
                      <small style={{ fontSize: '10px', color: '#64748b' }}>{l.name} • {l.region}</small>
                    </div>
                    {lang === l.code && <Check size={15} color="#c2185b" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isMember ? (
            <div className="desktop-member-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                href="/app"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: '#f4ede1',
                  color: '#28473f',
                  padding: '7px 14px',
                  borderRadius: '50px',
                  fontSize: '12px',
                  fontWeight: 650,
                  border: '1px solid #e7dcce',
                  textDecoration: 'none'
                }}
              >
                <UserIcon size={14} color="#8a6843" />
                <span>{profileName || t(lang, 'myAccount')}</span>
              </Link>
              <button
                onClick={signOut}
                className="btn btn-outline btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#b91c1c',
                  borderColor: '#fca5a5',
                  background: '#fff5f5',
                  cursor: 'pointer'
                }}
                title="Sign out of your account"
              >
                <LogOut size={14} />
                <span>{t(lang, 'signOut')}</span>
              </button>
            </div>
          ) : (
            <div className="desktop-guest-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link className="nav-link" href="/login">
                {t(lang, 'signIn')}
              </Link>
              <Link className="btn btn-dark btn-sm" href="/register">
                {t(lang, 'createBiodata')} <ArrowUpRight size={15} />
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 42,
              height: 42,
              borderRadius: 12,
              background: mobileMenuOpen ? '#fee2e2' : '#f8fafc',
              border: '1px solid #e2e8f0',
              color: mobileMenuOpen ? '#c2185b' : '#334155',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ========================================================
          MOBILE SLIDE-DOWN DRAWER & FULL-SCREEN OVERLAY
          ======================================================== */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            top: 70,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            className="mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderBottom: '2px solid #e2d9cd',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              maxHeight: 'calc(100vh - 80px)',
              overflowY: 'auto',
              padding: '20px 20px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            {/* Member Greeting or Guest Welcome */}
            {isMember ? (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#c2185b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {profileName ? profileName[0].toUpperCase() : 'M'}
                  </div>
                  <div>
                    <strong style={{ fontSize: 14, color: '#0f172a', display: 'block' }}>{profileName || 'Member Account'}</strong>
                    <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>● Active Christian Member</span>
                  </div>
                </div>
                <Link
                  href="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: 11, fontWeight: 750, color: '#c2185b', textDecoration: 'underline' }}
                >
                  Go to App
                </Link>
              </div>
            ) : (
              <div style={{ background: 'linear-gradient(135deg, #fff5ed 0%, #fff0f5 100%)', border: '1px solid #fbcfe8', borderRadius: 14, padding: '14px 16px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: 15, color: '#831843', fontWeight: 800 }}>Christian Matrimony</h4>
                <p style={{ margin: '0 0 12px', fontSize: 12, color: '#64748b' }}>Connect with verified candidates across Catholic, Orthodox, Syrian, Mar Thoma &amp; Protestant communities.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-shaadi full"
                    style={{ padding: '10px 14px', fontSize: 12 }}
                  >
                    Create Biodata <ArrowUpRight size={14} />
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-outline full"
                    style={{ padding: '10px 14px', fontSize: 12 }}
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Links with Icons */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {isMember ? (
                <>
                  <Link
                    href="/app?tab=discover"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#1e293b', background: pathname === '/app' ? '#fdf2f8' : 'transparent' }}
                  >
                    <Compass size={18} color="#c2185b" />
                    <span>{t(lang, 'discoverMatches')}</span>
                  </Link>
                  <Link
                    href="/app?tab=profile"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 650, color: '#334155' }}
                  >
                    <BookOpen size={18} color="#8a6843" />
                    <span>{t(lang, 'myBiodata')}</span>
                  </Link>
                  <Link
                    href="/app?tab=preferences"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 650, color: '#334155' }}
                  >
                    <SlidersHorizontal size={18} color="#d97706" />
                    <span>Match Preferences 2.0</span>
                  </Link>
                  <Link
                    href="/app?tab=shortlist"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 650, color: '#334155' }}
                  >
                    <Star size={18} color="#f59e0b" />
                    <span>{t(lang, 'shortlisted')}</span>
                  </Link>
                  <Link
                    href="/app?tab=interests"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 650, color: '#334155' }}
                  >
                    <MessageCircle size={18} color="#16a34a" />
                    <span>{t(lang, 'interestsChat')} &amp; Family Steps</span>
                  </Link>
                  <Link
                    href="/app?tab=plans"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 650, color: '#334155' }}
                  >
                    <Award size={18} color="#0284c7" />
                    <span>{t(lang, 'membershipPlans')}</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/app"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#c2185b' }}
                  >
                    <Compass size={18} color="#c2185b" />
                    <span>{t(lang, 'discoverMatches')}</span>
                  </Link>
                  <Link
                    href="/info/how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 650, color: '#334155' }}
                  >
                    <Sparkles size={18} color="#8a6843" />
                    <span>{t(lang, 'howItWorks')}</span>
                  </Link>
                  <Link
                    href="/info/community"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 650, color: '#334155' }}
                  >
                    <Heart size={18} color="#d97706" />
                    <span>{t(lang, 'community')}</span>
                  </Link>
                </>
              )}

              <Link
                href="/info/safety-centre"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 650, color: '#334155' }}
              >
                <ShieldCheck size={18} color="#16a34a" />
                <span>{t(lang, 'safetyCentre')}</span>
              </Link>
              <Link
                href="/support"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 650, color: '#334155' }}
              >
                <LifeBuoy size={18} color="#0284c7" />
                <span>24x7 Support Desk</span>
              </Link>
            </nav>

            {/* Regional Language Quick Selection */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: '#64748b', fontSize: 11, fontWeight: 800, letterSpacing: '0.04em' }}>
                <Globe size={14} color="#c2185b" /> CHOOSE YOUR REGIONAL LANGUAGE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => selectLang(l.code)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: `1.5px solid ${lang === l.code ? '#c2185b' : '#e2e8f0'}`,
                      background: lang === l.code ? '#fdf2f8' : '#fff',
                      color: lang === l.code ? '#c2185b' : '#334155',
                      fontWeight: lang === l.code ? 800 : 600,
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{l.nativeName}</span>
                    {lang === l.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sign Out Action for Logged in Members */}
            {isMember && (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut(); }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 10,
                    border: '1px solid #fecaca',
                    background: '#fff5f5',
                    color: '#b91c1c',
                    fontWeight: 750,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={16} /> {t(lang, 'signOut')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

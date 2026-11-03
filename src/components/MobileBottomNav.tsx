'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, User, LifeBuoy, Flame, MessageCircle, Crown } from 'lucide-react';
import { getToken } from '@/lib/api';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAuth(!!getToken());
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        setCurrentTab(params.get('tab') || '');
      } catch {}
    }
    const handler = () => {
      setIsAuth(!!getToken());
      if (typeof window !== 'undefined') {
        try {
          const params = new URLSearchParams(window.location.search);
          setCurrentTab(params.get('tab') || '');
        } catch {}
      }
    };
    window.addEventListener('ane_auth_change', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('ane_auth_change', handler);
      window.removeEventListener('storage', handler);
    };
  }, [pathname]);

  // Only show for authenticated members outside /app, never for guests on public marketing pages or on auth/form/admin pages
  if (
    !mounted ||
    !isAuth ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/app') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/candidate-consent') ||
    pathname?.startsWith('/member-tools')
  ) {
    return null;
  }

  const isHome = pathname === '/';
  const isInApp = pathname === '/app';
  const isSwipe = isInApp && (currentTab === 'swipe' || currentTab === 'discover' || currentTab === 'daily_matches' || currentTab === 'overview' || currentTab === '');
  const isMatches = isInApp && currentTab === 'matches';
  const isInterests = isInApp && (currentTab === 'interests' || currentTab === 'messages' || currentTab === 'chat' || currentTab === 'shortlist');
  const isProfile = isInApp && (currentTab === 'profile' || currentTab === 'preferences' || currentTab === 'plans');
  const isSupport = pathname === '/support' || pathname?.startsWith('/info');

  const navItems = isInApp && isAuth ? [
    {
      label: 'Discover',
      icon: Flame,
      href: '/app?tab=swipe',
      active: isSwipe
    },
    {
      label: 'Matches',
      icon: Heart,
      href: '/app?tab=matches',
      active: isMatches
    },
    {
      label: 'Messages',
      icon: MessageCircle,
      href: '/app?tab=interests',
      active: isInterests
    },
    {
      label: 'Profile',
      icon: User,
      href: '/app?tab=profile',
      active: isProfile
    }
  ] : [
    {
      label: 'Home',
      icon: Home,
      href: '/',
      active: isHome
    },
    {
      label: 'Discover',
      icon: Search,
      href: isAuth ? '/app?tab=swipe' : '/login',
      active: isSwipe && !isHome
    },
    {
      label: 'Interests',
      icon: Heart,
      href: isAuth ? '/app?tab=interests' : '/login',
      active: isInterests
    },
    {
      label: isAuth ? 'Biodata' : 'Account',
      icon: User,
      href: isAuth ? '/app?tab=profile' : '/login',
      active: isProfile && !isHome
    },
    {
      label: 'Help',
      icon: LifeBuoy,
      href: '/support',
      active: isSupport
    }
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #e7ded4',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.07)',
        zIndex: 9980,
        display: 'none', // Overridden to flex on mobile screens via CSS
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const color = item.active ? '#be185d' : '#64748b';
        return (
          <Link
            key={idx}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              gap: 3,
              flex: 1,
              padding: '6px 0',
              color,
              transition: 'color 0.15s ease'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={item.active ? 2.4 : 1.9} />
              {item.active && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -3,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: '#be185d'
                  }}
                />
              )}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: item.active ? 800 : 600,
                letterSpacing: '0.02em'
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { Download, X, Sparkles, Smartphone } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function PwaRegister() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running as installed WebAPK / PWA
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isRunningStandalone);

    // Register PWA Service Worker for WebAPK installability
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('AdamNEve PWA Service Worker registered:', reg.scope);
          })
          .catch((err) => {
            console.log('PWA SW registration skipped:', err);
          });
      });
    }

    // Capture beforeinstallprompt for 1-click WebAPK / PWA install
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Don't show if dismissed recently
      const dismissed = localStorage.getItem('ane_pwa_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Track app installation
    window.addEventListener('appinstalled', () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      console.log('Adam N Eve Matrimony WebAPK successfully installed!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instructions if native prompt isn't directly dispatchable
      alert('To install Adam N Eve Matrimony App:\n\n- On Android Chrome: Tap Menu (three dots) and tap "Install App" or "Add to Home Screen".\n- On iPhone Safari: Tap Share and tap "Add to Home Screen".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    try {
      localStorage.setItem('ane_pwa_dismissed', 'true');
    } catch {}
  };

  if (isStandalone || pathname?.startsWith('/admin') || !showInstallBanner) {
    return null;
  }

  return (
    <div
      role="banner"
      aria-label="Install Mobile App"
      style={{
        position: 'fixed',
        top: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: 480,
        zIndex: 9995,
        background: 'linear-gradient(135deg, #180914 0%, #2e0821 100%)',
        color: '#ffffff',
        padding: '12px 16px',
        borderRadius: 16,
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(244, 114, 182, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        animation: 'fadeInDown 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #be185d 0%, #831843 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <Smartphone size={20} color="#ffffff" />
        </div>
        <div style={{ minWidth: 0 }}>
          <strong style={{ fontSize: 13, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 5 }}>
            Adam N Eve Mobile App <Sparkles size={13} color="#f59e0b" fill="#f59e0b" />
          </strong>
          <small style={{ fontSize: 11, color: '#fbcfe8', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Fast 1-tap install on your phone - Zero lag
          </small>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleInstallClick}
          style={{
            padding: '7px 14px',
            borderRadius: 20,
            border: 'none',
            background: '#be185d',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 12px rgba(190, 24, 93, 0.4)'
          }}
        >
          <Download size={13} /> Install App
        </button>
        <button
          onClick={dismissBanner}
          aria-label="Dismiss banner"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState, useCallback } from 'react';
import { Wifi, WifiOff, RefreshCw, X } from 'lucide-react';
import { API } from '@/lib/api';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch(`${API}/health`, { cache: 'no-store' });
      if (res.ok) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowRestored(true);
        setTimeout(() => setShowRestored(false), 4000);
      }
      checkHealth();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkHealth();

    // Heartbeat every 60 seconds
    const interval = setInterval(checkHealth, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [wasOffline, checkHealth]);

  return (
    <>
      {/* Offline Top Warning Banner */}
      {!isOnline && (
        <div
          role="status"
          aria-live="assertive"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
            background: 'linear-gradient(90deg, #b91c1c 0%, #dc2626 100%)',
            color: '#ffffff',
            padding: '10px 18px',
            textAlign: 'center',
            boxShadow: '0 4px 18px rgba(220, 38, 38, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontSize: 13,
            fontWeight: 600
          }}
        >
          <WifiOff size={18} />
          <span>
            <b>Connection Interrupted:</b> You are currently offline. Actions will be synchronized when your connection is restored.
          </span>
          <button
            onClick={checkHealth}
            disabled={checking}
            style={{
              background: '#ffffff',
              color: '#b91c1c',
              border: 'none',
              padding: '4px 12px',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 11,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <RefreshCw size={12} className={checking ? 'spin' : ''} />
            {checking ? 'Checking...' : 'Retry'}
          </button>
        </div>
      )}

      {/* Online Restored Top Success Banner */}
      {showRestored && isOnline && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
            background: 'linear-gradient(90deg, #15803d 0%, #16a34a 100%)',
            color: '#ffffff',
            padding: '10px 18px',
            textAlign: 'center',
            boxShadow: '0 4px 18px rgba(22, 163, 74, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 13,
            fontWeight: 600
          }}
        >
          <Wifi size={18} />
          <span>
            <b>Connection Restored:</b> You are back online. All systems are operational and synchronized.
          </span>
          <button
            onClick={() => setShowRestored(false)}
            style={{
              background: 'transparent',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 6px',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Dismiss banner"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}

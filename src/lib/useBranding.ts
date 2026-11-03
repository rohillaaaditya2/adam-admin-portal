'use client';
import { useState, useEffect } from 'react';
import { api, API } from './api';

export interface BrandingInfo {
  communityName: string;
  brandTitle: string;
  brandSubtitle: string;
  logoUrl: string;
  logoSquareUrl: string;
  supportEmail: string;
  supportPhone: string;
  loginPhotoUrl: string;
  isLoaded: boolean;
}

const DEFAULT_BRANDING: BrandingInfo = {
  communityName: 'Adam N Eve Matrimony',
  brandTitle: 'Adam N Eve',
  brandSubtitle: 'MATRIMONY',
  logoUrl: '',
  logoSquareUrl: '',
  supportEmail: 'support@adamneve.in',
  supportPhone: '+91 90000 00001',
  loginPhotoUrl: '',
  isLoaded: false
};

const CACHE_KEY = 'ane_branding_cache';

export function resolveMediaUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('/api')) {
    return `${API.replace(/\/api$/, '')}${url}`;
  }
  return url;
}

export function parseBranding(settings: Record<string, any>): BrandingInfo {
  const communityName = (settings.community_name || 'Adam N Eve Matrimony').trim();
  
  let brandTitle = communityName;
  let brandSubtitle = 'MATRIMONY';
  
  const matrimonyMatch = communityName.match(/^(.*?)\s+(matrimony)$/i);
  if (matrimonyMatch) {
    brandTitle = matrimonyMatch[1].trim();
    brandSubtitle = matrimonyMatch[2].toUpperCase();
  } else if (communityName.includes(' ')) {
    const parts = communityName.split(' ');
    brandSubtitle = parts.pop() || '';
    brandTitle = parts.join(' ');
  }

  return {
    communityName,
    brandTitle,
    brandSubtitle,
    logoUrl: settings.platform_logo_url || '',
    logoSquareUrl: settings.platform_logo_square_url || '',
    supportEmail: settings.support_email || 'support@adamneve.in',
    supportPhone: settings.support_phone || '+91 90000 00001',
    loginPhotoUrl: settings.login_photo_url || '',
    isLoaded: true
  };
}

let globalBranding: BrandingInfo = DEFAULT_BRANDING;
let listeners: Array<(b: BrandingInfo) => void> = [];

export function emitBrandingChange(updated: Partial<BrandingInfo>) {
  globalBranding = { ...globalBranding, ...updated };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(globalBranding));
    } catch {}
    window.dispatchEvent(new CustomEvent('ane_branding_change', { detail: globalBranding }));
  }
  listeners.forEach((l) => l(globalBranding));
}

export function useBranding(): BrandingInfo {
  // Always initialize with DEFAULT_BRANDING so server HTML and initial client hydration match 100%
  const [branding, setBranding] = useState<BrandingInfo>(DEFAULT_BRANDING);

  useEffect(() => {
    let mounted = true;

    // Load from local storage cache on mount (client-side only, after hydration completes)
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          globalBranding = { ...DEFAULT_BRANDING, ...parsed, isLoaded: true };
          if (mounted) {
            setBranding(globalBranding);
          }
        }
      } catch {}
    }

    const updateHandler = (b: BrandingInfo) => {
      if (mounted) setBranding(b);
    };
    listeners.push(updateHandler);

    const handleCustomEvent = (e: any) => {
      if (e?.detail && mounted) {
        setBranding(e.detail);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('ane_branding_change', handleCustomEvent);
    }

    api('/public/settings')
      .then((data: any) => {
        if (!mounted) return;
        if (data?.settings) {
          const fresh = parseBranding(data.settings);
          globalBranding = fresh;
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
          } catch {}
          setBranding(fresh);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
      listeners = listeners.filter((l) => l !== updateHandler);
      if (typeof window !== 'undefined') {
        window.removeEventListener('ane_branding_change', handleCustomEvent);
      }
    };
  }, []);

  return branding;
}

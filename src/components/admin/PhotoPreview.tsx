'use client';
import { useEffect, useState } from 'react';
import { API, getAdminToken } from '@/lib/api';

export function PhotoPreview({
  mediaId,
  directUrl,
  alt = 'Candidate photo',
  style,
  className
}: {
  mediaId?: string;
  directUrl?: string;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [url, setUrl] = useState(directUrl || '');
  const [loadFailed, setLoadFailed] = useState(false);
  useEffect(() => {
    setLoadFailed(false);
    setUrl(directUrl || '');
    if (directUrl && (directUrl.startsWith('http') || directUrl.startsWith('/api/public'))) {
      setUrl(directUrl);
      return;
    }
    if (!mediaId) return;
    let active = true, objectUrl = '';
    (async () => {
      try {
        const r = await fetch(API + '/media/' + mediaId, { headers: { Authorization: 'Bearer ' + getAdminToken() } });
        if (!r.ok) { if (active) setLoadFailed(true); return; }
        if (r.redirected && r.url) {
          if (active) setUrl(r.url);
          return;
        }
        objectUrl = URL.createObjectURL(await r.blob());
        if (active) setUrl(objectUrl);
        else URL.revokeObjectURL(objectUrl);
      } catch { if (active) setLoadFailed(true); }
    })();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [mediaId, directUrl]);

  return url && !loadFailed ? (
    <img
      src={url}
      alt={alt}
      className={className}
      style={{ height: 110, maxWidth: 120, objectFit: 'cover', borderRadius: 9, ...style }}
      onError={() => setLoadFailed(true)}
    />
  ) : (
    <div style={{ height: 110, width: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#94a3b8', borderRadius: 9, fontSize: 11, ...style }}>
      <span>{loadFailed ? 'Photo unavailable' : mediaId ? 'Loading...' : 'No photo uploaded'}</span>
    </div>
  );
}

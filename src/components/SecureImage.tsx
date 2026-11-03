'use client';
import React, { useState, useEffect } from 'react';
import { getSecureMediaUrl } from '../lib/api';

interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  mediaId?: string;
  isAdmin?: boolean;
  fallback?: React.ReactNode;
}

export function SecureImage({ mediaId, src, isAdmin, fallback, alt = '', style, onError, ...props }: SecureImageProps) {
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    if (mediaId) {
      getSecureMediaUrl(mediaId, isAdmin).then(url => {
        if (active) {
          if (url) {
            setBlobUrl(url);
            setFailed(false);
          } else {
            setFailed(true);
          }
        }
      });
      return;
    }

    const target = typeof src === 'string' ? src : '';
    if (!target) {
      setBlobUrl('');
      return;
    }
    const isProtectedMedia = target.includes('/media/') || (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('blob:') && !target.startsWith('data:'));
    if (!isProtectedMedia) {
      setBlobUrl(target);
      return;
    }
    getSecureMediaUrl(target, isAdmin).then(url => {
      if (active) {
        if (url) {
          setBlobUrl(url);
          setFailed(false);
        } else {
          setFailed(true);
        }
      }
    });
    return () => {
      active = false;
    };
  }, [mediaId, src, isAdmin]);

  if (failed || (!blobUrl && !src)) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <img
      src={blobUrl || (typeof src === 'string' && src.startsWith('http') ? src : '')}
      alt={alt}
      style={style}
      onError={(e) => {
        setFailed(true);
        if (onError) onError(e);
      }}
      {...props}
    />
  );
}

export default SecureImage;

'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import SecureImage from './SecureImage';
import {
  Heart, X, Star, MapPin, Briefcase, BookOpen, ShieldCheck,
  Sparkles, RotateCcw, Church, ArrowLeft, Share2, Zap,
  CheckCircle2, MessageCircle, Check, Sparkle
} from 'lucide-react';

export interface CandidateCardData {
  id: string;
  fields?: {
    firstName?: string;
    surname?: string;
    gender?: string;
    age?: number | string;
    presentCity?: string;
    presentState?: string;
    occupation?: string;
    education?: string;
    denomination?: string;
    churchName?: string;
    avatarUrl?: string;
    photoUrls?: string[];
    motherTongue?: string;
    height?: string;
    aboutCandidate?: string;
    [key: string]: any;
  };
  compatibilityScore?: number;
  compatibilityHighlights?: string[];
  badges?: {
    idVerified?: boolean;
    phoneVerified?: boolean;
  };
  isSpotlight?: boolean;
  createdFor?: string;
}

interface TinderSwipeDeckProps {
  candidates: CandidateCardData[];
  onSwipeRight: (candidate: CandidateCardData) => Promise<{ isMutualMatch?: boolean } | void>;
  onSwipeLeft: (candidate: CandidateCardData) => void;
  onShortlist?: (candidate: CandidateCardData) => void;
  onViewDetails?: (candidate: CandidateCardData) => void;
  onOpenChat?: (candidate: CandidateCardData) => void;
  onRefreshDeck: () => void;
  lang?: string;
  activeSubscriber?: boolean;
  onRequirePlan?: () => void;
  onlineUserIds?: Set<string>;
}

export function TinderSwipeDeck({
  candidates,
  onSwipeRight,
  onSwipeLeft,
  onShortlist,
  onViewDetails,
  onOpenChat,
  onRefreshDeck,
  lang = 'en',
  activeSubscriber = true,
  onRequirePlan,
  onlineUserIds
}: TinderSwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyDirection, setFlyDirection] = useState<'left' | 'right' | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [swipedHistory, setSwipedHistory] = useState<number[]>([]);
  const [detailCandidate, setDetailCandidate] = useState<CandidateCardData | null>(null);
  const [detailPhotoIdx, setDetailPhotoIdx] = useState(0);

  const startPos = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startTimeRef = useRef(0);
  const justSwipedRef = useRef(false);

  const activeCandidate = candidates[currentIndex];
  const nextCandidate = candidates[currentIndex + 1];

  // Up-to-date refs for stable callbacks and preventing stale closures
  const activeCandidateRef = useRef(activeCandidate);
  activeCandidateRef.current = activeCandidate;
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;
  const activeSubscriberRef = useRef(activeSubscriber);
  activeSubscriberRef.current = activeSubscriber;
  const onRequirePlanRef = useRef(onRequirePlan);
  onRequirePlanRef.current = onRequirePlan;
  const onSwipeRightRef = useRef(onSwipeRight);
  onSwipeRightRef.current = onSwipeRight;
  const onSwipeLeftRef = useRef(onSwipeLeft);
  onSwipeLeftRef.current = onSwipeLeft;

  // Stable candidate key comparison: Only reset currentIndex when candidate list actually changes length or content
  const candidateIdsKey = candidates.map(c => c.id).join(',');
  const prevKeyRef = useRef(candidateIdsKey);
  useEffect(() => {
    if (prevKeyRef.current !== candidateIdsKey) {
      prevKeyRef.current = candidateIdsKey;
      setCurrentIndex(0);
      setActivePhotoIdx(0);
      setSwipedHistory([]);
    }
  }, [candidateIdsKey]);

  // Touch and Drag handlers with real-time ref tracking & velocity detection
  const handleStart = (clientX: number, clientY: number) => {
    if (!activeCandidateRef.current) return;
    setIsDragging(true);
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    justSwipedRef.current = false;
    startTimeRef.current = Date.now();
    startPos.current = { x: clientX, y: clientY };
    dragOffsetRef.current = { x: 0, y: 0 };
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - startPos.current.x;
    const dy = clientY - startPos.current.y;
    dragOffsetRef.current = { x: dx, y: dy };
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      hasDraggedRef.current = true;
    }
    setDragOffset({ x: dx, y: dy });
  }, []);

  // Swipe Right -> Like (Uses fresh refs to prevent stale candidate swipe)
  const triggerSwipeRight = useCallback(async () => {
    const candidate = activeCandidateRef.current;
    if (!candidate) return;
    if (!activeSubscriberRef.current && onRequirePlanRef.current) {
      onRequirePlanRef.current();
      setDragOffset({ x: 0, y: 0 });
      dragOffsetRef.current = { x: 0, y: 0 };
      return;
    }
    justSwipedRef.current = true;
    setFlyDirection('right');
    setActionNotice('LIKED ❤️');
    const idx = currentIndexRef.current;
    setSwipedHistory((prev) => [...prev, idx]);
    setTimeout(() => {
      if (onSwipeRightRef.current) onSwipeRightRef.current(candidate);
      setCurrentIndex((prev) => prev + 1);
      setActivePhotoIdx(0);
      setDragOffset({ x: 0, y: 0 });
      dragOffsetRef.current = { x: 0, y: 0 };
      setFlyDirection(null);
      setTimeout(() => {
        setActionNotice(null);
        justSwipedRef.current = false;
      }, 500);
    }, 240);
  }, []);

  // Swipe Left -> Pass (Uses fresh refs to prevent stale candidate swipe)
  const triggerSwipeLeft = useCallback(() => {
    const candidate = activeCandidateRef.current;
    if (!candidate) return;
    justSwipedRef.current = true;
    setFlyDirection('left');
    setActionNotice('PASSED ✕');
    const idx = currentIndexRef.current;
    setSwipedHistory((prev) => [...prev, idx]);
    setTimeout(() => {
      if (onSwipeLeftRef.current) onSwipeLeftRef.current(candidate);
      setCurrentIndex((prev) => prev + 1);
      setActivePhotoIdx(0);
      setDragOffset({ x: 0, y: 0 });
      dragOffsetRef.current = { x: 0, y: 0 };
      setFlyDirection(null);
      setTimeout(() => {
        setActionNotice(null);
        justSwipedRef.current = false;
      }, 500);
    }, 240);
  }, []);

  const handleEnd = useCallback(async () => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);
    isDraggingRef.current = false;

    const currentX = dragOffsetRef.current.x;
    const duration = Date.now() - (startTimeRef.current || 0);
    const isQuickFlick = duration < 380 && Math.abs(currentX) > 30;
    const isDragPassed = Math.abs(currentX) > 50;

    if (currentX > 0 && (isQuickFlick || isDragPassed)) {
      await triggerSwipeRight();
    } else if (currentX < 0 && (isQuickFlick || isDragPassed)) {
      triggerSwipeLeft();
    } else {
      setDragOffset({ x: 0, y: 0 });
      dragOffsetRef.current = { x: 0, y: 0 };
    }
  }, [triggerSwipeRight, triggerSwipeLeft]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) handleMove(e.clientX, e.clientY);
    };
    const onMouseUp = () => {
      if (isDraggingRef.current) handleEnd();
    };
    const onTouchMoveWin = (e: TouchEvent) => {
      if (isDraggingRef.current && e.touches[0]) {
        const dx = e.touches[0].clientX - startPos.current.x;
        const dy = e.touches[0].clientY - startPos.current.y;
        if (Math.abs(dx) > Math.abs(dy) && e.cancelable) {
          e.preventDefault();
        }
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEndWin = () => {
      if (isDraggingRef.current) handleEnd();
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMoveWin, { passive: false });
      window.addEventListener('touchend', onTouchEndWin);
      window.addEventListener('touchcancel', onTouchEndWin);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMoveWin);
      window.removeEventListener('touchend', onTouchEndWin);
      window.removeEventListener('touchcancel', onTouchEndWin);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Rewind / Undo Last Swipe
  const triggerRewind = () => {
    if (swipedHistory.length === 0) {
      setActionNotice('No previous card');
      setTimeout(() => setActionNotice(null), 900);
      return;
    }
    const lastIdx = swipedHistory[swipedHistory.length - 1];
    setSwipedHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastIdx);
    setActivePhotoIdx(0);
    setActionNotice('REWIND ↺');
    setTimeout(() => setActionNotice(null), 800);
  };

  // Superlike / Shortlist
  const triggerShortlist = () => {
    if (!activeCandidate) return;
    if (onShortlist) onShortlist(activeCandidate);
    setActionNotice('SUPERLIKE ⭐');
    setTimeout(() => setActionNotice(null), 1000);
  };

  // Tap photo left/right side to browse candidate photos (only on tap, not after drag)
  const handlePhotoTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (justSwipedRef.current || hasDraggedRef.current || isDraggingRef.current || Math.abs(dragOffsetRef.current.x) > 8 || Math.abs(dragOffsetRef.current.y) > 8) {
      hasDraggedRef.current = false;
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const currentActiveCandidate = activeCandidateRef.current;
    if (!currentActiveCandidate) return;
    const photos = getCandidatePhotos(currentActiveCandidate);
    if (tapX < rect.width * 0.35) {
      // Tap Left -> Previous Photo
      setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (tapX > rect.width * 0.65) {
      // Tap Right -> Next Photo
      setActivePhotoIdx((prev) => (prev < photos.length - 1 ? prev + 1 : prev));
    } else {
      // Tap Center -> Open Screen 5 Profile Detail
      setDetailCandidate(currentActiveCandidate);
      setDetailPhotoIdx(activePhotoIdx);
      if (onViewDetails) onViewDetails(currentActiveCandidate);
    }
  };

  // Helper to get array of candidate photos (always guarantee 4 photos for 1/4 badge)
  const getCandidatePhotos = (candidate?: CandidateCardData): string[] => {
    if (!candidate) return [];
    const urls = candidate.fields?.photoUrls || [];
    const isMale = String(candidate.fields?.gender || '').trim().toLowerCase() === 'male';
    const base = urls.length > 0 ? urls : (candidate.fields?.avatarUrl ? [candidate.fields.avatarUrl] : []);
    const maleFallbacks = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80'
    ];
    const femaleFallbacks = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
    ];
    const fallbacks = isMale ? maleFallbacks : femaleFallbacks;
    const combined = [...base];
    for (const fb of fallbacks) {
      if (combined.length >= 4) break;
      if (!combined.includes(fb)) combined.push(fb);
    }
    return combined;
  };

  // Stamp Opacities based on drag
  const likeOpacity = Math.min(1, Math.max(0, dragOffset.x / 70));
  const nopeOpacity = Math.min(1, Math.max(0, -dragOffset.x / 70));

  // Dynamic Card Transform
  const getCardTransform = () => {
    if (flyDirection === 'right') return 'translate3d(140%, 20px, 0) rotate(24deg)';
    if (flyDirection === 'left') return 'translate3d(-140%, 20px, 0) rotate(-24deg)';
    if (isDragging) {
      return `translate3d(${dragOffset.x}px, ${dragOffset.y * 0.25}px, 0) rotate(${dragOffset.x * 0.07}deg)`;
    }
    return 'translate3d(0, 0, 0) rotate(0deg)';
  };

  // =========================================================================
  // SCREEN 5: PROFILE DETAIL (APP) - Full Fidelity View from Reference Photo
  // =========================================================================
  if (detailCandidate) {
    const df = detailCandidate.fields || {};
    const detailPhotos = getCandidatePhotos(detailCandidate);
    const activeDetailPhoto = detailPhotos[detailPhotoIdx] || detailPhotos[0];

    return (
      <div
        className="profile-detail-screen"
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 440,
          height: '100vh',
          zIndex: 1050,
          background: '#ffffff',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 90,
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
        {/* Top Floating App Bar */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            right: 14,
            zIndex: 1060,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <button
            type="button"
            onClick={() => setDetailCandidate(null)}
            aria-label="Back to Discover"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <button
            type="button"
            aria-label="Share Profile"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Hero Photo with Rounded Bottom Corners */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 390,
            borderRadius: '0 0 28px 28px',
            overflow: 'hidden',
            backgroundColor: '#0f172a'
          }}
        >
          <SecureImage
            src={activeDetailPhoto}
            alt={df.firstName || 'Candidate'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>

        {/* 4 Photo Thumbnails Row */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            padding: '14px 18px 8px',
            justifyContent: 'center'
          }}
        >
          {detailPhotos.slice(0, 4).map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setDetailPhotoIdx(idx)}
              style={{
                width: 66,
                height: 66,
                borderRadius: 14,
                overflow: 'hidden',
                border: detailPhotoIdx === idx ? '2.5px solid #ff2d55' : '1.5px solid #e2e8f0',
                padding: 0,
                cursor: 'pointer',
                background: '#f1f5f9',
                boxShadow: detailPhotoIdx === idx ? '0 4px 12px rgba(255, 45, 85, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <SecureImage
                src={url}
                alt={`Photo ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>

        {/* Profile Info Details */}
        <div style={{ padding: '12px 22px' }}>
          {/* Header Row: Name, Age, Verified Badge & Online Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                {df.firstName || 'Candidate'}{df.age ? `, ${df.age}` : ''}
              </h1>
              <CheckCircle2 size={20} fill="#0084ff" color="#ffffff" />
            </div>
            {onlineUserIds?.has(String(detailCandidate?.id || '')) ? (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }} />
                Online now
              </span>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#94a3b8', display: 'inline-block' }} />
                Active recently
              </span>
            )}
          </div>

          {/* Details List with Clean Icons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '14px 0 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#334155' }}>
              <Briefcase size={16} color="#64748b" />
              <span>{df.occupation || 'Software Engineer at TCS'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#334155' }}>
              <BookOpen size={16} color="#64748b" />
              <span>{df.education || 'B.Tech - Computer Science'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#334155' }}>
              <Church size={16} color="#64748b" />
              <span>{df.denomination || 'Christian Community'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#334155' }}>
              <MapPin size={16} color="#64748b" />
              <span>{df.presentCity || 'Bangalore'}{df.presentState ? `, ${df.presentState}` : ', Karnataka'}</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: '#f1f5f9', margin: '14px 0' }} />

          {/* About Section */}
          <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65, margin: 0 }}>
            {df.aboutCandidate || 'Simple, family oriented and looking for a life partner with good values.'}
          </p>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 440,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid #f1f5f9',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
            zIndex: 1100
          }}
        >
          {/* Send Interest Button (Solid Hot Pink) */}
          <button
            type="button"
            onClick={async () => {
              await onSwipeRight(detailCandidate);
              setDetailCandidate(null);
            }}
            style={{
              flex: 1,
              background: '#ff2d55',
              color: '#ffffff',
              border: 'none',
              borderRadius: 30,
              padding: '13px 18px',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(255, 45, 85, 0.35)',
              textAlign: 'center'
            }}
          >
            Send Interest
          </button>

          {/* Chat Button (White with Pink Outline) */}
          <button
            type="button"
            onClick={() => {
              if (onOpenChat) onOpenChat(detailCandidate);
              setDetailCandidate(null);
            }}
            style={{
              flex: 1,
              background: '#ffffff',
              color: '#ff2d55',
              border: '1.5px solid #ff2d55',
              borderRadius: 30,
              padding: '13px 18px',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            Chat
          </button>

          {/* Circular Heart Button */}
          <button
            type="button"
            onClick={async () => {
              await onSwipeRight(detailCandidate);
              setDetailCandidate(null);
            }}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#ffffff',
              border: '1.5px solid #fecdd3',
              color: '#ff2d55',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 45, 85, 0.15)',
              flexShrink: 0
            }}
          >
            <Heart size={22} fill="#ff2d55" />
          </button>
        </div>
      </div>
    );
  }

  // Deck Empty State
  if (!activeCandidate || currentIndex >= candidates.length) {
    return (
      <div
        style={{
          background: '#ffffff',
          borderRadius: 24,
          border: '1.5px dashed #cbd5e1',
          padding: '48px 20px',
          textAlign: 'center',
          maxWidth: 400,
          margin: '30px auto',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
        <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#fdf2f8', color: '#ff2d55', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Sparkles size={34} />
        </div>
        <h3 style={{ fontSize: 21, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
          {lang === 'hi' ? 'Aaj Ke Sabhi Profiles Dekh Liye!' : "You've Explored All Matches!"}
        </h3>
        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, maxWidth: 300, margin: '0 auto 22px' }}>
          {lang === 'hi'
            ? 'Naye verified Christian profiles roz judte hain. Deck ko refresh karke dobara browse karein.'
            : 'New verified Christian profiles join daily. Refresh the match deck to explore more members.'}
        </p>
        <button
          type="button"
          onClick={() => {
            setCurrentIndex(0);
            setActivePhotoIdx(0);
            onRefreshDeck();
          }}
          style={{
            background: '#ff2d55',
            color: '#fff',
            border: 'none',
            borderRadius: 24,
            padding: '12px 26px',
            fontSize: 13.5,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 6px 18px rgba(255, 45, 85, 0.3)'
          }}
        >
          <RotateCcw size={16} /> {lang === 'hi' ? 'Deck Refresh Karein' : 'Refresh Match Deck'}
        </button>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 4: SWIPE / DISCOVER (APP) - Full Fidelity View from Reference Photo
  // =========================================================================
  const f = activeCandidate.fields || {};
  const currentPhotos = getCandidatePhotos(activeCandidate);
  const activePhotoUrl = currentPhotos[activePhotoIdx] || currentPhotos[0];

  return (
    <div
      className="tinder-swipe-screen"
      style={{
        maxWidth: 420,
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        userSelect: 'none',
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* Toast Notification Flash */}
      {actionNotice && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            background: actionNotice.includes('LIKED') ? '#10b981' : (actionNotice.includes('PASSED') ? '#ef4444' : (actionNotice.includes('SUPERLIKE') ? '#3b82f6' : '#64748b')),
            color: '#fff',
            fontWeight: 800,
            fontSize: 12.5,
            padding: '6px 18px',
            borderRadius: 20,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            pointerEvents: 'none'
          }}
        >
          {actionNotice}
        </div>
      )}

      {/* Cards Deck Container */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(390px, 57vh, 530px)', margin: '0 auto' }}>
        {/* Next Card Background Preview */}
        {nextCandidate && (() => {
          const dragRatio = Math.min(1, Math.abs(dragOffset.x) / 110);
          return (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 28,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transform: `scale(${0.94 + dragRatio * 0.06}) translateY(${14 - dragRatio * 14}px)`,
                opacity: 0.8 + dragRatio * 0.2,
                pointerEvents: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                transition: isDragging ? 'none' : 'transform 0.25s ease, opacity 0.25s ease'
              }}
            >
              <SecureImage
                src={getCandidatePhotos(nextCandidate)[0]}
                alt="Next Candidate"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          );
        })()}

        {/* Active Swipe Card */}
        <div
          id="active-tinder-card"
          data-testid="active-tinder-card"
          onTouchStart={onTouchStart}
          onMouseDown={onMouseDown}
          onClick={handlePhotoTap}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 28,
            background: '#ffffff',
            boxShadow: isDragging ? '0 20px 50px rgba(0, 0, 0, 0.22)' : '0 16px 40px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'pointer',
            transform: getCardTransform(),
            opacity: flyDirection ? 0 : 1,
            transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.2), opacity 0.24s ease',
            zIndex: 10,
            touchAction: 'none'
          }}
        >
          {/* Card Portrait Photo */}
          <div style={{ position: 'relative', width: '100%', height: '100%', background: '#0f172a' }}>
            <SecureImage
              src={activePhotoUrl}
              alt={f.firstName || 'Candidate'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                display: 'block'
              }}
            />

            {/* Photo Counter Badge (1/4) in Top Right */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 14,
                letterSpacing: '0.04em',
                pointerEvents: 'none'
              }}
            >
              {activePhotoIdx + 1}/{currentPhotos.length}
            </div>

            {/* LIKE Stamp on Drag Right */}
            <div
              style={{
                position: 'absolute',
                top: 30,
                left: 24,
                border: '3.5px solid #10b981',
                color: '#10b981',
                fontWeight: 900,
                fontSize: 26,
                letterSpacing: '0.1em',
                padding: '4px 16px',
                borderRadius: 10,
                transform: 'rotate(-18deg)',
                opacity: likeOpacity,
                pointerEvents: 'none',
                background: 'rgba(255,255,255,0.85)'
              }}
            >
              LIKE
            </div>

            {/* NOPE Stamp on Drag Left */}
            <div
              style={{
                position: 'absolute',
                top: 30,
                right: 24,
                border: '3.5px solid #ef4444',
                color: '#ef4444',
                fontWeight: 900,
                fontSize: 26,
                letterSpacing: '0.1em',
                padding: '4px 16px',
                borderRadius: 10,
                transform: 'rotate(18deg)',
                opacity: nopeOpacity,
                pointerEvents: 'none',
                background: 'rgba(255,255,255,0.85)'
              }}
            >
              NOPE
            </div>

            {/* Bottom Gradient Overlay on Photo */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '45%',
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%)',
                padding: '0 20px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#ffffff',
                pointerEvents: 'none'
              }}
            >
              {/* Name, Age & Verified Checkmark */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
                  {f.firstName || 'Candidate'}{f.age ? `, ${f.age}` : ''}
                </h2>
                <CheckCircle2 size={21} fill="#0084ff" color="#ffffff" />
              </div>

              {/* Profession with Briefcase Icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#f8fafc', marginBottom: 4, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                <Briefcase size={15} color="#e2e8f0" />
                <span>{f.occupation || 'Software Engineer'}</span>
              </div>

              {/* Location with Pin Icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#e2e8f0', marginBottom: 6, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                <MapPin size={15} color="#e2e8f0" />
                <span>{f.presentCity || 'Bangalore'}{f.presentState ? `, ${f.presentState}` : ', Karnataka'}</span>
              </div>

              {/* Online Indicator Dot (Real-Time Presence) */}
              {onlineUserIds?.has(String(activeCandidate?.id || '')) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#4ade80' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
                  Online now
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, color: '#cbd5e1' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#94a3b8', display: 'inline-block' }} />
                  Active recently
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5 Circular Action Buttons (Matching Reference Screen 4) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(8px, 2.8vw, 16px)',
          padding: '0 8px',
          flexWrap: 'nowrap',
          marginTop: 'clamp(10px, 2vh, 18px)',
          marginBottom: 'clamp(8px, 1.5vh, 14px)'
        }}
      >
        {/* 1. Rewind / Undo Button (Grey ↺) */}
        <button
          type="button"
          onClick={triggerRewind}
          aria-label="Rewind / Undo Last Swipe"
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: '#ffffff',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <RotateCcw size={20} strokeWidth={2.4} />
        </button>

        {/* 2. Dislike / Pass Button (Red ✕) */}
        <button
          type="button"
          onClick={triggerSwipeLeft}
          aria-label="Pass Candidate (Swipe Left)"
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            border: 'none',
            background: '#ffffff',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(239, 68, 68, 0.22)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <X size={28} strokeWidth={2.8} />
        </button>

        {/* 3. Superlike / Shortlist Button (Blue ⭐) */}
        <button
          type="button"
          onClick={triggerShortlist}
          aria-label="Superlike Candidate"
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: '#ffffff',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Star size={20} strokeWidth={2.4} fill="#3b82f6" />
        </button>

        {/* 4. Like Button (Green 💚) */}
        <button
          type="button"
          onClick={triggerSwipeRight}
          aria-label="Like Candidate (Swipe Right)"
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            border: 'none',
            background: '#ffffff',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.24)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={28} fill="#10b981" />
        </button>

        {/* 5. Boost Button (Purple ⚡) */}
        <button
          type="button"
          onClick={() => {
            setActionNotice('BOOST ⚡');
            setTimeout(() => setActionNotice(null), 800);
          }}
          aria-label="Boost Profile"
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: '#ffffff',
            color: '#a855f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(168, 85, 247, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Zap size={20} fill="#a855f7" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

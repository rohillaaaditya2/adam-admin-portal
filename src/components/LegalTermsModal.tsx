'use client';
import { useState, useEffect } from 'react';
import { X, FileText, ShieldCheck, CheckCircle2, CreditCard, Lock, Scale } from 'lucide-react';
import { LEGAL_DOCS, LegalDoc } from '@/lib/legal-content';

interface LegalTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocKey?: string;
  onAcceptAll?: () => void;
}

const TABS = [
  { key: 'terms-of-service', label: 'Terms of Service', icon: FileText },
  { key: 'privacy-policy', label: 'Privacy & DPDP Act', icon: Lock },
  { key: 'refund-policy', label: 'Refund Policy', icon: CreditCard },
  { key: 'safety-centre', label: 'Safety Guidelines', icon: ShieldCheck }
];

export default function LegalTermsModal({
  isOpen,
  onClose,
  initialDocKey = 'terms-of-service',
  onAcceptAll
}: LegalTermsModalProps) {
  const [activeTab, setActiveTab] = useState(initialDocKey);

  useEffect(() => {
    if (initialDocKey && LEGAL_DOCS[initialDocKey]) {
      setActiveTab(initialDocKey);
    }
  }, [initialDocKey, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentDoc: LegalDoc | undefined = LEGAL_DOCS[activeTab] || LEGAL_DOCS['terms-of-service'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #fce7f3'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px 14px',
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)',
            borderBottom: '1px solid #f1f5f9',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: '#be185d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(190, 24, 93, 0.25)'
                }}
              >
                <Scale size={20} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Platform Charters, Policies & Guidelines
                </h2>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                  Adam N Eve Matrimony · DPDP Act, 2023 & Child Marriage Prohibition Act Compliant
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close dialog"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2';
                e.currentTarget.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              scrollbarWidth: 'none'
            }}
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 10,
                    fontSize: '0.84rem',
                    fontWeight: isActive ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    border: isActive ? '1.5px solid #be185d' : '1px solid #e2e8f0',
                    backgroundColor: isActive ? '#be185d' : '#ffffff',
                    color: isActive ? '#ffffff' : '#475569'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div
          style={{
            padding: '24px 28px',
            overflowY: 'auto',
            flex: 1,
            lineHeight: 1.65,
            color: '#334155'
          }}
        >
          {currentDoc && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    backgroundColor: '#fce7f3',
                    color: '#9d174d',
                    marginBottom: 8
                  }}
                >
                  {currentDoc.badge}
                </span>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {currentDoc.title}
                </h3>
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderLeft: '4px solid #be185d',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '0.88rem',
                    color: '#475569',
                    fontStyle: 'italic'
                  }}
                >
                  {currentDoc.summary}
                </div>
              </div>

              {/* Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {currentDoc.sections.map((sec, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '16px 18px',
                      borderRadius: 12,
                      backgroundColor: '#ffffff',
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                  >
                    <h4
                      style={{
                        margin: '0 0 10px',
                        fontSize: '0.96rem',
                        fontWeight: 700,
                        color: '#0f172a'
                      }}
                    >
                      {sec.heading}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
                      {sec.content.map((p, pIdx) => (
                        <p key={pIdx} style={{ margin: 0 }}>
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#64748b' }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>All statutory declarations are legally enforceable under Indian Law.</span>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                fontSize: '0.86rem',
                fontWeight: 600,
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Close
            </button>

            {onAcceptAll && (
              <button
                type="button"
                onClick={() => {
                  onAcceptAll();
                  onClose();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 20px',
                  borderRadius: 10,
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  border: 'none',
                  backgroundColor: '#be185d',
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(190, 24, 93, 0.3)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9d174d')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#be185d')}
              >
                <CheckCircle2 size={16} />
                <span>I Have Read & Agree to All Terms</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { Search, X, MessageCircle, Eye, Printer, Zap } from 'lucide-react';
import { Row } from './types';

interface AdminOmniSearchProps {
  onSelectCandidate: (candidate: Row) => void;
  onOpenWhatsApp: (phone: string, name: string) => void;
  onPrintPdf: (candidate: Row) => void;
  onInspectFields: (candidate: Row) => void;
}

export function AdminOmniSearch({
  onSelectCandidate,
  onOpenWhatsApp,
  onPrintPdf,
  onInspectFields
}: AdminOmniSearchProps) {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<Row[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const timerRef = React.useRef<any>(null);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!val.trim() || val.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    setIsOpen(true);
    timerRef.current = setTimeout(async () => {
      try {
        const { api } = await import('@/lib/api');
        const res = await api(`/admin/omni-search?q=${encodeURIComponent(val.trim())}`);
        setResults(res.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  };

  return (
    <div style={{ position: 'relative', marginBottom: 24, zIndex: 100 }}>
      <div style={{ position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: 16, top: 14, color: '#c2185b' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="⚡ Instant Omni-Search: Type Mobile Phone (e.g. 9876543210), Candidate Name, Parish, or Order ID..."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 40px 12px 42px',
            borderRadius: 12,
            border: '2px solid #fbcfe8',
            background: '#fff',
            fontSize: 13,
            fontWeight: 500,
            color: '#0f172a',
            boxShadow: '0 4px 12px rgba(194,24,91,0.06)',
            outline: 'none'
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            style={{ position: 'absolute', right: 14, top: 14, background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Instant Omni Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            maxHeight: 460,
            overflowY: 'auto',
            padding: 12
          }}
        >
          {loading && (
            <div style={{ padding: 16, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
              Searching member database...
            </div>
          )}

          {!loading && !results.length && (
            <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
              No matches found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && results.map((item, idx) => (
            <div
              key={item._id || idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: 10,
                borderBottom: '1px solid #f1f5f9',
                background: '#fff',
                transition: 'background 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 14, color: '#0f172a' }}>
                    {item.profile?.fields?.firstName || item.name || 'Member'} {item.profile?.fields?.surname || ''}
                  </strong>
                  <span className={`status-pill ${item.accountStatus === 'active' ? 'success' : 'warn'}`} style={{ fontSize: 9 }}>
                    {item.accountStatus || 'active'}
                  </span>
                  {item.source && (
                    <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>
                      {item.source}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                  📞 {item.phone} · {item.profile?.fields?.denomination || 'Christian'} · {item.profile?.fields?.presentCity || 'India'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className="chip-action"
                  title="Direct WhatsApp"
                  onClick={() => onOpenWhatsApp(item.phone, item.profile?.fields?.firstName || 'Candidate')}
                  style={{ color: '#16a34a', borderColor: '#86efac', background: '#f0fdf4' }}
                >
                  <MessageCircle size={12} style={{ marginRight: 3 }} /> WhatsApp
                </button>
                <button
                  className="chip-action"
                  title="Printable PDF"
                  onClick={() => onPrintPdf(item)}
                  style={{ color: '#0284c7', borderColor: '#bae6fd', background: '#f0f9ff' }}
                >
                  <Printer size={12} style={{ marginRight: 3 }} /> PDF
                </button>
                <button
                  className="chip-action"
                  onClick={() => {
                    onInspectFields(item);
                    setIsOpen(false);
                  }}
                >
                  Inspect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

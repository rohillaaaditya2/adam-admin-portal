'use client';
import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { useLanguage } from '@/lib/useLanguage';

export interface CaptchaData {
  captchaToken: string;
  captchaAnswer: string;
  hp_trap?: string;
}

interface CaptchaFieldProps {
  onChange: (data: CaptchaData) => void;
  disabled?: boolean;
  value?: string;
}

export default function CaptchaField({ onChange, disabled, value }: CaptchaFieldProps) {
  const { t } = useLanguage();
  const [svgUrl, setSvgUrl] = useState('');
  const [token, setToken] = useState('');
  const [inputVal, setInputVal] = useState(value || '');
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    if (value !== undefined && value !== inputVal) {
      setInputVal(value);
    }
  }, [value, inputVal]);

  const fetchCaptcha = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await api('/auth/captcha');
      if (res?.svg && res?.token) {
        setSvgUrl(res.svg);
        setToken(res.token);
        onChange({ captchaToken: res.token, captchaAnswer: inputVal, hp_trap: honeypot });
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const handleInputChange = (val: string) => {
    // Preserve mixed uppercase and lowercase characters as typed by user
    const clean = val.slice(0, 6);
    setInputVal(clean);
    onChange({
      captchaToken: token,
      captchaAnswer: clean,
      hp_trap: honeypot
    });
  };

  return (
    <div style={{ marginTop: 12, marginBottom: 12 }}>
      {/* Invisible honeypot trap for automated bots */}
      <input
        type="text"
        name="hp_trap"
        value={honeypot}
        onChange={(e) => {
          setHoneypot(e.target.value);
          onChange({ captchaToken: token, captchaAnswer: inputVal, hp_trap: e.target.value });
        }}
        tabIndex={-1}
        autoComplete="off"
        style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0 }}
      />

      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '12px 14px',
          background: '#f8fafc'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <ShieldCheck size={15} color="#16a34a" /> {t('securityVerification', 'Security Verification')}
          </span>
          <button
            type="button"
            onClick={fetchCaptcha}
            disabled={loading || disabled}
            title={t('refreshCodeTitle', 'Refresh code')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#c2185b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11.5,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4
            }}
          >
            <RefreshCw size={12} className={loading ? 'spin' : ''} />
            {t('refreshCode', 'Refresh')}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              width: 160,
              height: 44,
              background: '#f1f5f9',
              borderRadius: 8,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #cbd5e1',
              position: 'relative'
            }}
          >
            {svgUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={svgUrl}
                alt="Security Verification Code"
                style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', userSelect: 'none' }}
              />
            ) : (
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Loading code...</span>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 140 }}>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={t('enterCodePlaceholder', 'Enter code')}
              required
              disabled={disabled || loading}
              maxLength={6}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.12em',
                background: '#fff'
              }}
            />
          </div>
        </div>
        <small style={{ display: 'block', color: '#64748b', fontSize: 11, marginTop: 7, lineHeight: 1.5 }}>
          {t('enterCodeCaption', 'Enter the security code shown above (case-insensitive).')}
        </small>
      </div>
    </div>
  );
}

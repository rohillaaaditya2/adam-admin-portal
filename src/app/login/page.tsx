'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, ShieldAlert, ArrowLeft, Eye, EyeOff, Terminal, Lock } from 'lucide-react';
import { api, post, setAdminToken, setToken, getAdminToken } from '@/lib/api';
import CaptchaField, { CaptchaData } from '@/components/CaptchaField';

export default function AdminLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaData, setCaptchaData] = useState<CaptchaData>({ captchaToken: '', captchaAnswer: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeSession, setActiveSession] = useState<{ phone: string; role: string } | null>(null);

  function quickFillAdmin() {
    setPhone('9000000001');
    setPassword('AdminPass123!Secure');
    setErr('');
  }

  function handleSignOutSession() {
    localStorage.removeItem('ane_admin_token');
    setActiveSession(null);
  }

  useEffect(() => {
    setMounted(true);
    // Check if there is an existing session, but do NOT auto-redirect away
    const token = getAdminToken();
    if (token) {
      api('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((d: any) => {
          if (d?.user && (d.user.role === 'admin' || d.user.role === 'moderator')) {
            setActiveSession({ phone: d.user.phone, role: d.user.role });
          } else {
            localStorage.removeItem('ane_admin_token');
            setActiveSession(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('ane_admin_token');
          setActiveSession(null);
        });
    }

    if (typeof window !== 'undefined' && window.location.search.includes('demo=true')) {
      quickFillAdmin();
    }

    // Auto-focus phone input
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '').trim();
    if (!cleanPhone || !/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
      return setErr('Please enter a valid staff mobile number');
    }
    if (!password || password.length < 6) {
      return setErr('Please enter your administrative password');
    }
    if (!captchaData.captchaAnswer.trim()) {
      return setErr('Please complete the security CAPTCHA verification');
    }
    setBusy(true);
    setErr('');
    try {
      const d: any = await post('/auth/login', {
        phone: cleanPhone,
        password: password.trim(),
        captchaToken: captchaData.captchaToken,
        captchaAnswer: captchaData.captchaAnswer.trim(),
        hp_trap: captchaData.hp_trap
      });
      if (d?.user?.role !== 'admin' && d?.user?.role !== 'moderator') {
        throw new Error('Access denied. This console is strictly restricted to authorized staff & administrators.');
      }
      setAdminToken(d.token);
      setToken(d.token);
      location.href = '/admin/operations';
    } catch (x: any) {
      setErr(x.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 45%, #020617 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(circle, rgba(194, 24, 91, 0.22) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <style>{`
        @keyframes floatCard {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .admin-box {
          animation: floatCard 0.4s ease-out forwards;
        }
        .admin-input-field {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.75);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          color: #f8fafc;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .admin-input-field:focus {
          border-color: #ec4899;
          background: rgba(15, 23, 42, 0.95);
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
        }
        .admin-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #c2185b 0%, #831843 100%);
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 10px 25px rgba(194, 24, 91, 0.4);
          transition: all 0.2s;
        }
        .admin-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(194, 24, 91, 0.55);
        }
        .admin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="admin-box" style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(30, 41, 59, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '36px 30px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        zIndex: 10
      }}>

        {/* Security badge & Icon */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '60px', height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #c2185b 0%, #880e4f 100%)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(194, 24, 91, 0.45)',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={32} color="#ffffff" />
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(236, 72, 153, 0.12)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            color: '#f472b6',
            fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em',
            padding: '4px 12px', borderRadius: '20px', marginBottom: '10px'
          }}>
            <Terminal size={12} />
            DEDICATED ADMIN CONSOLE
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', color: '#ffffff' }}>
            Administrative Login
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            Adam N Eve Matrimony · Internal Staff & Moderator Access
          </p>
        </div>

        {/* Error notification */}
        {err && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '12px', padding: '12px 14px', marginBottom: '20px',
            color: '#fca5a5', fontSize: '13px', lineHeight: 1.5
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{err}</span>
          </div>
        )}

        {/* Active Session Notification */}
        {activeSession && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '18px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active Admin Session Detected
              </span>
              <span style={{ fontSize: '11px', color: '#a7f3d0', fontWeight: 700 }}>
                {activeSession.phone}
              </span>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5 }}>
              You are currently logged in with staff privileges ({activeSession.role}).
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Link
                href="/admin/operations"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Go to Dashboard →
              </Link>
              <button
                type="button"
                onClick={handleSignOutSession}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Sign Out / Switch Account
              </button>
            </div>
          </div>
        )}

        {/* Staff Test Account Quick Fill */}
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.22)',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Staff Test Account
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Phone: <b>9000000001</b>
            </div>
          </div>
          <button
            type="button"
            onClick={quickFillAdmin}
            style={{
              background: 'rgba(56, 189, 248, 0.18)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Auto-Fill
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={submit} action="javascript:void(0);" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Staff ID */}
          <div>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: 700,
              color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              Admin / Staff Mobile
            </label>
            <input
              ref={inputRef}
              type="tel"
              className="admin-input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9000000001"
              maxLength={15}
              autoComplete="off"
              required
            />
          </div>

          {/* Password with eye toggle */}
          <div>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: 700,
              color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="admin-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: '12px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', padding: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Security Captcha Field */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '14px', borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <CaptchaField onChange={setCaptchaData} disabled={busy} value={captchaData.captchaAnswer} />
          </div>

          {/* Submit button */}
          <button type="submit" className="admin-btn" disabled={busy}>
            {busy ? 'Authenticating...' : (
              <>
                <Lock size={16} /> Sign In to Admin Console <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security warning notice */}
        <div style={{
          marginTop: '22px', padding: '12px 14px',
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px', textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
            🛡️ Authorized personnel only. All access attempts are recorded with timestamp and IP address.
          </p>
        </div>

        {/* Back link */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link
            href="/login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: '#94a3b8', fontSize: '12px', textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            <ArrowLeft size={13} /> Switch to User / Member Login
          </Link>
        </div>
      </div>
    </div>
  );
}

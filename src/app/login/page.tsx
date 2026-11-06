'use client';
import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowRight, Eye, EyeOff, Lock, Mail, KeyRound, RefreshCw } from 'lucide-react';
import { post, setAdminToken, getAdminToken } from '@/lib/api';

export default function AdminLogin() {
  const [step, setStep] = useState<'CREDENTIALS' | 'OTP'>('CREDENTIALS');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const phoneRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If already logged in, redirect straight to operations
    const token = getAdminToken();
    if (token) {
      window.location.href = '/operations';
      return;
    }
    setTimeout(() => phoneRef.current?.focus(), 300);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Step 1: Submit Phone & Password (No CAPTCHA) -> Brevo sends OTP to Gmail
  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '').trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      return setErr('Please enter your registered staff mobile number');
    }
    if (!password) {
      return setErr('Please enter your administrative password');
    }

    setBusy(true);
    setErr('');
    try {
      const res: any = await post('/admin/auth/request-login', {
        phone: cleanPhone,
        password: password.trim()
      });

      if (res?.ok && res?.step === 'OTP_REQUIRED') {
        setMaskedEmail(res.maskedEmail || 'your registered Gmail');
        setStep('OTP');
        setCountdown(60);
        setTimeout(() => otpRef.current?.focus(), 300);
      } else {
        setErr(res?.error || 'Authentication failed');
      }
    } catch (e: any) {
      setErr(e?.message || 'Invalid administrative credentials or server error');
    } finally {
      setBusy(false);
    }
  }

  // Step 2: Verify 6-digit OTP received on Gmail
  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      return setErr('Please enter the complete 6-digit code received on your Gmail');
    }

    setBusy(true);
    setErr('');
    try {
      const res: any = await post('/admin/auth/verify-otp', {
        phone: phone.replace(/[\s\-\(\)\.]/g, '').trim(),
        otp: cleanOtp
      });

      if (res?.ok && res?.token) {
        setAdminToken(res.token);
        window.location.href = '/operations';
      } else {
        setErr(res?.error || 'Invalid verification code');
      }
    } catch (e: any) {
      setErr(e?.message || 'Invalid or expired verification code');
    } finally {
      setBusy(false);
    }
  }

  // Resend OTP
  async function handleResendOtp() {
    if (countdown > 0 || busy) return;
    setBusy(true);
    setErr('');
    try {
      const res: any = await post('/admin/auth/request-login', {
        phone: phone.replace(/[\s\-\(\)\.]/g, '').trim(),
        password: password.trim()
      });
      if (res?.ok) {
        setCountdown(60);
      } else {
        setErr(res?.error || 'Could not resend OTP');
      }
    } catch (e: any) {
      setErr(e?.message || 'Resend failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%)',
      padding: '24px',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#ffffff'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(30, 41, 59, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 16px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(14, 165, 233, 0.35)'
          }}>
            <ShieldCheck size={30} />
          </div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Administrative Console
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#94a3b8' }}>
            {step === 'CREDENTIALS' ? 'Secure Staff Sign-In' : 'Gmail 2FA Verification'}
          </p>
        </div>

        {/* Error message */}
        {err && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#fca5a5',
            lineHeight: 1.4
          }}>
            {err}
          </div>
        )}

        {/* STEP 1: Phone + Password (No CAPTCHA) */}
        {step === 'CREDENTIALS' && (
          <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Admin Phone
              </label>
              <input
                ref={phoneRef}
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  style={{
                    width: '100%',
                    padding: '12px 46px 12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(14, 165, 233, 0.3)'
              }}
            >
              {busy ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  <Lock size={16} /> Continue to 2FA <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Gmail Brevo OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{
              background: 'rgba(14, 165, 233, 0.12)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <Mail size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '12.5px', color: '#e0f2fe', lineHeight: 1.5 }}>
                A 6-digit login code has been sent via Brevo to your Gmail: <b style={{ color: '#ffffff' }}>{maskedEmail}</b>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Enter 6-Digit Code
              </label>
              <input
                ref={otpRef}
                type="text"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '22px',
                  fontWeight: 800,
                  letterSpacing: '10px',
                  textAlign: 'center',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <button
                type="button"
                onClick={() => { setStep('CREDENTIALS'); setErr(''); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
              >
                ← Back to Login
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || busy}
                style={{
                  background: 'none',
                  border: 'none',
                  color: countdown > 0 ? '#64748b' : '#38bdf8',
                  cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                {countdown > 0 ? `Resend Code (${countdown}s)` : 'Resend Code'}
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              style={{
                marginTop: '4px',
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 1000%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
              }}
            >
              {busy ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  <KeyRound size={16} /> Verify & Access Console
                </>
              )}
            </button>
          </form>
        )}

        <div style={{
          marginTop: '24px',
          padding: '10px 14px',
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '11px',
          color: '#64748b'
        }}>
          🛡️ Brevo 2FA Secured Administrative Gateway
        </div>

      </div>
    </div>
  );
}

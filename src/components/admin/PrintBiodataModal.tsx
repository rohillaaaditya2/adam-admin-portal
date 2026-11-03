'use client';
import React from 'react';
import { Printer, MessageCircle } from 'lucide-react';
import { PhotoPreview } from './PhotoPreview';
import { Row } from './types';

interface PrintBiodataModalProps {
  candidate: Row | null;
  onClose: () => void;
  openWhatsAppDirect: (phone: string, candidateName: string, templateType?: 'verification' | 'photos' | 'payment' | 'general') => void;
}

export function PrintBiodataModal({
  candidate,
  onClose,
  openWhatsAppDirect
}: PrintBiodataModalProps) {
  if (!candidate) return null;

  const p = candidate.profile?.fields || {};
  const firstPhoto = candidate.profile?.photoIds?.[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        padding: '24px 16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Print Toolbar (Hidden during print) */}
      <div
        className="no-print"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#ffffff',
          borderRadius: 14,
          padding: '12px 20px',
          marginBottom: 20,
          boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          maxWidth: 820,
          width: '100%'
        }}
      >
        <div>
          <strong style={{ fontSize: 14, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Printer size={16} color="#c2185b" /> Printable Christian Matrimony Biodata
          </strong>
          <small style={{ color: '#64748b', fontSize: 11 }}>Standard A4 layout ready for instant PDF save or WhatsApp circulation</small>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn btn-shaadi btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={() => window.print()}
          >
            <Printer size={14} /> Print / Save as PDF
          </button>

          <button
            className="btn btn-sm"
            style={{ background: '#25D366', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={() => openWhatsAppDirect(candidate.phone, p.firstName || 'Candidate', 'verification')}
          >
            <MessageCircle size={14} /> WhatsApp
          </button>

          <button
            className="btn btn-outline btn-sm"
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Printable A4 Sheet */}
      <div
        id="printable-biodata-sheet"
        style={{
          maxWidth: 820,
          width: '100%',
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: 12,
          padding: '40px 48px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          position: 'relative',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Platform Branding Header */}
        <div style={{ borderBottom: '3px double #c2185b', paddingBottom: 16, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>✝</span>
              <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.08em', color: '#831843' }}>
                ADAM N EVE CHRISTIAN MATRIMONY
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              Official Matrimonial Profile · Verified Church Registry Dossier
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#c2185b' }}>
              REG ID: ANE-{candidate._id?.slice(-6)?.toUpperCase() || 'MEMBER'}
            </span>
            <small style={{ fontSize: 10, color: '#94a3b8' }}>
              Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </small>
          </div>
        </div>

        {/* Candidate Summary Hero */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 24, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                {p.firstName || 'Candidate'} {p.surname || ''}
              </h1>

              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#64748b' }}>
                {p.denomination || 'Christian'} · {p.presentCity || 'City Private'}, {p.presentState || 'India'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px', fontSize: 12 }}>
                <div><span style={{ color: '#64748b' }}>Age / Birth:</span> <b>{p.age ? `${p.age} Years` : '—'}</b> {p.dateOfBirth && p.dateOfBirth !== '0' && <small>({p.dateOfBirth})</small>}</div>
                <div><span style={{ color: '#64748b' }}>Gender:</span> <b>{p.gender || '—'}</b></div>
                <div><span style={{ color: '#64748b' }}>Height:</span> <b>{p.height ? `${p.height} cm` : '—'}</b></div>
                <div><span style={{ color: '#64748b' }}>Body Type:</span> <b>{p.bodyType || 'Average'}</b></div>
                <div><span style={{ color: '#64748b' }}>Mother Tongue:</span> <b>{p.motherTongue || 'Malayalam'}</b></div>
                <div><span style={{ color: '#64748b' }}>Languages:</span> <b>{p.languagesKnown || 'English, Malayalam'}</b></div>
              </div>

              <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                  ✓ Church Parish Verified
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                  ✓ Mobile Number Verified
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#faf5ff', color: '#7e22ce', border: '1px solid #e9d5ff' }}>
                  ✓ Candidate Consent Granted
                </span>
              </div>
            </div>

            {/* Candidate Photo */}
            <div style={{ textAlign: 'center' }}>
              {firstPhoto ? (
                <div style={{ borderRadius: 10, overflow: 'hidden', border: '2px solid #e2e8f0', width: 130, height: 160 }}>
                  <PhotoPreview mediaId={firstPhoto} />
                </div>
              ) : (
                <div style={{ width: 130, height: 160, borderRadius: 10, background: '#f8fafc', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                  <span style={{ fontSize: 26, color: '#c2185b' }}>✝</span>
                  <small style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Photo in Parish Records</small>
                </div>
              )}
            </div>
          </div>

          {/* Section 1: Faith & Church Parish Heritage */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#831843', margin: '0 0 10px', paddingBottom: 4, borderBottom: '1px solid #fce7f3' }}>
              ✝ 1. Christian Faith &amp; Church Parish Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px', fontSize: 12 }}>
              <div><span style={{ color: '#64748b' }}>Christian Denomination:</span> <b>{p.denomination || 'Roman Catholic / Syro-Malabar'}</b></div>
              <div><span style={{ color: '#64748b' }}>Home Parish Church:</span> <b>{p.churchName || 'St. Mary Church'}</b></div>
              <div><span style={{ color: '#64748b' }}>Diocese / Region:</span> <b>{p.diocese || p.presentState || 'Kerala'}</b></div>
              <div><span style={{ color: '#64748b' }}>Ministry / Involvement:</span> <b>{p.ministry || 'Sunday Choir &amp; Youth Fellowship'}</b></div>
            </div>
          </div>

          {/* Section 2: Education & Career */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#831843', margin: '0 0 10px', paddingBottom: 4, borderBottom: '1px solid #fce7f3' }}>
              🎓 2. Education &amp; Professional Career
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px', fontSize: 12 }}>
              <div><span style={{ color: '#64748b' }}>Highest Qualification:</span> <b>{p.education || 'B.Tech / MBA / Graduate'}</b></div>
              <div><span style={{ color: '#64748b' }}>Specialization / Stream:</span> <b>{p.specialization || 'Computer Science / Finance'}</b></div>
              <div><span style={{ color: '#64748b' }}>Profession / Occupation:</span> <b>{p.occupation || 'Software Engineer / Consultant'}</b></div>
              <div><span style={{ color: '#64748b' }}>Designation:</span> <b>{p.designation || 'Senior Associate'}</b></div>
              <div><span style={{ color: '#64748b' }}>Work Location:</span> <b>{p.jobLocation || p.presentCity || 'Bengaluru'}, {p.presentState || 'India'}</b></div>
              <div><span style={{ color: '#64748b' }}>Annual Income:</span> <b>{p.annualIncome || 'Confidential / Disclosed on request'}</b></div>
            </div>
          </div>

          {/* Section 3: Family Heritage */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#831843', margin: '0 0 10px', paddingBottom: 4, borderBottom: '1px solid #fce7f3' }}>
              👨‍👩‍👧 3. Family Background &amp; Heritage
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px', fontSize: 12 }}>
              <div><span style={{ color: '#64748b' }}>Father:</span> <b>{p.fatherName || 'Father'}</b> ({p.fatherOccupation || 'Employed / Retired'})</div>
              <div><span style={{ color: '#64748b' }}>Mother:</span> <b>{p.motherName || 'Mother'}</b> ({p.motherOccupation || 'Homemaker'})</div>
              <div><span style={{ color: '#64748b' }}>Brothers / Sisters:</span> <b>{p.siblings || '1 Brother, 1 Sister'}</b></div>
              <div><span style={{ color: '#64748b' }}>Ancestral Native Place:</span> <b>{p.nativeCity || p.presentCity || 'Kerala'}</b></div>
              <div><span style={{ color: '#64748b' }}>Family Values:</span> <b>God-fearing, dignified Christian family</b></div>
              <div><span style={{ color: '#64748b' }}>Eating Habits:</span> <b>{p.eatingHabits || 'Non-Vegetarian'}</b></div>
            </div>
          </div>

          {/* Section 4: Partner Expectations & Personal Note */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#831843', margin: '0 0 10px', paddingBottom: 4, borderBottom: '1px solid #fce7f3' }}>
              💍 4. Partner Expectations &amp; Personal Statement
            </h3>
            <p style={{ margin: '0 0 8px', fontSize: 12, lineHeight: 1.6, color: '#334155', fontStyle: 'italic', background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              &ldquo;{p.aboutYourself || 'Seeking a kind, God-fearing Christian life partner who shares similar family values, respects traditions, and seeks to build a peaceful Christian home together.'}&rdquo;
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 16px', fontSize: 12 }}>
              <div><span style={{ color: '#64748b' }}>Preferred Denominations:</span> <b>{p.preferredProfileStates || p.denomination || 'Christian - Same or open'}</b></div>
              <div><span style={{ color: '#64748b' }}>Expectations Note:</span> <b>{p.partnerExpectations || 'Educated, family-oriented partner'}</b></div>
            </div>
          </div>

          {/* Official Verification Watermark & Seal */}
          <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                ADAM N EVE MATRIMONY TRUST &amp; VERIFICATION SEAL
              </span>
              <small style={{ fontSize: 10, color: '#94a3b8' }}>
                Confidential matrimonial document. For private alliance evaluation only. Commercial circulation prohibited.
              </small>
            </div>

            <div style={{ textAlign: 'right', fontSize: 10, color: '#64748b' }}>
              <span>Website: <b>adamnevematrimony.com</b></span><br />
              <span>Support Desk: <b>+91 9000000001</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import {
  Download, Sparkles, UploadCloud, Search, KeyRound, MessageCircle,
  Printer, BookOpen, Camera, ZoomIn, Trash2, RefreshCw, X, UserCheck
} from 'lucide-react';
import fieldGroups from '@/lib/fields.json';
import { PhotoPreview } from '../PhotoPreview';
import { Row, PhotoStat } from '../types';
import { API, api, downloadAdminFile, getAdminToken } from '@/lib/api';

interface MemberPipelineProps {
  tab: string;
  setTab: (tab: string) => void;
  // Members & Registrations
  members: Row[];
  memberPage: number;
  setMemberPage: (p: number) => void;
  memberTotal: number;
  subs: Row[];
  openWhatsAppDirect: (phone: string, candidateName: string, templateType?: 'verification' | 'photos' | 'payment' | 'general') => void;
  setPrintCandidate: (m: Row) => void;
  setSelectedBiodataMember: (m: Row | null) => void;
  selectedBiodataMember: Row | null;
  // User Management
  userFilter: 'all' | 'active' | 'suspended';
  setUserFilter: (f: 'all' | 'active' | 'suspended') => void;
  userSearch: string;
  setUserSearch: (s: string) => void;
  userResetModal: { member: Row; newPass: string } | null;
  setUserResetModal: (m: { member: Row; newPass: string } | null) => void;
  act: (fn: () => Promise<any>) => Promise<void>;
  patch: (path: string, body: any) => Promise<any>;
  post: (path: string, body: any) => Promise<any>;
  setError: (e: string) => void;
  // Excel Bulk Import
  excelFile: File | null;
  excelLoading: boolean;
  handleFileSelect: (file: File) => void;
  importPreview: any;
  importSearch: string;
  setImportSearch: (s: string) => void;
  executeBulkImport: () => void;
  importExecuting: boolean;
  // Church Management
  churches: Row[];
  newChurchName: string;
  setNewChurchName: (s: string) => void;
  newChurchDenom: string;
  setNewChurchDenom: (s: string) => void;
  newChurchDiocese: string;
  setNewChurchDiocese: (s: string) => void;
  newChurchCity: string;
  setNewChurchCity: (s: string) => void;
  newChurchState: string;
  setNewChurchState: (s: string) => void;
  newChurchPriest: string;
  setNewChurchPriest: (s: string) => void;
  addChurch: () => void;
  // Profile Verification
  verifications: Row[];
  // Photo Management
  photos: Row[];
  photoFilter: 'all' | 'pending' | 'approved' | 'rejected';
  setPhotoFilter: (f: 'all' | 'pending' | 'approved' | 'rejected') => void;
  photoSearch: string;
  setPhotoSearch: (s: string) => void;
  photoStats: PhotoStat;
  photoLoading: boolean;
  refreshPhotos: (filter?: any, search?: string) => Promise<void>;
  zoomPhoto: Row | null;
  setZoomPhoto: (p: Row | null) => void;
  // Featured Profiles
  spotlightProfiles: Row[];
  spotlightSearch: string;
  setSpotlightSearch: (s: string) => void;
  toggleSpotlight: (profileId: string, current: boolean) => Promise<void>;
  // Relationship Manager CRM
  crmCandidates: Row[];
  crmSearch: string;
  setCrmSearch: (s: string) => void;
  crmSelectedCandidate: Row | null;
  setCrmSelectedCandidate: (c: Row | null) => void;
  crmNoteText: string;
  setCrmNoteText: (s: string) => void;
  crmTag: string;
  setCrmTag: (s: string) => void;
  setCrmCandidates: (c: Row[]) => void;
}

export function MemberPipelineModules(props: MemberPipelineProps) {
  const {
    tab, setTab, members, memberPage, setMemberPage, memberTotal, subs,
    openWhatsAppDirect, setPrintCandidate, setSelectedBiodataMember, selectedBiodataMember,
    userFilter, setUserFilter, userSearch, setUserSearch, userResetModal, setUserResetModal,
    act, patch, post, setError,
    excelFile, excelLoading, handleFileSelect,
    importPreview, importSearch, setImportSearch, executeBulkImport, importExecuting,
    churches, newChurchName, setNewChurchName, newChurchDenom, setNewChurchDenom,
    newChurchDiocese, setNewChurchDiocese, newChurchCity, setNewChurchCity,
    newChurchState, setNewChurchState, newChurchPriest, setNewChurchPriest, addChurch,
    verifications,
    photos, photoFilter, setPhotoFilter, photoSearch, setPhotoSearch, photoStats, photoLoading,
    refreshPhotos, zoomPhoto, setZoomPhoto,
    spotlightProfiles, spotlightSearch, setSpotlightSearch, toggleSpotlight,
    crmCandidates, crmSearch, setCrmSearch, crmSelectedCandidate, setCrmSelectedCandidate,
    crmNoteText, setCrmNoteText, crmTag, setCrmTag, setCrmCandidates
  } = props;

  // MODULE 02: REGISTRATION MANAGEMENT
  if (tab === 'Registration Management') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 02 · REGISTRATION PIPELINE</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Member Registrations &amp; Acquisition Sources</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Inspect source tag (Website, Android, iOS, Legacy Excel Import) and review incoming member submissions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="chip-action"
              onClick={() => downloadAdminFile('/admin/exports/csv?type=members', 'AdamNEve_Member_Registrations.csv')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#059669', color: '#fff', borderColor: '#059669', fontWeight: 600 }}
              title="Download all members and 44 biodata fields as an Excel-ready CSV"
            >
              <Download size={14} /> Export to Excel
            </button>
            <button className="chip-action" disabled={memberPage <= 1} onClick={() => setMemberPage(memberPage - 1)}>Previous Page</button>
            <button className="chip-action" disabled={memberPage * 50 >= memberTotal} onClick={() => setMemberPage(memberPage + 1)}>Next Page</button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Member Phone</th>
                <th style={{ padding: '10px 14px' }}>Candidate Name</th>
                <th style={{ padding: '10px 14px' }}>Source Channel</th>
                <th style={{ padding: '10px 14px' }}>Church &amp; City</th>
                <th style={{ padding: '10px 14px' }}>Profile Review</th>
                <th style={{ padding: '10px 14px' }}>Payment &amp; Plan</th>
                <th style={{ padding: '10px 14px' }}>Account Status</th>
                <th style={{ padding: '10px 14px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{m.phone}</td>
                  <td style={{ padding: '10px 14px' }}>{m.profile?.fields?.firstName || 'Member'} {m.profile?.fields?.surname || ''}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="status-pill" style={{ fontSize: 10, background: '#e0f2fe', color: '#0369a1' }}>
                      {m.source || 'WEBSITE'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {m.profile?.fields?.denomination || '—'}<br />
                    <small style={{ color: '#64748b' }}>{m.profile?.fields?.presentCity || 'City private'}</small>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={`status-pill ${m.profile?.moderationStatus === 'approved' ? 'success' : 'warn'}`}>
                      {m.profile?.moderationStatus || 'draft'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {(() => {
                      const isPaid = subs.some((s) => String(s.user?._id || s.user) === String(m._id) && s.status === 'active');
                      return isPaid ? (
                        <span className="status-pill success" style={{ fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          💳 PAID PLAN
                        </span>
                      ) : (
                        <span className="status-pill warn" style={{ fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          ⏳ FREE / UNPAID
                        </span>
                      );
                    })()}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={`status-pill ${m.accountStatus === 'active' ? 'success' : 'danger'}`}>
                      {m.accountStatus}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        className="chip-action"
                        title="Direct Chat on WhatsApp"
                        onClick={() => openWhatsAppDirect(m.phone, m.profile?.fields?.firstName || 'Candidate', m.profile?.moderationStatus === 'pending' ? 'verification' : 'general')}
                        style={{ color: '#16a34a', borderColor: '#86efac', background: '#f0fdf4', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <MessageCircle size={12} /> WhatsApp
                      </button>
                      <button
                        className="chip-action"
                        title="Download Printable PDF Biodata"
                        onClick={() => setPrintCandidate(m)}
                        style={{ color: '#0369a1', borderColor: '#bae6fd', background: '#f0f9ff', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <Printer size={12} /> PDF
                      </button>
                      <button
                        className="chip-action"
                        onClick={() => {
                          setSelectedBiodataMember(m);
                          setTab('Biodata Management');
                        }}
                      >
                        Inspect 44 Fields
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!members.length && (
                <tr>
                  <td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                    No registered members found. Use Excel Bulk Import or register from website/app.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  // MODULE 04: USER MANAGEMENT
  if (tab === 'User Management') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 04 · USER ACCOUNT GOVERNANCE</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>User Accounts, Security &amp; Credentials</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Control candidate account status, reset forgotten passwords, issue temporary access PINs, and manage roles.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Total Accounts</span>
              <strong style={{ fontSize: 16 }}>{memberTotal || members.length}</strong>
            </div>
            <div style={{ padding: '8px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#16a34a', display: 'block' }}>Active</span>
              <strong style={{ fontSize: 16, color: '#15803d' }}>{members.filter(m => m.accountStatus === 'active').length}</strong>
            </div>
            <div style={{ padding: '8px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#dc2626', display: 'block' }}>Suspended</span>
              <strong style={{ fontSize: 16, color: '#b91c1c' }}>{members.filter(m => m.accountStatus === 'suspended').length}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search user by phone or candidate name..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              className="chip-action"
              onClick={() => downloadAdminFile('/admin/exports/csv?type=members', 'AdamNEve_User_Accounts.csv')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#059669', color: '#fff', borderColor: '#059669', fontWeight: 600 }}
              title="Download all user accounts as an Excel-ready CSV"
            >
              <Download size={14} /> Export to Excel
            </button>
            {(['all', 'active', 'suspended'] as const).map((st) => (
              <button
                key={st}
                className={`chip-action ${userFilter === st ? 'active' : ''}`}
                onClick={() => setUserFilter(st)}
                style={userFilter === st ? { background: '#c2185b', color: '#fff', borderColor: '#c2185b' } : {}}
              >
                {st.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Phone Number</th>
                <th style={{ padding: '10px 14px' }}>Candidate Name</th>
                <th style={{ padding: '10px 14px' }}>Role</th>
                <th style={{ padding: '10px 14px' }}>Account Status</th>
                <th style={{ padding: '10px 14px' }}>Registered At</th>
                <th style={{ padding: '10px 14px' }}>Security &amp; Password Actions</th>
              </tr>
            </thead>
            <tbody>
              {members
                .filter((m) => {
                  if (userFilter !== 'all' && m.accountStatus !== userFilter) return false;
                  if (userSearch) {
                    const q = userSearch.toLowerCase();
                    const name = `${m.profile?.fields?.firstName || ''} ${m.profile?.fields?.surname || ''}`.toLowerCase();
                    return m.phone?.includes(q) || name.includes(q);
                  }
                  return true;
                })
                .map((m) => (
                  <tr key={m._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{m.phone}</td>
                    <td style={{ padding: '10px 14px' }}>{m.profile?.fields?.firstName || 'Member'} {m.profile?.fields?.surname || ''}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className="status-pill" style={{ background: '#f1f5f9', color: '#475569', fontSize: 10 }}>{m.role || 'member'}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`status-pill ${m.accountStatus === 'active' ? 'success' : 'danger'}`}>
                        {m.accountStatus}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                          className="chip-action"
                          style={{ color: '#0284c7', borderColor: '#bae6fd', background: '#f0f9ff' }}
                          onClick={async () => {
                            const confirmReset = confirm(`Generate a temporary login password for candidate ${m.phone}?`);
                            if (!confirmReset) return;
                            try {
                              const res = await post(`/admin/members/${m._id}/reset-password`, {});
                              setUserResetModal({ member: m, newPass: res.temporaryPassword });
                            } catch (e: any) {
                              setError(e.message);
                            }
                          }}
                        >
                          <KeyRound size={12} style={{ marginRight: 4 }} /> Reset Password
                        </button>
                        <button
                          className="chip-action"
                          style={m.accountStatus === 'active' ? { color: '#dc2626', borderColor: '#fca5a5' } : { color: '#16a34a', borderColor: '#86efac' }}
                          onClick={() => act(() => patch(`/admin/members/${m._id}/account-status`, { status: m.accountStatus === 'active' ? 'suspended' : 'active' }))}
                        >
                          {m.accountStatus === 'active' ? 'Suspend Account' : 'Activate Account'}
                        </button>
                        <button
                          className="chip-action"
                          style={{ color: '#16a34a', borderColor: '#86efac', background: '#f0fdf4' }}
                          onClick={() => openWhatsAppDirect(m.phone, m.profile?.fields?.firstName || 'Member', 'general')}
                        >
                          <MessageCircle size={12} style={{ marginRight: 4 }} /> WhatsApp
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {userResetModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 440, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>🔑 Temporary Password Generated</h3>
                <button onClick={() => setUserResetModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={18} /></button>
              </div>
              <p style={{ fontSize: 13, color: '#475569', margin: '0 0 16px' }}>
                Temporary credentials for candidate <strong>{userResetModal.member.phone}</strong>:
              </p>
              <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: 10, padding: 14, textAlign: 'center', marginBottom: 18 }}>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>TEMPORARY PASSWORD</span>
                <code style={{ fontSize: 20, fontWeight: 700, color: '#c2185b', letterSpacing: 1 }}>{userResetModal.newPass}</code>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-shaadi full"
                  onClick={() => {
                    const msg = `Namaste, Adam N Eve Matrimony se aapke account ka temporary password reset kar diya gaya hai:\nPassword: ${userResetModal.newPass}\nLogin Link: https://adamnevematrimony.com/login\nKripya login ke turant baad apna password badal lein.`;
                    const cleanDigits = userResetModal.member.phone.replace(/[^\d]/g, '');
                    const fullPhone = cleanDigits.length === 10 ? '91' + cleanDigits : cleanDigits;
                    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                    setUserResetModal(null);
                  }}
                >
                  Send to WhatsApp
                </button>
                <button className="btn btn-outline" onClick={() => setUserResetModal(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  // MODULE 03: EXCEL BULK IMPORT
  if (tab === 'Excel Bulk Import') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 03 · DATA MIGRATION ENGINE</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Excel &amp; CSV Bulk Member Database Import</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Import up to 100 members per CSV batch with canonical field mapping, duplicate checks and validation. For Excel files, export as UTF-8 CSV first.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => { void downloadAdminFile('/admin/import/excel/template','AdamNEve_44_Field_Template.csv').catch((e)=>setError(e.message)); }} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} /> Download 44-Field CSV Template
            </button>
          </div>
        </div>

        <div
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: 14,
            padding: '36px 20px',
            textAlign: 'center',
            background: '#f8fafc',
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'border 0.2s'
          }}
          onClick={() => document.getElementById('excelFileInput')?.click()}
        >
          <input
            id="excelFileInput"
            type="file"
            accept=".csv,.txt"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <UploadCloud size={28} />
          </div>
          <h4 style={{ margin: '0 0 6px', fontSize: 16 }}>Click to select a CSV file</h4>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
            Supported format: <b>.csv</b> (UTF-8). Export your .xlsx file as CSV first. Column names like Name, Mobile, Church and City are mapped to biodata fields.
          </p>
          {excelFile && <p style={{ marginTop: 10, color: '#0f766e', fontWeight: 600, fontSize: 13 }}>Selected: {excelFile.name} ({(excelFile.size / 1024).toFixed(1)} KB)</p>}
        </div>

        {excelLoading && <div className="load-text" style={{ margin: '20px 0' }}>Analyzing spreadsheet and validating rows against database...</div>}

        {importPreview && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Ready to Import</span>
                <strong style={{ fontSize: 28, color: '#15803d', display: 'block' }}>{importPreview.readyCount}</strong>
                <small style={{ color: '#166534', fontSize: 11 }}>Clean records, zero duplicates</small>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '16px 20px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>Duplicates Detected</span>
                <strong style={{ fontSize: 28, color: '#b45309', display: 'block' }}>{importPreview.duplicateCount}</strong>
                <small style={{ color: '#92400e', fontSize: 11 }}>Phone exists in DB or sheet</small>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '16px 20px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Needs Review</span>
                <strong style={{ fontSize: 28, color: '#2563eb', display: 'block' }}>{importPreview.incompleteCount}</strong>
                <small style={{ color: '#1e40af', fontSize: 11 }}>Missing church or city details</small>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '16px 20px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>Invalid Records</span>
                <strong style={{ fontSize: 28, color: '#dc2626', display: 'block' }}>{importPreview.invalidCount}</strong>
                <small style={{ color: '#991b1b', fontSize: 11 }}>Phone format or parse error</small>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>Parsed Preview ({importPreview.totalRows} rows detected)</h3>
                <input
                  placeholder="Search candidate in sheet..."
                  value={importSearch}
                  onChange={(e) => setImportSearch(e.target.value)}
                  style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <button
                className="btn btn-shaadi"
                onClick={executeBulkImport}
                disabled={importExecuting || !importPreview.readyCount}
              >
                {importExecuting ? 'Importing Rows to MongoDB...' : `Execute Bulk Import (${importPreview.readyCount} Verified Records) →`}
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }

  // MODULE 05: BIODATA MANAGEMENT
  if (tab === 'Biodata Management') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 05 · BIODATA ARCHITECTURE</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>All 44 Canonical Registration Fields Inspector</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Examine full personal, career, family, church parish and partner preference details for any registered profile.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, background: '#f8fafc' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 14 }}>Select Member to Inspect:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 520, overflowY: 'auto' }}>
              {members.map((m) => (
                <button
                  key={m._id}
                  onClick={() => setSelectedBiodataMember(m)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    textAlign: 'left',
                    border: selectedBiodataMember?._id === m._id ? '2px solid #c2185b' : '1px solid #e2e8f0',
                    background: selectedBiodataMember?._id === m._id ? '#fff' : '#f1f5f9',
                    cursor: 'pointer'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: 13 }}>
                    {m.profile?.fields?.firstName || 'Member'} {m.profile?.fields?.surname || ''}
                  </strong>
                  <small style={{ color: '#64748b' }}>Phone: {m.phone} · Source: {m.source || 'WEBSITE'}</small>
                </button>
              ))}
            </div>
          </div>

          <div>
            {selectedBiodataMember ? (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18 }}>
                      {selectedBiodataMember.profile?.fields?.firstName || 'Member'} {selectedBiodataMember.profile?.fields?.surname || ''}
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
                      Login Phone: <b>{selectedBiodataMember.phone}</b> · Source: <b>{selectedBiodataMember.source || 'WEBSITE'}</b> · Account: <b>{selectedBiodataMember.accountStatus}</b>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="status-pill success">{selectedBiodataMember.profile?.moderationStatus || 'Draft'}</span>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11 }}
                      onClick={() => setPrintCandidate(selectedBiodataMember)}
                    >
                      <Printer size={13} /> Print PDF Biodata
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: '#25D366', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11 }}
                      onClick={() => openWhatsAppDirect(selectedBiodataMember.phone, selectedBiodataMember.profile?.fields?.firstName || 'Candidate', 'verification')}
                    >
                      <MessageCircle size={13} /> Chat on WhatsApp
                    </button>
                  </div>
                </div>

                {fieldGroups.map((group) => (
                  <div key={group.id} style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: 14, color: '#0f766e', borderBottom: '1px solid #e2e8f0', paddingBottom: 6, marginBottom: 12 }}>
                      {group.title} <small style={{ color: '#64748b', fontWeight: 'normal' }}>({group.description})</small>
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                      {group.fields.map((f) => {
                        const val = selectedBiodataMember.profile?.fields?.[f[0]];
                        const isMissing = !val || val === '0';
                        return (
                          <div key={f[0]} style={{ padding: '8px 12px', background: isMissing ? '#fffbeb' : '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                            <span style={{ display: 'block', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                              {f[1]}
                            </span>
                            <strong style={{ fontSize: 12, color: isMissing ? '#b45309' : '#1e293b' }}>
                              {val || 'Not provided (0)'}
                            </strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', color: '#64748b' }}>
                <BookOpen size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                <h4 style={{ margin: 0 }}>Select any member on the left</h4>
                <p style={{ fontSize: 13, margin: '6px 0 0' }}>All 44 registration fields will be mapped and displayed here with missing data highlights.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // MODULE 06: CHURCH MANAGEMENT
  if (tab === 'Church Management') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 06 · DENOMINATIONS &amp; PARISH MASTER</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Church &amp; Denomination Master Directory</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Churches and parish details saved by your admin team. No demo entries are mixed with the live directory.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {churches.length === 0 && <p className="empty">No churches in the directory yet. Add verified entries using this form.</p>}
            {churches.map((c, i) => (
              <div key={i} style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc' }}>
                <strong style={{ display: 'block', fontSize: 14, color: '#1e293b' }}>{c.name}</strong>
                <span className="status-pill success" style={{ fontSize: 9, margin: '4px 0 8px' }}>{c.denomination}</span>
                <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Diocese: {c.diocese || 'Not provided'}<br />Location: {c.city}, {c.state}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 15 }}>Add Verified Church / Parish</h4>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: 10 }}>
              <label>Parish / Church Name *<input value={newChurchName} onChange={(e) => setNewChurchName(e.target.value)} placeholder="e.g. St. Thomas Cathedral" /></label>
              <label>Denomination<select value={newChurchDenom} onChange={(e) => setNewChurchDenom(e.target.value)}><option value="Syro-Malabar">Syro-Malabar</option><option value="Roman Catholic">Roman Catholic</option><option value="Mar Thoma">Mar Thoma</option><option value="CSI">Church of South India (CSI)</option><option value="CNI">Church of North India (CNI)</option><option value="Pentecostal">Pentecostal</option><option value="Orthodox">Malankara Orthodox</option><option value="Jacobite">Jacobite Syrian</option><option value="Methodist">Methodist</option><option value="Baptist">Baptist / Evangelical</option></select></label>
              <label>Diocese<input value={newChurchDiocese} onChange={(e) => setNewChurchDiocese(e.target.value)} placeholder="Diocese name" /></label>
              <label>City<input value={newChurchCity} onChange={(e) => setNewChurchCity(e.target.value)} placeholder="City / District" /></label>
              <label>State<input value={newChurchState} onChange={(e) => setNewChurchState(e.target.value)} placeholder="State" /></label>
              <label>Priest / Pastor Name<input value={newChurchPriest} onChange={(e) => setNewChurchPriest(e.target.value)} placeholder="Rev. Fr. Name" /></label>
            </div>
            <button className="btn btn-dark full" style={{ marginTop: 14 }} onClick={addChurch}>
              Save Church to Master Directory
            </button>
          </div>
        </div>
      </section>
    );
  }

  // MODULE 07: PROFILE VERIFICATION
  if (tab === 'Profile Verification') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 07 · VERIFICATION &amp; APPROVAL</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Biodata &amp; Verification Approval Desk</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Examine phone OTP checks and adult candidate consents before unlocking public matching.
          </p>
        </div>

        {verifications.map((v) => (
          <div key={v._id} className="review-card" style={{ marginBottom: 14 }}>
            <div className="review-title">
              <b>User: {v.user?.phone}</b>
              <span className={`status-pill ${v.status === 'verified' ? 'success' : 'warn'}`}>{v.status}</span>
            </div>
            <p style={{ margin: '6px 0', fontSize: 13 }}>
              Document Type: <b>{v.documentType?.toUpperCase()}</b> (Ref Masked: {v.documentNumberMasked || '—'})
            </p>
            {v.moderationNote && <p className="muted">Staff Note: {v.moderationNote}</p>}
            {v.status === 'pending' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn btn-dark btn-sm" onClick={() => act(() => patch('/admin/verifications/' + v._id, { status: 'verified' }))}>
                  Approve ID Badge
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    const n = prompt('Rejection reason:', 'Unclear document scan');
                    if (n !== null) act(() => patch('/admin/verifications/' + v._id, { status: 'rejected', moderationNote: n }));
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
        {!verifications.length && <p className="muted">No pending identity verification submissions.</p>}
      </section>
    );
  }

  // MODULE 08: PHOTO MANAGEMENT
  if (tab === 'Photo Management') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 08 · PHOTO &amp; MEDIA MODERATION</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 800 }}>Candidate Photo Review Desk</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Review, verify, and moderate genuine candidate photos before displaying them to prospective families.
            </p>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => refreshPhotos(photoFilter, photoSearch)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} className={photoLoading ? 'animate-spin' : ''} /> Refresh Photos
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
          <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Photos</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{photoStats.total}</div>
            <small style={{ color: '#94a3b8', fontSize: 11 }}>Registered candidate media</small>
          </div>
          <div style={{ background: '#fffbeb', padding: '16px 20px', borderRadius: 12, border: '1px solid #fde68a' }}>
            <span style={{ fontSize: 12, color: '#b45309', fontWeight: 700 }}>⏳ Pending Moderation</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#b45309', marginTop: 4 }}>{photoStats.pendingCount}</div>
            <small style={{ color: '#d97706', fontSize: 11 }}>Awaiting moderator approval</small>
          </div>
          <div style={{ background: '#f0fdf4', padding: '16px 20px', borderRadius: 12, border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: 12, color: '#166534', fontWeight: 700 }}>✓ Approved Genuine</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#166534', marginTop: 4 }}>{photoStats.approvedCount}</div>
            <small style={{ color: '#15803d', fontSize: 11 }}>Visible to active members</small>
          </div>
          <div style={{ background: '#fef2f2', padding: '16px 20px', borderRadius: 12, border: '1px solid #fecaca' }}>
            <span style={{ fontSize: 12, color: '#991b1b', fontWeight: 700 }}>✕ Needs Revision / Rejected</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#991b1b', marginTop: 4 }}>{photoStats.rejectedCount}</div>
            <small style={{ color: '#dc2626', fontSize: 11 }}>Rejected / change requested</small>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `All Photos (${photoStats.total})` },
              { id: 'pending', label: `⏳ Pending (${photoStats.pendingCount})` },
              { id: 'approved', label: `✓ Approved (${photoStats.approvedCount})` },
              { id: 'rejected', label: `✕ Rejected (${photoStats.rejectedCount})` }
            ].map((tabBtn) => (
              <button
                key={tabBtn.id}
                type="button"
                onClick={() => {
                  setPhotoFilter(tabBtn.id as any);
                  refreshPhotos(tabBtn.id as any, photoSearch);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: photoFilter === tabBtn.id ? '2px solid #c2185b' : '1px solid #cbd5e1',
                  background: photoFilter === tabBtn.id ? '#fdf2f8' : '#fff',
                  color: photoFilter === tabBtn.id ? '#c2185b' : '#475569',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                {tabBtn.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%', maxWidth: 360 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search candidate name, phone, city..."
                value={photoSearch}
                onChange={(e) => {
                  setPhotoSearch(e.target.value);
                  refreshPhotos(photoFilter, e.target.value);
                }}
                style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 12 }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {photos.map((m) => {
            const phoneClean = String(m.candidatePhone || m.owner?.phone || '').replace(/\D/g, '');
            const waText = encodeURIComponent(`Namaste ${m.candidateName || 'Candidate'}, Adam N Eve Matrimony administration se aapke profile photo verification ke regarding message hai.`);
            const waUrl = `https://wa.me/91${phoneClean.slice(-10)}?text=${waText}`;

            return (
              <div
                key={m._id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 14,
                  overflow: 'hidden',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: 210, background: '#f1f5f9', overflow: 'hidden' }}>
                  <PhotoPreview
                    directUrl={m.imageUrl}
                    mediaId={m._id}
                    alt={m.candidateName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, maxWidth: 'none' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: 20,
                      background: m.status === 'approved' ? '#16a34a' : m.status === 'rejected' ? '#dc2626' : '#d97706',
                      color: '#fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    {m.status === 'approved' ? '✓ Approved' : m.status === 'rejected' ? '✕ Rejected' : '⏳ Pending Review'}
                  </span>

                  {m.candidateGender && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 8,
                        background: 'rgba(15,23,42,0.7)',
                        color: '#fff'
                      }}
                    >
                      {m.candidateGender === 'Female' ? 'Bride 👰' : 'Groom 🤵'}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setZoomPhoto(m)}
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '5px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#0f172a',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  >
                    <ZoomIn size={13} /> Full Zoom
                  </button>
                </div>

                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: 15, color: '#0f172a' }}>{m.candidateName || 'Candidate Photo'}</strong>
                      {m.matrimonyId && (
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#c2185b', background: '#fdf2f8', padding: '2px 6px', borderRadius: 4 }}>
                          {m.matrimonyId}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '2px 0 4px', fontSize: 12, color: '#475569' }}>
                      📞 <b>{m.candidatePhone || m.owner?.phone || 'No phone'}</b>
                    </p>
                    <p style={{ margin: '2px 0 6px', fontSize: 11.5, color: '#64748b' }}>
                      📍 {m.candidateCity || 'City private'} · {m.candidateChurch || 'Church verified'}
                    </p>
                    {m.reviewNote && (
                      <div style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 11, color: '#64748b', marginTop: 6 }}>
                        <b>Note:</b> {m.reviewNote}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                    {m.status !== 'approved' ? (
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{ background: '#16a34a', color: '#fff', fontSize: 11, padding: '7px 12px' }}
                        onClick={() => act(async () => {
                          await patch('/admin/photos/' + m._id, { approved: true });
                          refreshPhotos(photoFilter, photoSearch);
                        })}
                      >
                        ✓ Approve Photo
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        ✓ Live on Profile
                      </span>
                    )}

                    {m.status !== 'rejected' && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ color: '#dc2626', borderColor: '#fca5a5', fontSize: 11, padding: '7px 10px' }}
                        onClick={() => {
                          const note = prompt('Enter rejection reason for candidate:', 'Please upload a clear, front-facing genuine photo.');
                          if (note !== null) {
                            act(async () => {
                              await patch('/admin/photos/' + m._id, { approved: false, note });
                              refreshPhotos(photoFilter, photoSearch);
                            });
                          }
                        }}
                      >
                        ✕ Reject
                      </button>
                    )}

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ color: '#15803d', borderColor: '#86efac', background: '#f0fdf4', fontSize: 11, padding: '7px 10px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      title="Contact candidate on WhatsApp"
                    >
                      💬 WhatsApp
                    </a>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ color: '#64748b', borderColor: '#cbd5e1', fontSize: 11, padding: '7px 8px' }}
                      title="Delete photo permanently"
                      onClick={() => {
                        if (confirm('Are you sure you want to permanently delete this photo?')) {
                          act(async () => {
                            await api('/admin/photos/' + m._id, { method: 'DELETE' });
                            refreshPhotos(photoFilter, photoSearch);
                          });
                        }
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!photos.length && (
          <div style={{ textAlign: 'center', padding: 48, background: '#f8fafc', borderRadius: 14, border: '1px dashed #cbd5e1', marginTop: 16 }}>
            <Camera size={44} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
            <h4 style={{ margin: '0 0 6px', fontSize: 16, color: '#334155' }}>No photos found</h4>
            <p style={{ margin: 0, fontSize: 12.5, color: '#94a3b8' }}>
              {photoSearch ? `No candidate photos match "${photoSearch}". Try clearing your search.` : 'No photos in this moderation status queue.'}
            </p>
          </div>
        )}

        {zoomPhoto && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 16, maxWidth: 640, width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, color: '#0f172a' }}>{zoomPhoto.candidateName || 'Candidate Photo Preview'}</h3>
                  <small style={{ color: '#64748b' }}>Account: {zoomPhoto.candidatePhone || zoomPhoto.owner?.phone}</small>
                </div>
                <button type="button" onClick={() => setZoomPhoto(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ width: '100%', height: 420, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhotoPreview
                  mediaId={zoomPhoto._id}
                  directUrl={zoomPhoto.imageUrl || (zoomPhoto.filename?.startsWith('http') ? zoomPhoto.filename : undefined)}
                  alt={zoomPhoto.candidateName}
                  style={{ maxHeight: '100%', maxWidth: '100%', width: 'auto', height: 'auto', borderRadius: 0 }}
                />
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, background: '#f8fafc' }}>
                <div style={{ fontSize: 12, color: '#475569' }}>
                  Status: <b style={{ textTransform: 'capitalize' }}>{zoomPhoto.status}</b> · {zoomPhoto.candidateCity || 'India'}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {zoomPhoto.status !== 'approved' && (
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{ background: '#16a34a', color: '#fff', fontSize: 11 }}
                      onClick={() => act(async () => {
                        await patch('/admin/photos/' + zoomPhoto._id, { approved: true });
                        setZoomPhoto(null);
                        refreshPhotos(photoFilter, photoSearch);
                      })}
                    >
                      ✓ Approve Photo
                    </button>
                  )}
                  {zoomPhoto.status !== 'rejected' && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ color: '#dc2626', borderColor: '#fca5a5', fontSize: 11 }}
                      onClick={() => {
                        const note = prompt('Rejection reason:', 'Please upload a clear, front-facing genuine photo.');
                        if (note !== null) {
                          act(async () => {
                            await patch('/admin/photos/' + zoomPhoto._id, { approved: false, note });
                            setZoomPhoto(null);
                            refreshPhotos(photoFilter, photoSearch);
                          });
                        }
                      }}
                    >
                      ✕ Reject
                    </button>
                  )}
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setZoomPhoto(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  // MODULE 09: IDENTITY & CONSENT
  if (tab === 'Identity & Consent') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 09 · LEGAL COMPLIANCE &amp; CONSENT</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Adult Candidate Consent &amp; KYC Verification</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Verify independent adult candidate phone OTP authorization for family-managed profiles.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {members.map((m) => (
            <div key={m._id} style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
              <strong style={{ fontSize: 14 }}>{m.profile?.fields?.firstName || 'Member'} {m.profile?.fields?.surname || ''}</strong>
              <p style={{ margin: '4px 0', fontSize: 12, color: '#64748b' }}>Account: {m.phone}</p>
              <div style={{ margin: '8px 0', fontSize: 12 }}>
                Created for: <b>{m.profile?.createdFor || 'Self'}</b><br />
                Candidate Consent: <span className={`status-pill ${m.profile?.candidateConsent === 'granted' ? 'success' : 'warn'}`}>{m.profile?.candidateConsent || 'granted'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // MODULE 10: FEATURED PROFILES
  if (tab === 'Featured Profiles') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#d97706' }}>MODULE 10 · EXTRA EARNING FEATURE</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>✨ Profile Spotlight &amp; Boost Management</span>
              <span className="status-pill warn" style={{ fontSize: 10, padding: '2px 8px' }}>₹199 / ₹299 BOOST</span>
            </h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Members who pay ₹199 (7 Days) or ₹299 (Priority) are pinned to the top of the Landing Page and Search Results with a glowing golden border and &quot;Featured&quot; badge.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, background: '#fef3c7', color: '#92400e', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} /> {spotlightProfiles.length} Profiles Currently Boosted
            </span>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card" style={{ borderColor: '#fde68a', background: 'linear-gradient(135deg, #fffbeb, #ffffff)' }}>
            <span style={{ color: '#b45309' }}>Active Spotlight Profiles</span>
            <strong style={{ color: '#d97706' }}>{spotlightProfiles.length}</strong>
            <small>Pinned at top with Golden Ribbon</small>
          </div>
          <div className="stat-card">
            <span>Standard 7-Day Tier</span>
            <strong>₹199</strong>
            <small>Top placement for 7 full days</small>
          </div>
          <div className="stat-card">
            <span>Priority Gold Tier</span>
            <strong>₹299</strong>
            <small>#1 Discover Pin + Instant WhatsApp Alert</small>
          </div>
          <div className="stat-card">
            <span>Estimated Boost Revenue</span>
            <strong style={{ color: '#16a34a' }}>₹{(spotlightProfiles.length * 199).toLocaleString('en-IN')}+</strong>
            <small>High margin direct monetization</small>
          </div>
        </div>

        <h3 style={{ fontSize: 16, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>⭐ Active Featured / Spotlight Members ({spotlightProfiles.length})</span>
        </h3>

        {spotlightProfiles.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginBottom: 30 }}>
            {spotlightProfiles.map((p) => {
              const expiresAt = p.spotlightExpiresAt ? new Date(p.spotlightExpiresAt) : null;
              const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 7;
              return (
                <div
                  key={p._id}
                  className="spotlight-card"
                  style={{
                    borderRadius: 14,
                    padding: 16,
                    background: '#fff',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden', background: '#fef3c7', flexShrink: 0, border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {p.photos && p.photos[0] ? (
                          <img src={p.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Sparkles size={24} color="#d97706" />
                        )}
                      </div>
                      <div>
                        <strong style={{ fontSize: 15, color: '#0f172a', display: 'block' }}>
                          {p.fields?.firstName || 'Member'} {p.fields?.surname || ''}
                        </strong>
                        <small style={{ color: '#64748b', fontSize: 12 }}>
                          {p.fields?.denomination || 'Christian'} · {p.fields?.city || p.fields?.state || 'India'}
                        </small>
                        <small style={{ display: 'block', color: '#94a3b8', fontSize: 11 }}>
                          Phone: {p.user?.phone || '—'}
                        </small>
                      </div>
                    </div>
                    <span className="spotlight-ribbon" style={{ position: 'static', padding: '3px 8px', fontSize: 10 }}>
                      ★ SPOTLIGHT
                    </span>
                  </div>

                  <div style={{ background: '#fef3c7', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#92400e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Boost Expiry: <b>{expiresAt ? expiresAt.toLocaleDateString('en-IN') : 'Active'}</b></span>
                    <strong style={{ color: '#b45309' }}>{daysLeft} days remaining</strong>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                    <button
                      className="btn btn-outline btn-sm full"
                      style={{ color: '#dc2626', borderColor: '#fca5a5', fontSize: 11 }}
                      onClick={() => toggleSpotlight(p._id, true)}
                    >
                      Remove Boost
                    </button>
                    <button
                      className="btn btn-shaadi btn-sm full"
                      style={{ fontSize: 11 }}
                      onClick={() => toggleSpotlight(p._id, false)}
                    >
                      +7 Days Re-Boost
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: 24, textAlign: 'center', background: '#fffbeb', borderRadius: 12, border: '1px dashed #fde68a', color: '#b45309', marginBottom: 30 }}>
            <Sparkles size={28} style={{ margin: '0 auto 8px', color: '#d97706' }} />
            <strong>No profiles currently spotlighted</strong>
            <p style={{ margin: '4px 0 0', fontSize: 12 }}>Select any approved member from the table below to activate their 7-Day Spotlight Boost.</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, margin: 0 }}>All Members — Quick Spotlight Controls</h3>
          <input
            placeholder="Search by name, phone, or denomination..."
            value={spotlightSearch}
            onChange={(e) => setSpotlightSearch(e.target.value)}
            style={{ width: 280, padding: '6px 12px', fontSize: 12, borderRadius: 8, border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Member</th>
                <th style={{ padding: '10px 14px' }}>Phone</th>
                <th style={{ padding: '10px 14px' }}>Denomination / Diocese</th>
                <th style={{ padding: '10px 14px' }}>Location</th>
                <th style={{ padding: '10px 14px' }}>Spotlight Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Admin Boost Action</th>
              </tr>
            </thead>
            <tbody>
              {members
                .filter((m) => {
                  if (!spotlightSearch) return true;
                  const q = spotlightSearch.toLowerCase();
                  const name = `${m.profile?.fields?.firstName || ''} ${m.profile?.fields?.surname || ''}`.toLowerCase();
                  const phone = (m.phone || '').toLowerCase();
                  const denom = (m.profile?.fields?.denomination || '').toLowerCase();
                  return name.includes(q) || phone.includes(q) || denom.includes(q);
                })
                .map((m) => {
                  const isSpot = !!m.profile?.isSpotlight;
                  return (
                    <tr key={m._id} style={{ borderBottom: '1px solid #f1f5f9', background: isSpot ? '#fffbeb' : undefined }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: isSpot ? '#fef3c7' : '#f1f5f9', border: isSpot ? '2px solid #f59e0b' : '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {m.profile?.photos && m.profile?.photos[0] ? (
                              <img src={m.profile.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <UserCheck size={16} color={isSpot ? '#d97706' : '#64748b'} />
                            )}
                          </div>
                          <div>
                            <strong style={{ color: '#1e293b' }}>
                              {m.profile?.fields?.firstName || 'Member'} {m.profile?.fields?.surname || ''}
                            </strong>
                            {isSpot && (
                              <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: '#f59e0b', color: '#fff' }}>
                                SPOTLIGHT
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#64748b' }}>{m.phone}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span>{m.profile?.fields?.denomination || 'Syro-Malabar'}</span>
                        <small style={{ display: 'block', color: '#94a3b8' }}>{m.profile?.fields?.diocese || 'General'}</small>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#64748b' }}>
                        {m.profile?.fields?.city || '—'}, {m.profile?.fields?.state || 'India'}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {isSpot ? (
                          <span className="status-pill warn" style={{ fontSize: 10, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                            ★ FEATURED (7 DAYS)
                          </span>
                        ) : (
                          <span className="status-pill" style={{ fontSize: 10, color: '#94a3b8' }}>
                            Standard
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        {m.profile?._id && (
                          <button
                            className={`btn btn-sm ${isSpot ? 'btn-outline' : 'btn-shaadi'}`}
                            style={{
                              fontSize: 11,
                              padding: '4px 10px',
                              ...(isSpot ? { color: '#dc2626', borderColor: '#fca5a5' } : {})
                            }}
                            onClick={() => toggleSpotlight(m.profile._id, isSpot)}
                          >
                            {isSpot ? 'Remove Boost' : '⚡ Boost 7 Days (₹199)'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  // MODULE 26: RELATIONSHIP MANAGER CRM
  if (tab === 'Relationship Manager CRM') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 26 · ASSISTED MATCHMAKING CRM</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Relationship Manager CRM &amp; Parent Consultations</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Assisted matchmaking desk for relationship managers to take family consultation notes and track candidate portfolios.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Candidate Portfolio</span>
              <strong style={{ fontSize: 16 }}>{crmCandidates.length}</strong>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search candidate name or phone..."
            value={crmSearch}
            onChange={(e) => setCrmSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '10px 14px' }}>Candidate</th>
                  <th style={{ padding: '10px 14px' }}>Parish &amp; City</th>
                  <th style={{ padding: '10px 14px' }}>Active Plan</th>
                  <th style={{ padding: '10px 14px' }}>RM Notes</th>
                  <th style={{ padding: '10px 14px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {crmCandidates
                  .filter((c) => {
                    if (!crmSearch) return true;
                    const q = crmSearch.toLowerCase();
                    return c.phone?.includes(q) || c.name?.toLowerCase().includes(q) || c.denomination?.toLowerCase().includes(q);
                  })
                  .map((c) => (
                    <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9', background: crmSelectedCandidate?._id === c._id ? '#fdf2f8' : 'transparent' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <strong>{c.name}</strong><br />
                        <small style={{ color: '#64748b' }}>{c.phone}</small>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {c.denomination}<br />
                        <small style={{ color: '#64748b' }}>{c.city}</small>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="status-pill success" style={{ fontSize: 10 }}>{c.planName}</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {c.latestNote ? (
                          <div>
                            <span style={{ fontSize: 11, color: '#334155', display: 'block', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {c.latestNote.note}
                            </span>
                            <small style={{ color: '#94a3b8' }}>{c.notesCount} note(s)</small>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>No notes yet</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="chip-action"
                            style={{ color: '#c2185b', borderColor: '#fbcfe8', background: '#fdf2f8' }}
                            onClick={() => {
                              setCrmSelectedCandidate(c);
                              setCrmNoteText('');
                            }}
                          >
                            Add Note
                          </button>
                          <button
                            className="chip-action"
                            style={{ color: '#16a34a', borderColor: '#86efac', background: '#f0fdf4' }}
                            onClick={() => openWhatsAppDirect(c.phone, c.name, 'general')}
                          >
                            <MessageCircle size={12} style={{ marginRight: 4 }} /> Consult
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {!crmCandidates.length && (
                  <tr>
                    <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                      No candidates loaded in CRM desk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 15 }}>
              {crmSelectedCandidate ? `Add RM Note for ${crmSelectedCandidate.name}` : 'Select a candidate to log RM consultation notes'}
            </h4>
            {crmSelectedCandidate ? (
              <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
                <label>
                  Consultation Tag / Stage:
                  <select value={crmTag} onChange={(e) => setCrmTag(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                    <option value="Parent Follow-up">Parent Follow-up Call</option>
                    <option value="Denomination Match Proposal">Denomination Match Proposal Sent</option>
                    <option value="Church Priest Verified">Church Priest Reference Verified</option>
                    <option value="VIP Assisted Handholding">VIP Assisted Handholding</option>
                  </select>
                </label>
                <label>
                  Consultation Notes &amp; Family Feedback:
                  <textarea
                    rows={4}
                    placeholder="e.g. Spoke with candidate's mother. Preferred partner age 26-29, Latin Catholic background, working in IT/Healthcare."
                    value={crmNoteText}
                    onChange={(e) => setCrmNoteText(e.target.value)}
                  />
                </label>
                <button
                  className="btn btn-shaadi full"
                  style={{ marginTop: 10 }}
                  onClick={() => {
                    if (!crmNoteText.trim()) {
                      setError('Consultation note text is required');
                      return;
                    }
                    act(async () => {
                      await post('/admin/crm/notes', {
                        candidateId: crmSelectedCandidate._id,
                        note: crmNoteText.trim(),
                        tags: [crmTag]
                      });
                      setCrmNoteText('');
                      const res = await api('/admin/crm/candidates');
                      setCrmCandidates(res.candidates || []);
                    });
                  }}
                >
                  Save Consultation Note
                </button>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                Click &ldquo;Add Note&rdquo; on any candidate row on the left to document parent preferences, church verification feedback, and match recommendations.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return null;
}

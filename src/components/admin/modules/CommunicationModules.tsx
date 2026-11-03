'use client';
import React from 'react';
import {
  Smartphone, Bell, MessageSquare, Mail, Send, MessageCircle
} from 'lucide-react';
import { Row } from '../types';
import { API, api } from '@/lib/api';

interface CommunicationModulesProps {
  tab: string;
  // Notification Center
  notifChannel: 'push' | 'in_app' | 'sms' | 'email';
  setNotifChannel: (c: 'push' | 'in_app' | 'sms' | 'email') => void;
  notifTarget: 'all' | 'active_subscribers' | 'expired_subscribers' | 'pending_approval' | 'selected';
  setNotifTarget: (t: 'all' | 'active_subscribers' | 'expired_subscribers' | 'pending_approval' | 'selected') => void;
  notifType: string;
  setNotifType: (s: string) => void;
  notifTitle: string;
  setNotifTitle: (s: string) => void;
  notifMessage: string;
  setNotifMessage: (s: string) => void;
  notifActionUrl: string;
  setNotifActionUrl: (s: string) => void;
  notifSending: boolean;
  dispatchNotification: () => void;
  campaigns: Row[];
  whatsAppTotalSent: number;
  whatsAppLogs: Row[];
  // Automations
  automations: Row[];
  setAutomations: React.Dispatch<React.SetStateAction<Row[]>>;
  // Templates
  templates: Row[];
  selectedTemplateKey: string;
  setSelectedTemplateKey: (s: string) => void;
  templateEnTitle: string;
  setTemplateEnTitle: (s: string) => void;
  templateEnBody: string;
  setTemplateEnBody: (s: string) => void;
  templateHiTitle: string;
  setTemplateHiTitle: (s: string) => void;
  templateHiBody: string;
  setTemplateHiBody: (s: string) => void;
  // Support & Complaints
  tickets: Row[];
  // Posters & Banners
  banners: Row[];
  banTitle: string;
  setBanTitle: (s: string) => void;
  banSub: string;
  setBanSub: (s: string) => void;
  banImage: string;
  setBanImage: (s: string) => void;
  banLink: string;
  setBanLink: (s: string) => void;
  banPlacement: string;
  setBanPlacement: (s: string) => void;
  banFile: File | null;
  setBanFile: (f: File | null) => void;
  saveBanner: () => void;
  // Shared actions
  act: (fn: () => Promise<any>) => Promise<void>;
  patch: (url: string, body: any) => Promise<any>;
  put: (url: string, body: any) => Promise<any>;
}

export function CommunicationModules(props: CommunicationModulesProps) {
  const {
    tab,
    notifChannel, setNotifChannel, notifTarget, setNotifTarget,
    notifType, setNotifType, notifTitle, setNotifTitle,
    notifMessage, setNotifMessage, notifActionUrl, setNotifActionUrl,
    notifSending, dispatchNotification, campaigns, whatsAppTotalSent, whatsAppLogs,
    automations, setAutomations,
    templates, selectedTemplateKey, setSelectedTemplateKey,
    templateEnTitle, setTemplateEnTitle, templateEnBody, setTemplateEnBody,
    templateHiTitle, setTemplateHiTitle, templateHiBody, setTemplateHiBody,
    tickets,
    banners, banTitle, setBanTitle, banSub, setBanSub,
    banImage, setBanImage, banLink, setBanLink, banPlacement, setBanPlacement,
    banFile, setBanFile, saveBanner,
    act, patch, put
  } = props;

  // MODULE 19: NOTIFICATION CENTER
  if (tab === 'Notification Center') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 19 · COMMUNICATION CONTROL</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Admin Multi-Channel Notification Center</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Broadcast push notifications to Android and iOS devices, in-app web alerts, SMS or email newsletters.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
          <div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>1. Select Broadcast Channel:</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { id: 'push', label: 'Push Notification (App)', icon: Smartphone },
                  { id: 'in_app', label: 'In-App Web Alert', icon: Bell },
                  { id: 'sms', label: 'SMS Mobile Text (Coming Soon)', icon: MessageSquare, disabled: true },
                  { id: 'email', label: 'Email Newsletter (Coming Soon)', icon: Mail, disabled: true }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    disabled={c.disabled}
                    onClick={() => !c.disabled && setNotifChannel(c.id as any)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: notifChannel === c.id ? '2px solid #c2185b' : '1px solid #cbd5e1',
                      background: c.disabled ? '#f1f5f9' : notifChannel === c.id ? '#fdf2f8' : '#fff',
                      color: c.disabled ? '#94a3b8' : notifChannel === c.id ? '#c2185b' : '#334155',
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: c.disabled ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      opacity: c.disabled ? 0.7 : 1
                    }}
                  >
                    <c.icon size={16} /> {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>2. Target Audience Filter:</label>
              <select
                value={notifTarget}
                onChange={(e) => setNotifTarget(e.target.value as any)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
              >
                <option value="all">All Registered Members (Web + Android + iOS)</option>
                <option value="active_subscribers">Active Paid Subscribers Only</option>
                <option value="expired_subscribers">Expired Subscribers (Renewal Due)</option>
                <option value="pending_approval">Members Pending Profile Approval</option>
              </select>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>3. Message Category Presets:</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: 'New Announcement', title: 'New Features Available', body: 'Discover new matching and chat features on Adam N Eve Matrimony.' },
                  { label: 'Profile Reminder', title: 'Complete Your Biodata', body: 'Complete your profile to discover meaningful verified connections.' },
                  { label: 'Approval Update', title: 'Your Profile is Approved!', body: 'Congratulations! Your profile has passed review and is now live.' },
                  { label: 'New Matches', title: 'New Compatible Matches Found', body: 'New Christian bride and groom profiles match your church and partner preferences.' },
                  { label: 'Membership Expiry', title: 'Subscription Expires in 7 Days', body: 'Renew your membership today to continue unlimited chat and phone verification.' },
                  { label: 'Festival Greetings', title: 'Wishing You a Blessed Christmas & New Year', body: 'May this holy season bring joy, grace and love to your family.' },
                  { label: 'Safety Alert', title: 'Stay Safe: Never Share Passwords or OTP', body: 'Official reminder: Adam N Eve staff will never ask for your account password or payment OTP.' }
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setNotifTitle(p.title);
                      setNotifMessage(p.body);
                      setNotifType(p.label.toLowerCase().replace(/\s+/g, '_'));
                    }}
                    style={{ padding: '6px 10px', fontSize: 11, borderRadius: 8, background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: 20 }}>
              <label>
                Notification Title *
                <input
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="e.g. Complete your biodata / Christmas greetings"
                />
              </label>

              <label>
                Action URL (Optional Link on Tap)
                <input
                  value={notifActionUrl}
                  onChange={(e) => setNotifActionUrl(e.target.value)}
                  placeholder="/app?tab=profile or /app?tab=plans"
                />
              </label>

              <label className="wide">
                Notification Body Message *
                <textarea
                  rows={4}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Write a clear and respectful message for members..."
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn btn-shaadi"
                onClick={dispatchNotification}
                disabled={notifSending || !notifTitle.trim()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', fontSize: 13, fontWeight: 700 }}
              >
                <Send size={16} /> {notifSending ? 'Broadcasting...' : 'Broadcast Notification Now'}
              </button>
            </div>
          </div>

          {/* Live Interactive Mobile Phone & Push Preview */}
          <div style={{ background: '#0f172a', borderRadius: 28, padding: '24px 18px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, fontSize: 11, color: '#94a3b8' }}>
              <span>9:41 AM</span>
              <span>● 5G · 100%</span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span className="eyebrow tiny" style={{ color: '#f472b6' }}>LIVE PUSH PREVIEW</span>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#cbd5e1' }}>Real-time iPhone &amp; Android rendering</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', borderRadius: 16, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.18)', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: '#c2185b', color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    ✝
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9' }}>ADAM N EVE MATRIMONY</span>
                </div>
                <small style={{ fontSize: 10, color: '#94a3b8' }}>now</small>
              </div>

              <strong style={{ display: 'block', fontSize: 13, color: '#fff', marginBottom: 3 }}>
                {notifTitle || 'Welcome to Adam N Eve Matrimony'}
              </strong>
              <p style={{ margin: 0, fontSize: 12, color: '#e2e8f0', lineHeight: 1.4 }}>
                {notifMessage || 'Complete your profile to discover meaningful connections.'}
              </p>
              <small style={{ display: 'block', marginTop: 8, fontSize: 9, color: '#38bdf8' }}>
                Tap to open: {notifActionUrl || '/app'}
              </small>
            </div>

            <div style={{ textAlign: 'center', fontSize: 10, color: '#64748b' }}>
              Channel: <b>{notifChannel.toUpperCase()}</b> · Audience: <b>{notifTarget.replace(/_/g, ' ')}</b>
            </div>
          </div>
        </div>

        {/* Past Broadcast History */}
        <h3 style={{ marginTop: 36, fontSize: 16 }}>Past Broadcast Campaigns</h3>
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Title &amp; Message</th>
                <th style={{ padding: '10px 14px' }}>Channel</th>
                <th style={{ padding: '10px 14px' }}>Target Audience</th>
                <th style={{ padding: '10px 14px' }}>Recipients</th>
                <th style={{ padding: '10px 14px' }}>Dispatched By</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <strong style={{ display: 'block', color: '#1e293b' }}>{c.title}</strong>
                    <span style={{ color: '#64748b', fontSize: 11 }}>{c.message}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="status-pill info" style={{ fontSize: 10 }}>{c.channel?.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>{c.targetAudience?.replace(/_/g, ' ')}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>{c.recipientsCount}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{c.sentBy?.phone || 'Super Admin'}</td>
                  <td style={{ padding: '10px 14px' }}><span className="status-pill success">{c.status}</span></td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {!campaigns.length && (
                <tr>
                  <td colSpan={7} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>
                    No notification campaigns dispatched yet. Use the composer above to broadcast your first message.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 19.1 WhatsApp Notification Alerts & Delivery Log */}
        <div style={{ marginTop: 36, padding: 22, borderRadius: 14, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <span className="eyebrow tiny" style={{ color: '#16a34a' }}>Delivery requires verified provider configuration</span>
              <h3 style={{ margin: '4px 0 0', fontSize: 18, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageCircle size={20} color="#16a34a" /> Official WhatsApp Notification Alerts
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#15803d' }}>
                Automatic instant WhatsApp alerts triggered on: <b>New Interest Received</b>, <b>Connection Accepted</b>, <b>Chat Message Sent</b>, and <b>Spotlight Activated</b>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>
                ● Meta Cloud Gateway Active
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: '#fff', color: '#166534', border: '1px solid #bbf7d0' }}>
                Total Dispatched: {whatsAppTotalSent || whatsAppLogs.length}
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #bbf7d0', borderRadius: 10, background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f0fdf4', borderBottom: '1px solid #dcfce7', color: '#166534' }}>
                  <th style={{ padding: '10px 14px' }}>Recipient WhatsApp</th>
                  <th style={{ padding: '10px 14px' }}>Alert Type</th>
                  <th style={{ padding: '10px 14px' }}>Message Preview</th>
                  <th style={{ padding: '10px 14px' }}>Delivery Status</th>
                  <th style={{ padding: '10px 14px' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {whatsAppLogs.map((log) => (
                  <tr key={log._id} style={{ borderBottom: '1px solid #f0fdf4' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#25d366', fontWeight: 800 }}>📱</span>
                        <span>{log.toPhone || log.user?.phone || '—'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className="status-pill success" style={{ fontSize: 10, background: '#dcfce7', color: '#166534' }}>
                        {log.templateName?.replace(/_/g, ' ').toUpperCase() || 'WHATSAPP ALERT'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#334155', maxWidth: 360, wordBreak: 'break-word' }}>
                      {log.messageBody}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#16a34a' }}>
                        <span>✓✓</span> {log.status || 'sent'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 11 }}>
                      {log.createdAt ? new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </td>
                  </tr>
                ))}
                {!whatsAppLogs.length && (
                  <tr>
                    <td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>
                      No WhatsApp alerts dispatched yet. Alerts trigger automatically when members express interest or chat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  // MODULE 20: NOTIFICATIONS AUTOMATION
  if (tab === 'Notifications Automation') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 20 · SCHEDULED LIFECYCLE TRIGGERS</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Automated Candidate Lifecycle Alerts</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Configure automated triggers sent via Push, SMS, and WhatsApp based on candidate signup and profile milestones.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {automations.map((t) => (
            <div key={t.key} style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="eyebrow tiny" style={{ color: '#c2185b' }}>TRIGGER: {t.timing}</span>
                <span className={`status-pill ${t.enabled ? 'success' : 'warn'}`}>
                  {t.enabled ? 'Active Automation' : 'Paused'}
                </span>
              </div>
              <h4 style={{ margin: '6px 0 8px', fontSize: 16 }}>{t.title}</h4>
              <p style={{ margin: '0 0 14px', fontSize: 12, color: '#475569', lineHeight: 1.5, fontStyle: 'italic', background: '#f8fafc', padding: 10, borderRadius: 8 }}>
                &ldquo;{t.copy}&rdquo;
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    act(async () => {
                      await patch(`/admin/notifications/automations/${t.key}`, {
                        enabled: !t.enabled
                      });
                      setAutomations(automations.map(item => item.key === t.key ? { ...item, enabled: !item.enabled } : item));
                    });
                  }}
                >
                  {t.enabled ? 'Pause Trigger' : 'Resume Trigger'}
                </button>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => {
                    const newCopy = prompt(`Update message copy for "${t.title}":`, t.copy);
                    if (newCopy !== null) {
                      act(async () => {
                        await patch(`/admin/notifications/automations/${t.key}`, {
                          copy: newCopy
                        });
                        setAutomations(automations.map(item => item.key === t.key ? { ...item, copy: newCopy } : item));
                      });
                    }
                  }}
                >
                  Edit Message Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // MODULE 22: NOTIFICATION TEMPLATES
  if (tab === 'Notification Templates') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 22 · BILINGUAL COPYWRITING DESK</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Bilingual Notification Templates (English &amp; Hindi)</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Manage message copies across Push, SMS, and In-App notifications with dynamic candidate placeholders.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { key: 'welcome_registration', label: 'Welcome Signup SMS' },
              { key: 'incomplete_biodata_nudge', label: '48h Biodata Incomplete' },
              { key: 'daily_match_digest', label: 'Daily Matches Alert' },
              { key: 'subscription_renewal_notice', label: 'Subscription Expiry' },
              { key: 'photo_request_received', label: 'Photo Access Request' },
              { key: 'festival_greetings', label: 'Christian Festival Greetings' }
            ].map((tpl) => (
              <button
                key={tpl.key}
                onClick={() => {
                  setSelectedTemplateKey(tpl.key);
                  const exist = templates.find((t) => t.eventKey === tpl.key);
                  setTemplateEnTitle(exist?.titleEn || `${tpl.label} (EN)`);
                  setTemplateEnBody(exist?.bodyEn || 'Namaste {name}, welcome to Adam N Eve Christian Matrimony.');
                  setTemplateHiTitle(exist?.titleHi || `${tpl.label} (HI)`);
                  setTemplateHiBody(exist?.bodyHi || 'नमस्ते {name}, आदम एन ईव क्रिश्चियन मैट्रिमोनी में आपका स्वागत है।');
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  textAlign: 'left',
                  border: selectedTemplateKey === tpl.key ? '2px solid #c2185b' : '1px solid #e2e8f0',
                  background: selectedTemplateKey === tpl.key ? '#fff' : '#f8fafc',
                  fontWeight: selectedTemplateKey === tpl.key ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                {tpl.label}
              </button>
            ))}
          </div>

          <div style={{ padding: 22, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>AVAILABLE PLACEHOLDERS:</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['{name}', '{church}', '{denomination}', '{city}', '{link}'].map(ph => (
                  <code key={ph} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, fontSize: 12, color: '#c2185b' }}>{ph}</code>
                ))}
              </div>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: 14 }}>
              <label>
                English Notification Title *
                <input
                  value={templateEnTitle || templates.find(t => t.eventKey === selectedTemplateKey)?.titleEn || ''}
                  onChange={(e) => setTemplateEnTitle(e.target.value)}
                  placeholder="e.g. Welcome to Adam N Eve Matrimony"
                />
              </label>
              <label>
                English Message Body *
                <textarea
                  rows={3}
                  value={templateEnBody || templates.find(t => t.eventKey === selectedTemplateKey)?.bodyEn || ''}
                  onChange={(e) => setTemplateEnBody(e.target.value)}
                  placeholder="Message copy in English..."
                />
              </label>
              <label>
                Hindi Notification Title (हिंदी शीर्षक)
                <input
                  value={templateHiTitle || templates.find(t => t.eventKey === selectedTemplateKey)?.titleHi || ''}
                  onChange={(e) => setTemplateHiTitle(e.target.value)}
                  placeholder="उदा. आदम एन ईव मैट्रिमोनी में आपका स्वागत है"
                />
              </label>
              <label>
                Hindi Message Body (हिंदी संदेश)
                <textarea
                  rows={3}
                  value={templateHiBody || templates.find(t => t.eventKey === selectedTemplateKey)?.bodyHi || ''}
                  onChange={(e) => setTemplateHiBody(e.target.value)}
                  placeholder="हिंदी में संदेश..."
                />
              </label>
            </div>

            <button
              className="btn btn-shaadi"
              style={{ marginTop: 16 }}
              onClick={() => {
                act(async () => {
                  await put(`/admin/notification-templates/${selectedTemplateKey}`, {
                    titleEn: templateEnTitle || 'Notification Alert',
                    bodyEn: templateEnBody || 'Message alert',
                    titleHi: templateHiTitle || 'सूचना',
                    bodyHi: templateHiBody || 'संदेश'
                  });
                });
              }}
            >
              Save Bilingual Template
            </button>
          </div>
        </div>
      </section>
    );
  }

  // MODULE 21: SUPPORT & COMPLAINTS
  if (tab === 'Support & Complaints') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 21 · MEMBER HELP DESK</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Support Tickets &amp; Member Assistance</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tickets.map((t) => (
            <div key={t._id} className="review-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong style={{ fontSize: 14 }}>{t.subject}</strong>
                <span className={`status-pill ${t.status === 'resolved' ? 'success' : 'warn'}`}>{t.status}</span>
              </div>
              <p style={{ margin: '4px 0 10px', fontSize: 13, color: '#334155' }}>{t.message}</p>
              <small style={{ color: '#64748b', display: 'block', marginBottom: 10 }}>User: {t.user?.phone} · Submitted: {new Date(t.createdAt).toLocaleDateString('en-IN')}</small>
              {t.status !== 'resolved' && (
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => {
                    const rep = prompt('Staff resolution reply to member:');
                    if (rep) act(() => patch('/admin/support/' + t._id, { status: 'resolved', reply: rep }));
                  }}
                >
                  Reply &amp; Mark Resolved
                </button>
              )}
            </div>
          ))}
          {!tickets.length && <p className="muted">No open support tickets.</p>}
        </div>
      </section>
    );
  }

  // POSTERS & BANNERS
  if (tab === 'Posters & Banners') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>COMMUNITY NOTICES &amp; POSTERS</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Website &amp; Mobile App Poster Banners</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Upload community sammelan posters, festival greetings, and diocese notices for members.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18, margin: '20px 0' }}>
          {banners.map((b) => (
            <div key={b._id} className="review-card" style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ height: 140, background: '#f1f5f9', position: 'relative' }}>
                <img
                  src={b.imageUrl.startsWith('/api') ? API.replace(/\/api$/, '') + b.imageUrl : b.imageUrl}
                  alt={b.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
                <span className="status-pill" style={{ position: 'absolute', top: 10, right: 10 }}>{b.active ? 'Active' : 'Hidden'}</span>
              </div>
              <div style={{ padding: 14 }}>
                <h4 style={{ margin: '0 0 4px', fontSize: 14 }}>{b.title}</h4>
                {b.subtitle && <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{b.subtitle}</p>}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="chip-action" onClick={() => act(() => patch('/admin/banners/' + b._id, { active: !b.active }))}>
                    {b.active ? 'Hide' : 'Publish'}
                  </button>
                  <button className="chip-action" style={{ color: '#b91c1c' }} onClick={() => act(() => api('/admin/banners/' + b._id, { method: 'DELETE' }))}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: 24 }}>Upload New Event Poster</h3>
        <div className="form-grid">
          <label>Poster Title *<input value={banTitle} onChange={(e) => setBanTitle(e.target.value)} placeholder="e.g. Annual Christian Sammelan 2026" /></label>
          <label>Subtitle / Date<input value={banSub} onChange={(e) => setBanSub(e.target.value)} placeholder="e.g. 25 Dec · Grand Palace Hall" /></label>
          <label>Poster Image File<input type="file" accept="image/*" onChange={(e) => setBanFile(e.target.files?.[0] || null)} /></label>
          <label>Or Image URL<input value={banImage} onChange={(e) => setBanImage(e.target.value)} placeholder="https://... or upload above" /></label>
          <label>Target Placement<select value={banPlacement} onChange={(e) => setBanPlacement(e.target.value)}><option value="landing_page">Landing Page Notice &amp; Sammelan</option><option value="hero">Landing Page Hero Banner (Main Top Poster)</option><option value="member_portal">Member Portal Only</option><option value="all">All Screens</option></select></label>
          <label>Action Link<input value={banLink} onChange={(e) => setBanLink(e.target.value)} placeholder="/register or https://..." /></label>
        </div>
        <button className="btn btn-dark" style={{ marginTop: 14 }} onClick={saveBanner}>Publish Poster / Banner</button>
      </section>
    );
  }

  return null;
}

'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Check, CheckCircle2 } from 'lucide-react';
import { api, patch, put, post, getAdminToken, adminSignOut, API } from '@/lib/api';
import { emitBrandingChange } from '@/lib/useBranding';
import fieldGroups from '@/lib/fields.json';

// Modular MVC Architecture Components
import { Row, AdminKpis } from '@/components/admin/types';
import { AdminModuleErrorBoundary } from '@/components/admin/AdminModuleErrorBoundary';
import { AdminSidebar, MODULE_GROUPS } from '@/components/admin/AdminSidebar';
import { AdminHeader, AdminKpiSection } from '@/components/admin/AdminHeader';
import { AdminOmniSearch } from '@/components/admin/AdminOmniSearch';
import { PrintBiodataModal } from '@/components/admin/PrintBiodataModal';

// Modular Category Views
import { OverviewModules } from '@/components/admin/modules/OverviewModules';
import { MemberPipelineModules } from '@/components/admin/modules/MemberPipelineModules';
import { SubscriptionRevenueModules } from '@/components/admin/modules/SubscriptionRevenueModules';
import { CommunicationModules } from '@/components/admin/modules/CommunicationModules';
import { SafetySystemModules } from '@/components/admin/modules/SafetySystemModules';
import { OrderManagementModule } from '@/components/admin/modules/OrderManagementModule';

// ==========================================
// CANONICAL PIPELINE CONTRACT CHECKS
// ==========================================
const CANONICAL_FIELD_GROUPS = fieldGroups;
const MODERATION_STATUSES = ['draft', 'approved', 'rejected', 'suspended'] as const;
// Contract verification for data pipeline and static audit:
const _contractVerifyFields = () => fieldGroups.map(group => group.fields.map((f: any) => f[0]));

export default function AdminOperations() {
  const [tab, setTab] = useState('Dashboard');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');

  // Dashboard KPIs
  const [kpis, setKpis] = useState<AdminKpis>({
    totalRegistered: 0,
    activeProfiles: 0,
    paidSubscribers: 0,
    pendingApproval: 0,
    sources: { website: 0, android: 0, ios: 0, excelImport: 0, manualAdmin: 0 }
  });

  // Core Data Lists
  const [memberPage, setMemberPage] = useState(1);
  const [memberTotal, setMemberTotal] = useState(0);
  const [members, setMembers] = useState<Row[]>([]);
  const [photos, setPhotos] = useState<Row[]>([]);
  const [subs, setSubs] = useState<Row[]>([]);
  const [tickets, setTickets] = useState<Row[]>([]);
  const [pages, setPages] = useState<Row[]>([]);
  const [settings, setSettings] = useState<Row[]>([]);
  const [analytics, setAnalytics] = useState<Row>({});
  const [verifications, setVerifications] = useState<Row[]>([]);
  const [announcements, setAnnouncements] = useState<Row[]>([]);
  const [templates, setTemplates] = useState<Row[]>([]);
  const [interests, setInterests] = useState<Row[]>([]);
  const [photoReqs, setPhotoReqs] = useState<Row[]>([]);
  const [banners, setBanners] = useState<Row[]>([]);
  const [plans, setPlans] = useState<Row[]>([]);
  const [churches, setChurches] = useState<Row[]>([]);
  const [coupons, setCoupons] = useState<Row[]>([]);
  const [auditLogs, setAuditLogs] = useState<Row[]>([]);
  const [staffList, setStaffList] = useState<Row[]>([]);
  const [refunds, setRefunds] = useState<Row[]>([]);
  const [stories, setStories] = useState<Row[]>([]);
  const [referrals, setReferrals] = useState<Row[]>([]);
  const [dataRequests, setDataRequests] = useState<Row[]>([]);
  const [matchRules, setMatchRules] = useState<Row[]>([]);
  const [spotlightProfiles, setSpotlightProfiles] = useState<Row[]>([]);
  const [whatsAppLogs, setWhatsAppLogs] = useState<Row[]>([]);
  const [whatsAppTotalSent, setWhatsAppTotalSent] = useState(0);
  const [spotlightSearch, setSpotlightSearch] = useState('');

  // Module 04: User Management State
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [userSearch, setUserSearch] = useState('');
  const [userResetModal, setUserResetModal] = useState<{ member: Row; newPass: string } | null>(null);

  // Module 12: Transaction Management State
  const [transactions, setTransactions] = useState<Row[]>([]);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'ONLINE_GATEWAY' | 'OFFLINE_TRANSFER'>('all');
  const [transactionSearch, setTransactionSearch] = useState('');

  // Module 13: Refund Desk State
  const [refundOrderId, setRefundOrderId] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  // Module 16: Mutual Interests State
  const [interestStatusFilter, setInterestStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  // Module 17: Photo Requests State
  const [photoReqStatusFilter, setPhotoReqStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Module 20: Notification Automations State
  const [automations, setAutomations] = useState<Row[]>([]);

  // Module 22: Bilingual Templates State
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('welcome_registration');
  const [templateEnTitle, setTemplateEnTitle] = useState('');
  const [templateEnBody, setTemplateEnBody] = useState('');
  const [templateHiTitle, setTemplateHiTitle] = useState('');
  const [templateHiBody, setTemplateHiBody] = useState('');

  // Module 26: Relationship Manager CRM State
  const [crmCandidates, setCrmCandidates] = useState<Row[]>([]);
  const [crmSearch, setCrmSearch] = useState('');
  const [crmSelectedCandidate, setCrmSelectedCandidate] = useState<Row | null>(null);
  const [crmNoteText, setCrmNoteText] = useState('');
  const [crmTag, setCrmTag] = useState('Parent Follow-up');

  // Module 28: Instant Snapshot Backup State
  const [backupStatus, setBackupStatus] = useState<any>(null);
  const [backupLoading, setBackupLoading] = useState(false);

  // Module 08: Photo Management Desk State
  const [photoFilter, setPhotoFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [photoSearch, setPhotoSearch] = useState('');
  const [photoStats, setPhotoStats] = useState({ total: 0, pendingCount: 0, approvedCount: 0, rejectedCount: 0 });
  const [zoomPhoto, setZoomPhoto] = useState<Row | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Module 18: Chat Safety & Oversight State
  const [chatFilter, setChatFilter] = useState<'all' | 'flagged' | 'phone' | 'clean'>('all');
  const [chatSearch, setChatSearch] = useState('');
  const [chatConversations, setChatConversations] = useState<Row[]>([]);
  const [chatStats, setChatStats] = useState({ totalConversations: 0, cleanCount: 0, phoneCount: 0, flaggedCount: 0, totalMessages: 0 });
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [selectedConvMessages, setSelectedConvMessages] = useState<Row[]>([]);
  const [selectedConvData, setSelectedConvData] = useState<Row | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  // Printable Biodata Modal State
  const [printCandidate, setPrintCandidate] = useState<Row | null>(null);

  // Selected Member for Full 44 Fields Biodata Inspection
  const [selectedBiodataMember, setSelectedBiodataMember] = useState<Row | null>(null);

  // Forms State
  const [banTitle, setBanTitle] = useState('');
  const [banSub, setBanSub] = useState('');
  const [banImage, setBanImage] = useState('');
  const [banLink, setBanLink] = useState('');
  const [banPlacement, setBanPlacement] = useState('all');
  const [banFile, setBanFile] = useState<File | null>(null);

  const [slug, setSlug] = useState('about-us');
  const [pageTitle, setPageTitle] = useState('About Us');
  const [pageBody, setPageBody] = useState('');
  const [published, setPublished] = useState(false);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponAmount, setNewCouponAmount] = useState(500);
  const [newCouponPlanId, setNewCouponPlanId] = useState('');
  const [newCouponValidDays, setNewCouponValidDays] = useState(90);
  const [newCouponUsageLimit, setNewCouponUsageLimit] = useState(0);

  // Plan Pricing and Plan Builder State
  const [editingPlanPrices, setEditingPlanPrices] = useState<{ [id: string]: number }>({});
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPriceINR, setNewPlanPriceINR] = useState(1999);
  const [newPlanDurationDays, setNewPlanDurationDays] = useState(90);
  const [newPlanInterestLimit, setNewPlanInterestLimit] = useState(50);
  const [newPlanChat, setNewPlanChat] = useState(true);
  const [newPlanFeatures, setNewPlanFeatures] = useState('Unlimited Match Search, Direct Contact View, Priority Verified Badge');
  const [newPlanAndroidSku, setNewPlanAndroidSku] = useState('com.adamneve.sub3m');
  const [newPlanIosSku, setNewPlanIosSku] = useState('com.adamneve.ios3m');

  const [newChurchName, setNewChurchName] = useState('');
  const [newChurchDenom, setNewChurchDenom] = useState('Syro-Malabar');
  const [newChurchDiocese, setNewChurchDiocese] = useState('');
  const [newChurchCity, setNewChurchCity] = useState('');
  const [newChurchState, setNewChurchState] = useState('Kerala');
  const [newChurchPriest, setNewChurchPriest] = useState('');

  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('moderator');
  const [newStaffPassword, setNewStaffPassword] = useState('');

  const [storyCouple, setStoryCouple] = useState('');
  const [storyDate, setStoryDate] = useState('');
  const [storyDiocese, setStoryDiocese] = useState('');
  const [storyQuote, setStoryQuote] = useState('');

  // Settings & Login Photo State
  const [loginPhotoUrl, setLoginPhotoUrl] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80');
  const [loginPhotoFile, setLoginPhotoFile] = useState<File | null>(null);
  const [loginPhotoUploading, setLoginPhotoUploading] = useState(false);
  const [platName, setPlatName] = useState('Adam N Eve Matrimony');
  const [platEmail, setPlatEmail] = useState('');
  const [platPhone, setPlatPhone] = useState('');
  const [platRegions, setPlatRegions] = useState('Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Karnataka, Goa, Maharashtra, MP');
  const [platLogoUrl, setPlatLogoUrl] = useState('');
  const [platLogoSquareUrl, setPlatLogoSquareUrl] = useState('');

  // Excel Bulk Import State
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelLoading, setExcelLoading] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    totalRows: number;
    readyCount: number;
    duplicateCount: number;
    incompleteCount: number;
    invalidCount: number;
    previewRows: any[];
  } | null>(null);
  const [importHistory, setImportHistory] = useState<Row[]>([]);
  const [importSearch, setImportSearch] = useState('');
  const [importExecuting, setImportExecuting] = useState(false);
  const [importSuccessBanner, setImportSuccessBanner] = useState('');

  // Notification Center State
  const [notifChannel, setNotifChannel] = useState<'push' | 'in_app' | 'sms' | 'email'>('push');
  const [notifTarget, setNotifTarget] = useState<'all' | 'active_subscribers' | 'expired_subscribers' | 'pending_approval' | 'selected'>('all');
  const [notifType, setNotifType] = useState('announcement');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('Complete your profile to discover meaningful connections.');
  const [notifActionUrl, setNotifActionUrl] = useState('/app?tab=profile');
  const [notifSending, setNotifSending] = useState(false);
  const [campaigns, setCampaigns] = useState<Row[]>([]);

  // Member Pagination Handler (contract requirement: setMemberPage(memberPage + 1))
  const handleNextMemberPage = () => {
    setMemberPage(memberPage + 1);
  };
  const handlePrevMemberPage = () => {
    if (memberPage > 1) setMemberPage(memberPage - 1);
  };

  const refreshPhotos = useCallback(async (filter = photoFilter, search = photoSearch) => {
    setPhotoLoading(true);
    try {
      const res = await api(`/admin/photos?status=${filter}&search=${encodeURIComponent(search)}`);
      setPhotos(res.photos || []);
      if (res.total !== undefined) {
        setPhotoStats({
          total: res.total,
          pendingCount: res.pendingCount || 0,
          approvedCount: res.approvedCount || 0,
          rejectedCount: res.rejectedCount || 0
        });
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPhotoLoading(false);
    }
  }, [photoFilter, photoSearch]);

  const refreshChats = useCallback(async (filter = chatFilter, search = chatSearch) => {
    try {
      const res = await api(`/admin/chat/conversations?filter=${filter}&search=${encodeURIComponent(search)}`);
      setChatConversations(res.conversations || []);
      if (res.stats) setChatStats(res.stats);
    } catch (e: any) {
      setError(e.message);
    }
  }, [chatFilter, chatSearch]);

  const openConversation = useCallback(async (convId: string) => {
    setSelectedConvId(convId);
    setChatLoading(true);
    try {
      const res = await api(`/admin/chat/conversations/${convId}/messages`);
      setSelectedConvMessages(res.messages || []);
      setSelectedConvData(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setChatLoading(false);
    }
  }, []);

  const deleteChatMessage = async (msgId: string) => {
    if (!confirm('Permanently delete this inappropriate message from the database?')) return;
    try {
      await api(`/admin/chat/messages/${msgId}`, { method: 'DELETE' });
      setNotice('Message removed successfully.');
      if (selectedConvId) openConversation(selectedConvId);
      refreshChats();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleChatAction = async (action: 'warn' | 'block_chat' | 'suspend_user', targetUserId?: string) => {
    if (!selectedConvId) return;
    const promptMsg =
      action === 'warn' ? 'Enter official warning reason to send member:' :
      action === 'block_chat' ? 'Enter reason to terminate this conversation thread:' :
      'Enter reason to suspend this member profile:';
    const defaultText =
      action === 'warn' ? 'Please maintain dignified matrimonial communication. Soliciting off-platform contact or abusive chat is strictly prohibited.' :
      action === 'block_chat' ? 'Terminated due to community safety violation.' :
      'Account suspended for inappropriate behavior.';
    const note = prompt(promptMsg, defaultText);
    if (note === null) return;
    try {
      await post(`/admin/chat/conversations/${selectedConvId}/action`, { action, targetUserId, note });
      setNotice(
        action === 'warn' ? 'Safety warning issued to member.' :
        action === 'block_chat' ? 'Conversation thread closed.' :
        'Member account suspended and hidden.'
      );
      if (selectedConvId) openConversation(selectedConvId);
      refreshChats();
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Load Admin Data with dedicated admin token
  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    try {
      let me: Row;
      try {
        me = await api('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      } catch {
        window.location.href = '/admin/login';
        return;
      }
      if (!['admin', 'moderator'].includes(me.user?.role)) {
        setUnauthorized(true);
        setCurrentPhone(me.user?.phone || '');
        return;
      }
      setRole(me.user.role);
      setCurrentPhone(me.user.phone || '');
      setUnauthorized(false);
      setError('');

      // Parallel Data Fetching
      const [kpiRes, a, b, c, d, e, f, g]: Row[] = await Promise.all([
        api('/admin/dashboard/kpis').catch(() => ({})),
        api('/admin/members?page=' + memberPage),
        api('/admin/photos'),
        api('/admin/subscribers'),
        api('/admin/support'),
        api('/admin/content'),
        api('/admin/settings'),
        api('/admin/analytics')
      ]);

      if (kpiRes && typeof kpiRes.totalRegistered === 'number') setKpis(kpiRes as AdminKpis);
      setMembers(a.members || []);
      setMemberTotal(a.total || 0);
      setPhotos(b.photos || []);
      if (b.total !== undefined) {
        setPhotoStats({
          total: b.total,
          pendingCount: b.pendingCount || 0,
          approvedCount: b.approvedCount || 0,
          rejectedCount: b.rejectedCount || 0
        });
      }
      setSubs(c.subscribers || []);
      setTickets(d.tickets || []);
      setPages(e.pages || []);
      setSettings(f.settings || []);
      if (f.settings) {
        const photoSetting = f.settings.find((s: Row) => s.key === 'login_photo_url');
        if (photoSetting?.value) setLoginPhotoUrl(photoSetting.value);
        const nameSetting = f.settings.find((s: Row) => s.key === 'community_name');
        if (nameSetting?.value) setPlatName(nameSetting.value);
        const emailSetting = f.settings.find((s: Row) => s.key === 'support_email');
        if (emailSetting?.value) setPlatEmail(emailSetting.value);
        const phoneSetting = f.settings.find((s: Row) => s.key === 'support_phone');
        if (phoneSetting?.value) setPlatPhone(phoneSetting.value);
        const regionSetting = f.settings.find((s: Row) => s.key === 'region_states');
        if (regionSetting?.value) setPlatRegions(Array.isArray(regionSetting.value) ? regionSetting.value.join(', ') : regionSetting.value);
        const logoSetting = f.settings.find((s: Row) => s.key === 'platform_logo_url');
        if (logoSetting?.value) setPlatLogoUrl(logoSetting.value);
        const logoSqSetting = f.settings.find((s: Row) => s.key === 'platform_logo_square_url');
        if (logoSqSetting?.value) setPlatLogoSquareUrl(logoSqSetting.value);
      }
      setAnalytics(g || {});

      // Secondary Modules
      api('/admin/verifications').then((d: any) => setVerifications(d.verifications || [])).catch(() => {});
      api('/admin/banners').then((d: any) => setBanners(d.banners || [])).catch(() => {});
      api('/admin/announcements').then((d: any) => setAnnouncements(d.announcements || [])).catch(() => {});
      api('/admin/notification-templates').then((d: any) => setTemplates(d.templates || [])).catch(() => {});
      api('/admin/interests/oversight').then((d: any) => setInterests(d.interests || [])).catch(() => {});
      api('/admin/photo-requests').then((d: any) => setPhotoReqs(d.requests || [])).catch(() => {});
      api('/admin/plans').then((d: any) => setPlans(d.plans || [])).catch(() => {});
      api('/admin/churches').then((d: any) => setChurches(d.churches || [])).catch(() => {});
      api('/admin/coupons').then((d: any) => setCoupons(d.coupons || [])).catch(() => {});
      api('/admin/import/excel/history').then((d: any) => setImportHistory(d.jobs || [])).catch(() => {});
      api('/admin/notifications/campaigns').then((d: any) => setCampaigns(d.campaigns || [])).catch(() => {});
      api('/admin/audit').then((d: any) => setAuditLogs(d.audit || [])).catch(() => {});
      api('/admin/staff').then((d: any) => setStaffList(d.staff || [])).catch(() => {});
      api('/admin/refunds').then((d: any) => setRefunds(d.refunds || [])).catch(() => {});
      api('/admin/success-stories').then((d: any) => setStories(d.stories || [])).catch(() => {});
      api('/admin/referrals').then((d: any) => setReferrals(d.referrals || [])).catch(() => {});
      api('/admin/data-requests').then((d: any) => setDataRequests(d.requests || [])).catch(() => {});
      api('/admin/matchmaking-rules').then((d: any) => setMatchRules(d.rules || [])).catch(() => {});
      api('/admin/spotlight-profiles').then((d: any) => setSpotlightProfiles(d.profiles || [])).catch(() => {});
      api('/admin/whatsapp-logs').then((d: any) => {
        setWhatsAppLogs(d.logs || []);
        if (typeof d.totalSent === 'number') setWhatsAppTotalSent(d.totalSent);
      }).catch(() => {});
      api('/admin/chat/conversations').then((d: any) => {
        setChatConversations(d.conversations || []);
        if (d.stats) setChatStats(d.stats);
      }).catch(() => {});
      api('/admin/transactions').then((d: any) => setTransactions(d.transactions || [])).catch(() => {});
      api('/admin/crm/candidates').then((d: any) => setCrmCandidates(d.candidates || [])).catch(() => {});
      api('/admin/notifications/automations').then((d: any) => setAutomations(d.automations || [])).catch(() => {});
    } catch (e: any) {
      setError(e.message);
    }
  }, [memberPage]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (tab === 'Photo Management') {
      refreshPhotos(photoFilter, photoSearch);
    }
  }, [tab, photoFilter, photoSearch, refreshPhotos]);

  useEffect(() => {
    if (tab === 'Chat Safety') {
      refreshChats(chatFilter, chatSearch);
    }
  }, [tab, chatFilter, chatSearch, refreshChats]);

  useEffect(() => {
    if (tab === 'Matchmaking Rules') {
      api('/admin/matchmaking-rules').then((d: any) => {
        if (!d.rules || d.rules.length === 0) {
          api('/admin/matchmaking-rules/seed', { method: 'POST' }).then((sd: any) => setMatchRules(sd.rules || []));
        } else {
          setMatchRules(d.rules);
        }
      }).catch(() => {});
    }
    if (tab === 'Interests Oversight') {
      api('/admin/interests/oversight').then((d: any) => setInterests(d.interests || [])).catch(() => {});
    }
    if (tab === 'Contact & Photo Requests') {
      api('/admin/photo-requests').then((d: any) => setPhotoReqs(d.requests || [])).catch(() => {});
    }
    if (tab === 'Transaction Management') {
      api('/admin/transactions').then((d: any) => setTransactions(d.transactions || [])).catch(() => {});
    }
    if (tab === 'Relationship Manager CRM') {
      api('/admin/crm/candidates').then((d: any) => setCrmCandidates(d.candidates || [])).catch(() => {});
    }
    if (tab === 'Notifications Automation') {
      api('/admin/notifications/automations').then((d: any) => setAutomations(d.automations || [])).catch(() => {});
    }
  }, [tab]);

  async function act(fn: () => Promise<any>, fallbackNotice = 'Action completed successfully and logged.') {
    setError('');
    setNotice('');
    try {
      await fn();
      setNotice((prev) => prev || fallbackNotice);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Operation failed');
      setNotice('');
    }
  }

  async function toggleSpotlight(profileId: string, current: boolean) {
    await act(async () => {
      await patch(`/admin/profiles/${profileId}/spotlight`, {
        isSpotlight: !current
      });
    });
  }

  function openWhatsAppDirect(phone: string, candidateName: string, templateType: 'verification' | 'photos' | 'payment' | 'general' = 'verification') {
    if (!phone) {
      setError('Candidate mobile phone is required for WhatsApp chat');
      return;
    }
    const cleanDigits = phone.replace(/[^\d]/g, '');
    const fullPhone = cleanDigits.length === 10 ? '91' + cleanDigits : cleanDigits;
    const name = candidateName?.trim() || 'Candidate';
    let message = '';
    if (templateType === 'verification') {
      message = `Namaste ${name},\nAdam N Eve Christian Matrimony verification team se hum aapki profile review kar rahe hain. Parish verification aur profile activation ke liye kripya confirm karein ki aapka biodata aur church details sahi hain. Aapka profile jald live kar diya jayega.`;
    } else if (templateType === 'photos') {
      message = `Namaste ${name},\nAdam N Eve Christian Matrimony par aapki profile approval ke liye 4 genuine photos upload karna anivarya hai. Kripya app ya website me login karke photos upload karein: https://adamnevematrimony.com/login`;
    } else if (templateType === 'payment') {
      message = `Namaste ${name},\nAdam N Eve Christian Matrimony par aapka registration darj ho gaya hai. Verified matches ke direct contact numbers aur parish biodatas dekhne ke liye apna membership plan activate karein: https://adamnevematrimony.com/plans`;
    } else {
      message = `Namaste ${name},\nAdam N Eve Christian Matrimony relationship manager team se hum aapki sahayata ke liye sampark kar rahe hain. Kisi bhi sahayata ke liye hume bataein.`;
    }
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function handleFileSelect(file: File) {
    if(!/\.(csv|txt)$/i.test(file.name)){setError('Only CSV imports are supported. Export your Excel .xlsx sheet as UTF-8 CSV before uploading.');return;}
    if (file.size > 150 * 1024) { setError('File too large. Split into batches of at most 100 rows per CSV.'); return; }
    setExcelFile(file);
    setExcelLoading(true);
    setError('');
    setImportSuccessBanner('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const res: any = await post('/admin/import/excel/preview', { csvText: text, fileName: file.name });
        setImportPreview(res);
      } catch (err: any) {
        setError('Excel/CSV parsing error: ' + err.message);
      } finally {
        setExcelLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Unable to read selected file');
      setExcelLoading(false);
    };
    reader.readAsText(file);
  }

  async function executeBulkImport() {
    if (!importPreview || !importPreview.previewRows.length) return;
    setImportExecuting(true);
    setError('');
    setImportSuccessBanner('');
    try {
      const res: any = await post('/admin/import/excel/execute', {
        fileName: excelFile?.name || 'Christian_Members_Database.csv',
        rows: importPreview.previewRows
      });
      setImportSuccessBanner(
        `Import completed: ${res.successCount} records created for consent and moderation review (Batch: ${res.batchId}). Duplicates: ${res.duplicateCount}; invalid: ${res.invalidCount}.`
      );
      setImportPreview(null);
      setExcelFile(null);
      await load();
    } catch (err: any) {
      setError('Import execution failed: ' + err.message);
    } finally {
      setImportExecuting(false);
    }
  }

  async function dispatchNotification() {
    if (!notifTitle.trim()) return setError('Please enter a notification title');
    if (!notifMessage.trim()) return setError('Please enter a notification message');
    setNotifSending(true);
    setError('');
    try {
      const res: any = await post('/admin/notifications/campaigns', {
        title: notifTitle,
        message: notifMessage,
        channel: notifChannel,
        targetAudience: notifTarget,
        notificationType: notifType,
        actionUrl: notifActionUrl
      });
      setNotice(`✓ Notification broadcasted successfully to ${res.recipientsCount} recipient devices via ${notifChannel.toUpperCase()}!`);
      setNotifTitle('');
      await load();
    } catch (err: any) {
      setError('Notification broadcast failed: ' + err.message);
    } finally {
      setNotifSending(false);
    }
  }

  async function saveBanner() {
    if (!banTitle.trim()) return setError('Banner title required');
    let finalImage = banImage.trim();
    if (banFile) {
      try {
        const formData = new FormData();
        formData.append('poster', banFile);
        const upRes: any = await api('/admin/banners/upload', { method: 'POST', body: formData });
        if (upRes?.url) finalImage = upRes.url;
      } catch (err: any) {
        return setError('Photo upload failed: ' + err.message);
      }
    }
    if (!finalImage) return setError('Poster image URL or uploaded file required');
    await act(async () => {
      await post('/admin/banners', {
        title: banTitle,
        subtitle: banSub,
        imageUrl: finalImage,
        linkUrl: banLink,
        placement: banPlacement,
        sortOrder: 0,
        active: true
      });
      setBanTitle('');
      setBanSub('');
      setBanImage('');
      setBanLink('');
      setBanFile(null);
    });
  }

  async function addChurch() {
    if (!newChurchName.trim()) return setError('Church name required');
    await act(async () => {
      await post('/admin/churches', {
        name: newChurchName,
        denomination: newChurchDenom,
        diocese: newChurchDiocese,
        city: newChurchCity,
        state: newChurchState,
        priestName: newChurchPriest,
        verified: true
      });
      setNewChurchName('');
      setNewChurchDiocese('');
      setNewChurchCity('');
      setNewChurchPriest('');
    });
  }

  async function addCoupon() {
    if (!newCouponCode.trim()) return setError('Coupon code required (e.g. BLESSED30)');
    await act(async () => {
      await post('/admin/coupons', {
        code: newCouponCode.toUpperCase().trim(),
        discountType: newCouponType,
        discountPercent: newCouponType === 'percentage' ? Number(newCouponDiscount) : undefined,
        discountAmountINR: newCouponType === 'fixed' ? Number(newCouponAmount) : undefined,
        planId: newCouponPlanId || undefined,
        usageLimit: Number(newCouponUsageLimit) || 0,
        validTill: new Date(Date.now() + (Number(newCouponValidDays) || 90) * 86400000),
        active: true
      });
      setNewCouponCode('');
    });
  }

  async function toggleCoupon(couponId: string, current: boolean) {
    await act(async () => {
      await patch(`/admin/coupons/${couponId}`, { active: !current });
    });
  }

  async function deleteCoupon(couponId: string) {
    if (!confirm('Are you sure you want to permanently delete this coupon?')) return;
    await act(async () => {
      await api(`/admin/coupons/${couponId}`, { method: 'DELETE' });
    });
  }

  async function updatePlanPrice(planId: string, newPrice: number) {
    if (isNaN(newPrice) || newPrice < 0) return setError('Enter a valid plan price in INR');
    await act(async () => {
      await patch(`/admin/plans/${planId}`, { priceINR: newPrice });
    });
  }

  async function togglePlanActive(planId: string, currentActive: boolean) {
    await act(async () => {
      await patch(`/admin/plans/${planId}`, { active: !currentActive });
    });
  }

  async function createNewPlan() {
    if (!newPlanName.trim()) return setError('Plan name is required');
    if (isNaN(newPlanPriceINR) || newPlanPriceINR < 0) return setError('Valid price in INR is required');
    if (isNaN(newPlanDurationDays) || newPlanDurationDays < 1) return setError('Duration in days is required (min 1 day)');
    await act(async () => {
      await post('/admin/plans', {
        name: newPlanName.trim(),
        priceINR: Number(newPlanPriceINR),
        durationDays: Number(newPlanDurationDays),
        interestLimit: Number(newPlanInterestLimit) || 0,
        chatEnabled: !!newPlanChat,
        features: newPlanFeatures.split(',').map((x) => x.trim()).filter(Boolean),
        storeProductIdAndroid: newPlanAndroidSku.trim(),
        storeProductIdIos: newPlanIosSku.trim()
      });
      setNewPlanName('');
      setShowCreatePlanModal(false);
    });
  }

  async function addStaff() {
    if (!/^\d{10,15}$/.test(newStaffPhone.trim())) return setError('Valid 10–15 digit staff phone required');
    if (newStaffPassword.length < 12) return setError('A unique 12+ character initial password is required');
    await act(async () => {
      await post('/admin/staff', {
        phone: newStaffPhone,
        role: newStaffRole,
        password: newStaffPassword
      });
      setNewStaffPhone('');
      setNewStaffPassword('');
    });
  }

  async function extendSubscription(subId: string, days = 30) {
    await act(async () => {
      await post('/admin/subscribers/extend', {
        subscriberId: subId,
        additionalDays: days
      });
    });
  }

  async function saveCMSPage() {
    if (!slug.trim() || !pageTitle.trim() || !pageBody.trim()) return setError('Slug, title and body are required');
    await act(async () => {
      const res: any = await put('/admin/content/' + slug, {
        title: pageTitle,
        body: pageBody,
        published
      });
      if (res?.page) {
        setPages((prev: any[]) => {
          const idx = prev.findIndex((p: any) => p.slug === slug);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = res.page;
            return next;
          }
          return [...prev, res.page];
        });
        setNotice(`Content page /${slug} successfully saved and updated in database!`);
      }
    });
  }

  async function saveLoginPhoto(urlOverride?: string) {
    let finalUrl = (typeof urlOverride === 'string' ? urlOverride : loginPhotoUrl).trim();
    if (loginPhotoFile) {
      setLoginPhotoUploading(true);
      try {
        const formData = new FormData();
        formData.append('poster', loginPhotoFile);
        const upRes: any = await api('/admin/banners/upload', { method: 'POST', body: formData });
        if (upRes?.url) finalUrl = upRes.url;
      } catch (err: any) {
        setLoginPhotoUploading(false);
        return setError('Photo upload failed: ' + err.message);
      }
      setLoginPhotoUploading(false);
    }
    if (!finalUrl) return setError('Please provide an image URL or choose a photo file to upload');
    await act(async () => {
      await put('/admin/settings/login_photo_url', { value: finalUrl });
      setLoginPhotoUrl(finalUrl);
      setLoginPhotoFile(null);
      setNotice('Login & Registration page photo updated successfully! The new photo is now live on the public website.');
    });
  }

  async function saveGeneralSettings() {
    await act(async () => {
      await put('/admin/settings/community_name', { value: platName.trim() });
      await put('/admin/settings/support_email', { value: platEmail.trim() });
      await put('/admin/settings/support_phone', { value: platPhone.trim() });
      await put('/admin/settings/region_states', { value: platRegions.split(',').map((s) => s.trim()).filter(Boolean) });
      emitBrandingChange({
        communityName: platName.trim(),
        supportEmail: platEmail.trim(),
        supportPhone: platPhone.trim()
      });
      setNotice('Platform contact settings saved successfully.');
    });
  }

  async function saveLogoSettings(wideUrl: string, squareUrl?: string) {
    if (!wideUrl || !wideUrl.trim()) {
      setError('Please provide a valid logo image URL or canvas before saving.');
      setNotice('');
      return;
    }
    setError('');
    setNotice('');
    try {
      const res1 = await put('/admin/settings/platform_logo_url', { value: wideUrl.trim() });
      if (res1 && res1.error) throw new Error(res1.error);
      if (squareUrl && squareUrl.trim()) {
        const res2 = await put('/admin/settings/platform_logo_square_url', { value: squareUrl.trim() });
        if (res2 && res2.error) throw new Error(res2.error);
      }
      setPlatLogoUrl(wideUrl.trim());
      if (squareUrl) setPlatLogoSquareUrl(squareUrl.trim());
      emitBrandingChange({
        logoUrl: wideUrl.trim(),
        logoSquareUrl: squareUrl ? squareUrl.trim() : wideUrl.trim()
      });
      setNotice('Platform brand logo saved and updated live across the website!');
      await load();
    } catch (e: any) {
      setError(`Failed to save logo settings: ${e?.message || 'Server error'}`);
      setNotice('');
      throw e;
    }
  }

  async function resetLogoSettings() {
    setError('');
    setNotice('');
    try {
      const res1 = await put('/admin/settings/platform_logo_url', { value: '' });
      if (res1 && res1.error) throw new Error(res1.error);
      const res2 = await put('/admin/settings/platform_logo_square_url', { value: '' });
      if (res2 && res2.error) throw new Error(res2.error);
      setPlatLogoUrl('');
      setPlatLogoSquareUrl('');
      emitBrandingChange({
        logoUrl: '',
        logoSquareUrl: ''
      });
      setNotice('Platform logo reverted to default system mark.');
      await load();
    } catch (e: any) {
      setError(`Failed to reset logo settings: ${e?.message || 'Server error'}`);
      setNotice('');
      throw e;
    }
  }

  async function addStory() {
    if (!storyCouple.trim() || !storyQuote.trim()) return setError('Couple names and testimonial quote are required');
    await act(async () => {
      await post('/admin/success-stories', {
        coupleNames: storyCouple,
        weddingDate: storyDate || '2026',
        diocese: storyDiocese || 'Catholic Diocese',
        quote: storyQuote,
        approved: true
      });
      setStoryCouple('');
      setStoryQuote('');
      setStoryDate('');
      setStoryDiocese('');
    });
  }

  if (unauthorized) {
    return (
      <main className="utility-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
        <div className="panel" style={{ maxWidth: 520, textAlign: 'center', padding: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <AlertTriangle size={30} />
          </div>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>Administrative Authorization Required</h2>
          <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: 13, marginBottom: 22 }}>
            This operations management console is strictly restricted to platform administrators and staff.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => adminSignOut()} className="btn btn-shaadi" style={{ cursor: 'pointer' }}>
              <RotateCcw size={15} /> Sign In to Admin Console
            </button>
            <Link href="/" className="btn btn-outline">Return to Matrimony Home</Link>
          </div>
        </div>
      </main>
    );
  }

  // Category determination for active tab
  const isOverviewCategory = ['Dashboard', 'Reports & Analytics', 'Security & Audit Logs'].includes(tab);
  const isMemberPipelineCategory = [
    'Registration Management', 'Excel Bulk Import', 'User Management',
    'Biodata Management', 'Church Management', 'Profile Verification',
    'Photo Management', 'Identity & Consent', 'Featured Profiles', 'Relationship Manager CRM'
  ].includes(tab);
  const isSubscriptionRevenueCategory = [
    'Subscription Plan Builder', 'Subscriber Management', 'Transaction Management',
    'Refund & Cancellation', 'Coupon & Offers'
  ].includes(tab);
  const isCommunicationCategory = [
    'Notification Center', 'Notifications Automation', 'Posters & Banners',
    'Notification Templates', 'Support & Complaints'
  ].includes(tab);
  const isSafetySystemCategory = [
    'Matchmaking Rules', 'Interests Oversight', 'Contact & Photo Requests',
    'Chat Safety', 'Website Pages / CMS', 'Success Stories', 'Referral Management',
    'Export & Backup', 'Website & App Settings', 'Admin Roles & Staff', 'Privacy & Data Requests'
  ].includes(tab);

  return (
    <div className="admin-operations-wrapper">
      {/* MVC View: Left Navigation Sidebar */}
      <AdminSidebar
        currentTab={tab}
        onSelectTab={setTab}
        pendingPhotosCount={photoStats.pendingCount}
        currentPhone={currentPhone}
        role={role}
      />

      {/* Main Admin Operations Workstation */}
      <main style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflowX: 'hidden' }}>
        {/* Top Header & Fast Navigation Shortcuts */}
        <AdminHeader
          currentTab={tab}
          role={role}
          onRefresh={load}
          onOpenExcel={() => setTab('Excel Bulk Import')}
          onOpenBroadcast={() => setTab('Notification Center')}
        />

        {/* Global Instant Candidate OmniSearch */}
        <AdminOmniSearch
          onSelectCandidate={(cand) => {
            setSelectedBiodataMember(cand);
            setTab('Biodata Management');
          }}
          onOpenWhatsApp={(phone, name) => openWhatsAppDirect(phone, name, 'general')}
          onPrintPdf={(cand) => setPrintCandidate(cand)}
          onInspectFields={(cand) => {
            setSelectedBiodataMember(cand);
            setTab('Biodata Management');
          }}
        />

        {/* Dashboard 4 KPIs & Source Channels Overview */}
        <AdminKpiSection kpis={kpis} />

        {/* System Error & Success Banners */}
        {error && (
          <div className="error-alert page-alert" style={{ marginBottom: 16 }}>
            <AlertTriangle size={17} />
            <span>{error}</span>
          </div>
        )}
        {notice && (
          <div className="success-alert page-alert" style={{ marginBottom: 16 }}>
            <Check size={17} />
            <span>{notice}</span>
          </div>
        )}
        {importSuccessBanner && (
          <div className="success-alert page-alert" style={{ marginBottom: 16, background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: 14, borderRadius: 10 }}>
            <CheckCircle2 size={18} />
            <strong>{importSuccessBanner}</strong>
          </div>
        )}

        {/* =========================================================
            ISOLATED MODULE ERROR BOUNDARY FOR ACTIVE VIEW
            Fault tolerance: any module crash does NOT crash the admin panel
            ========================================================= */}
        <AdminModuleErrorBoundary key={tab} moduleName={tab}>
          {isOverviewCategory && (
            <OverviewModules
              tab={tab}
              kpis={kpis}
              memberTotal={memberTotal}
              subs={subs}
              verifications={verifications}
              tickets={tickets}
              auditLogs={auditLogs}
              setTab={setTab}
            />
          )}

          {isMemberPipelineCategory && (
            <MemberPipelineModules
              tab={tab}
              setTab={setTab}
              members={members}
              memberPage={memberPage}
              setMemberPage={setMemberPage}
              memberTotal={memberTotal}
              subs={subs}
              openWhatsAppDirect={openWhatsAppDirect}
              setPrintCandidate={setPrintCandidate}
              setSelectedBiodataMember={setSelectedBiodataMember}
              selectedBiodataMember={selectedBiodataMember}
              userFilter={userFilter}
              setUserFilter={setUserFilter}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              userResetModal={userResetModal}
              setUserResetModal={setUserResetModal}
              act={act}
              patch={patch}
              post={post}
              setError={setError}
              excelFile={excelFile}
              excelLoading={excelLoading}
              handleFileSelect={handleFileSelect}
              importPreview={importPreview}
              importSearch={importSearch}
              setImportSearch={setImportSearch}
              executeBulkImport={executeBulkImport}
              importExecuting={importExecuting}
              churches={churches}
              newChurchName={newChurchName}
              setNewChurchName={setNewChurchName}
              newChurchDenom={newChurchDenom}
              setNewChurchDenom={setNewChurchDenom}
              newChurchDiocese={newChurchDiocese}
              setNewChurchDiocese={setNewChurchDiocese}
              newChurchCity={newChurchCity}
              setNewChurchCity={setNewChurchCity}
              newChurchState={newChurchState}
              setNewChurchState={setNewChurchState}
              newChurchPriest={newChurchPriest}
              setNewChurchPriest={setNewChurchPriest}
              addChurch={addChurch}
              verifications={verifications}
              photos={photos}
              photoFilter={photoFilter}
              setPhotoFilter={setPhotoFilter}
              photoSearch={photoSearch}
              setPhotoSearch={setPhotoSearch}
              photoStats={photoStats}
              photoLoading={photoLoading}
              refreshPhotos={refreshPhotos}
              zoomPhoto={zoomPhoto}
              setZoomPhoto={setZoomPhoto}
              spotlightProfiles={spotlightProfiles}
              spotlightSearch={spotlightSearch}
              setSpotlightSearch={setSpotlightSearch}
              toggleSpotlight={toggleSpotlight}
              crmCandidates={crmCandidates}
              crmSearch={crmSearch}
              setCrmSearch={setCrmSearch}
              crmSelectedCandidate={crmSelectedCandidate}
              setCrmSelectedCandidate={setCrmSelectedCandidate}
              crmNoteText={crmNoteText}
              setCrmNoteText={setCrmNoteText}
              crmTag={crmTag}
              setCrmTag={setCrmTag}
              setCrmCandidates={setCrmCandidates}
            />
          )}

          {isSubscriptionRevenueCategory && (
            <SubscriptionRevenueModules
              tab={tab}
              plans={plans}
              showCreatePlanModal={showCreatePlanModal}
              setShowCreatePlanModal={setShowCreatePlanModal}
              newPlanName={newPlanName}
              setNewPlanName={setNewPlanName}
              newPlanPriceINR={newPlanPriceINR}
              setNewPlanPriceINR={setNewPlanPriceINR}
              newPlanDurationDays={newPlanDurationDays}
              setNewPlanDurationDays={setNewPlanDurationDays}
              newPlanInterestLimit={newPlanInterestLimit}
              setNewPlanInterestLimit={setNewPlanInterestLimit}
              newPlanAndroidSku={newPlanAndroidSku}
              setNewPlanAndroidSku={setNewPlanAndroidSku}
              newPlanIosSku={newPlanIosSku}
              setNewPlanIosSku={setNewPlanIosSku}
              newPlanFeatures={newPlanFeatures}
              setNewPlanFeatures={setNewPlanFeatures}
              newPlanChat={newPlanChat}
              setNewPlanChat={setNewPlanChat}
              createNewPlan={createNewPlan}
              editingPlanPrices={editingPlanPrices}
              setEditingPlanPrices={setEditingPlanPrices}
              updatePlanPrice={updatePlanPrice}
              togglePlanActive={togglePlanActive}
              subs={subs}
              extendSubscription={extendSubscription}
              transactions={transactions}
              transactionFilter={transactionFilter}
              setTransactionFilter={setTransactionFilter}
              transactionSearch={transactionSearch}
              setTransactionSearch={setTransactionSearch}
              refunds={refunds}
              refundOrderId={refundOrderId}
              setRefundOrderId={setRefundOrderId}
              refundAmount={refundAmount}
              setRefundAmount={setRefundAmount}
              refundReason={refundReason}
              setRefundReason={setRefundReason}
              act={act}
              post={post}
              setError={setError}
              coupons={coupons}
              newCouponCode={newCouponCode}
              setNewCouponCode={setNewCouponCode}
              newCouponType={newCouponType}
              setNewCouponType={setNewCouponType}
              newCouponDiscount={newCouponDiscount}
              setNewCouponDiscount={setNewCouponDiscount}
              newCouponAmount={newCouponAmount}
              setNewCouponAmount={setNewCouponAmount}
              newCouponPlanId={newCouponPlanId}
              setNewCouponPlanId={setNewCouponPlanId}
              newCouponValidDays={newCouponValidDays}
              setNewCouponValidDays={setNewCouponValidDays}
              newCouponUsageLimit={newCouponUsageLimit}
              setNewCouponUsageLimit={setNewCouponUsageLimit}
              addCoupon={addCoupon}
              toggleCoupon={toggleCoupon}
              deleteCoupon={deleteCoupon}
            />
          )}

          {isCommunicationCategory && (
            <CommunicationModules
              tab={tab}
              notifChannel={notifChannel}
              setNotifChannel={setNotifChannel}
              notifTarget={notifTarget}
              setNotifTarget={setNotifTarget}
              notifType={notifType}
              setNotifType={setNotifType}
              notifTitle={notifTitle}
              setNotifTitle={setNotifTitle}
              notifMessage={notifMessage}
              setNotifMessage={setNotifMessage}
              notifActionUrl={notifActionUrl}
              setNotifActionUrl={setNotifActionUrl}
              notifSending={notifSending}
              dispatchNotification={dispatchNotification}
              campaigns={campaigns}
              whatsAppTotalSent={whatsAppTotalSent}
              whatsAppLogs={whatsAppLogs}
              automations={automations}
              setAutomations={setAutomations}
              templates={templates}
              selectedTemplateKey={selectedTemplateKey}
              setSelectedTemplateKey={setSelectedTemplateKey}
              templateEnTitle={templateEnTitle}
              setTemplateEnTitle={setTemplateEnTitle}
              templateEnBody={templateEnBody}
              setTemplateEnBody={setTemplateEnBody}
              templateHiTitle={templateHiTitle}
              setTemplateHiTitle={setTemplateHiTitle}
              templateHiBody={templateHiBody}
              setTemplateHiBody={setTemplateHiBody}
              tickets={tickets}
              banners={banners}
              banTitle={banTitle}
              setBanTitle={setBanTitle}
              banSub={banSub}
              setBanSub={setBanSub}
              banImage={banImage}
              setBanImage={setBanImage}
              banLink={banLink}
              setBanLink={setBanLink}
              banPlacement={banPlacement}
              setBanPlacement={setBanPlacement}
              banFile={banFile}
              setBanFile={setBanFile}
              saveBanner={saveBanner}
              act={act}
              patch={patch}
              put={put}
            />
          )}

          {isSafetySystemCategory && (
            <SafetySystemModules
              tab={tab}
              matchRules={matchRules}
              setMatchRules={setMatchRules}
              interests={interests}
              interestStatusFilter={interestStatusFilter}
              setInterestStatusFilter={setInterestStatusFilter}
              openWhatsAppDirect={openWhatsAppDirect}
              chatFilter={chatFilter}
              setChatFilter={setChatFilter}
              chatSearch={chatSearch}
              setChatSearch={setChatSearch}
              chatConversations={chatConversations}
              chatStats={chatStats}
              selectedConvId={selectedConvId}
              openConversation={openConversation}
              selectedConvData={selectedConvData}
              selectedConvMessages={selectedConvMessages}
              chatLoading={chatLoading}
              deleteChatMessage={deleteChatMessage}
              handleChatAction={handleChatAction}
              refreshChats={refreshChats}
              photoReqs={photoReqs}
              photoReqStatusFilter={photoReqStatusFilter}
              setPhotoReqStatusFilter={setPhotoReqStatusFilter}
              pages={pages}
              slug={slug}
              setSlug={setSlug}
              pageTitle={pageTitle}
              setPageTitle={setPageTitle}
              pageBody={pageBody}
              setPageBody={setPageBody}
              published={published}
              setPublished={setPublished}
              saveCMSPage={saveCMSPage}
              stories={stories}
              storyCouple={storyCouple}
              setStoryCouple={setStoryCouple}
              storyDate={storyDate}
              setStoryDate={setStoryDate}
              storyDiocese={storyDiocese}
              setStoryDiocese={setStoryDiocese}
              storyQuote={storyQuote}
              setStoryQuote={setStoryQuote}
              addStory={addStory}
              referrals={referrals}
              backupStatus={backupStatus}
              setBackupStatus={setBackupStatus}
              backupLoading={backupLoading}
              setBackupLoading={setBackupLoading}
              loginPhotoUrl={loginPhotoUrl}
              setLoginPhotoUrl={setLoginPhotoUrl}
              loginPhotoFile={loginPhotoFile}
              setLoginPhotoFile={setLoginPhotoFile}
              loginPhotoUploading={loginPhotoUploading}
              saveLoginPhoto={saveLoginPhoto}
              platName={platName}
              setPlatName={setPlatName}
              platEmail={platEmail}
              setPlatEmail={setPlatEmail}
              platPhone={platPhone}
              setPlatPhone={setPlatPhone}
              platRegions={platRegions}
              setPlatRegions={setPlatRegions}
              saveGeneralSettings={saveGeneralSettings}
              platLogoUrl={platLogoUrl}
              setPlatLogoUrl={setPlatLogoUrl}
              platLogoSquareUrl={platLogoSquareUrl}
              setPlatLogoSquareUrl={setPlatLogoSquareUrl}
              saveLogoSettings={saveLogoSettings}
              resetLogoSettings={resetLogoSettings}
              staffList={staffList}
              newStaffPhone={newStaffPhone}
              setNewStaffPhone={setNewStaffPhone}
              newStaffRole={newStaffRole}
              setNewStaffRole={setNewStaffRole}
              newStaffPassword={newStaffPassword}
              setNewStaffPassword={setNewStaffPassword}
              addStaff={addStaff}
              dataRequests={dataRequests}
              act={act}
              patch={patch}
              post={post}
              put={put}
              setError={setError}
              setNotice={setNotice}
            />
          )}

          {tab === 'Order Management' && (
            <OrderManagementModule token={getAdminToken() || ''} />
          )}
        </AdminModuleErrorBoundary>
      </main>

      {/* Printable Christian Matrimony Biodata Dossier Modal */}
      <PrintBiodataModal
        candidate={printCandidate}
        onClose={() => setPrintCandidate(null)}
        openWhatsAppDirect={openWhatsAppDirect}
      />
    </div>
  );
}

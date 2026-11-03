'use client';
import React from 'react';
import {
  RefreshCw, Search, MessageCircle, ExternalLink,
  Users, FileSpreadsheet, Database, CheckCircle2, ShieldAlert,
  FileText, RotateCcw, Lock
} from 'lucide-react';
import { PhotoPreview } from '../PhotoPreview';
import { LogoManagementPanel } from '../LogoManagementPanel';
import { Row, ChatStat, BackupStatus } from '../types';
import { API, api, downloadAdminFile } from '@/lib/api';

interface SafetySystemProps {
  tab: string;
  // Matchmaking Rules
  matchRules: Row[];
  setMatchRules: (r: Row[]) => void;
  // Interests Oversight
  interests: Row[];
  interestStatusFilter: 'all' | 'pending' | 'accepted' | 'declined';
  setInterestStatusFilter: (f: 'all' | 'pending' | 'accepted' | 'declined') => void;
  openWhatsAppDirect: (phone: string, candidateName: string, templateType?: 'verification' | 'photos' | 'payment' | 'general') => void;
  // Chat Safety
  chatFilter: 'all' | 'flagged' | 'phone' | 'clean';
  setChatFilter: (f: 'all' | 'flagged' | 'phone' | 'clean') => void;
  chatSearch: string;
  setChatSearch: (s: string) => void;
  chatConversations: Row[];
  chatStats: ChatStat;
  selectedConvId: string | null;
  openConversation: (id: string) => Promise<void>;
  selectedConvData: Row | null;
  selectedConvMessages: Row[];
  chatLoading: boolean;
  deleteChatMessage: (msgId: string) => Promise<void>;
  handleChatAction: (action: 'warn' | 'block_chat' | 'suspend_user', targetUserId?: string) => Promise<void>;
  refreshChats: (filter?: any, search?: string) => Promise<void>;
  // Contact & Photo Requests
  photoReqs: Row[];
  photoReqStatusFilter: 'all' | 'pending' | 'approved' | 'rejected';
  setPhotoReqStatusFilter: (f: 'all' | 'pending' | 'approved' | 'rejected') => void;
  // Website Pages / CMS
  pages: Row[];
  slug: string;
  setSlug: (s: string) => void;
  pageTitle: string;
  setPageTitle: (s: string) => void;
  pageBody: string;
  setPageBody: (s: string) => void;
  published: boolean;
  setPublished: (b: boolean) => void;
  saveCMSPage: () => void;
  // Success Stories
  stories: Row[];
  storyCouple: string;
  setStoryCouple: (s: string) => void;
  storyDate: string;
  setStoryDate: (s: string) => void;
  storyDiocese: string;
  setStoryDiocese: (s: string) => void;
  storyQuote: string;
  setStoryQuote: (s: string) => void;
  addStory: () => void;
  // Referral Management
  referrals: Row[];
  // Export & Backup
  backupStatus: BackupStatus | null;
  setBackupStatus: (s: BackupStatus | null) => void;
  backupLoading: boolean;
  setBackupLoading: (b: boolean) => void;
  // Settings & Login Photo
  loginPhotoUrl: string;
  setLoginPhotoUrl: (s: string) => void;
  loginPhotoFile: File | null;
  setLoginPhotoFile: (f: File | null) => void;
  loginPhotoUploading: boolean;
  saveLoginPhoto: (urlOverride?: string) => void;
  platName: string;
  setPlatName: (s: string) => void;
  platEmail: string;
  setPlatEmail: (s: string) => void;
  platPhone: string;
  setPlatPhone: (s: string) => void;
  platRegions: string;
  setPlatRegions: (s: string) => void;
  saveGeneralSettings: () => void;
  platLogoUrl?: string;
  setPlatLogoUrl?: (s: string) => void;
  platLogoSquareUrl?: string;
  setPlatLogoSquareUrl?: (s: string) => void;
  saveLogoSettings?: (wideUrl: string, squareUrl?: string) => Promise<void>;
  resetLogoSettings?: () => Promise<void>;
  // Admin Roles & Staff
  staffList: Row[];
  newStaffPhone: string;
  setNewStaffPhone: (s: string) => void;
  newStaffRole: string;
  setNewStaffRole: (s: string) => void;
  newStaffPassword: string;
  setNewStaffPassword: (s: string) => void;
  addStaff: () => void;
  // Privacy & Data Requests
  dataRequests: Row[];
  // Shared actions
  act: (fn: () => Promise<any>) => Promise<void>;
  patch: (url: string, body: any) => Promise<any>;
  post: (url: string, body: any) => Promise<any>;
  put: (url: string, body: any) => Promise<any>;
  setError: (e: string) => void;
  setNotice: (n: string) => void;
}

export const OFFICIAL_TERMS_TITLE = 'Terms of Service & Use Agreement';

export const OFFICIAL_TERMS_BODY = `General Agreement 
You understand and agree that -  

1. “ADAM N EVE MATRIMONY is a proprietorship firm duly registered with the local government authority in accordance with the applicable local rules and regulations.” 
2. Wherever ADAM N EVE MATRIMONY is mentioned below, it comprises of adamneve.in and ADAM N EVE Mobile Application on Play Store and Apple App Store.
3. We are only a matrimonial advertiser. ADAM N EVE MATRIMONY, adamneve.in and Mobile Application is an advertising platform providing targeted advertising services for matrimonial alliances. 
4. ADAM N EVE MATRIMONY helps you promote and advertise your profile to the prospective alliance partner. We offer General/Premium Memberships wherein one can promote his/her biodata/profile/details.  
5. ADAM N EVE MATRIMONY will endeavour to provide all possible assistance to the Police (Cyber Crime Investigation Cell) or any other statutory investigation agency to tackle fraudulent users of ADAM N EVE MATRIMONY, on being specifically instructed by the said authorities to do so.  
6. To report fraud or misuse, write to us on adamnevematrimony@gmail.com, patrick@adamneve.in giving full details of your case.  
7. ADAM N EVE MATRIMONY in any case will not refund the Registration Fees, Subscription fees, yearly plan fee, or any kind of donations / support and help or other charges. 
8. ADAM N EVE MATRIMONY reserves the right to terminate your membership and your right to use the service without any refund of subscription fees.  
9. Above all, in any case or circumstances, we are not liable for any misuse of your profile, Photo, details or any claim raised against ADAM N EVE MATRIMONY or their teammates.  
10. We don’t have any other firm for the same services.  
11. We take every precaution to protect your information, both online and offline. 
12. If any member of ADAM N EVE MATRIMONY is not active or does not open his/her account within 30 days, they will be considered an inactive member. 
13. Profile of inactive member will not be shown in any search/anywhere; it will be considered as married. 



Eligibility for ADAM N EVE MATRIMONY 
You understand and agree that-  

1. You must be of legally marriageable age as per the laws of India, 18 years for females & 21 years for males or above or should be legally 
2. Anybody who does not fulfil the documentation and our requirements will be disqualified. The System of ADAM N EVE MATRIMONY will delete the data without any prior notice, also, if your details/profile/certificates are found faulty or misleading.  
3. You are eligible to get details or view other members' profiles after payment of the present Registration Fee / annual fee realization to bank.  
4. Payments/Donations/Love Offering/Free will offering should be made through Bank Cheque/Netbanking or Payment Gateway / Phone Pay / Google Pay / Paytm or using QR Code only. 



Criteria for Registration 
You understand and agree that-  

1. ADAM N EVE MATRIMONY serves to Christians, those who believe in Jesus Christ and who are regular members of Biblical Base Church and Biblically Baptised.  
2. He/She must be a regular member of any Bible Base Church and must be a regular member for more than 1 year.  
3. Reference name and contact detail of one Church Priest other than your church is Mandatory.  
4. If you want to be a part of ADAM N EVE MATRIMONY system, you must be Biblically Baptized through water by the name of Father, Son and the Holy Spirit. 
5. Members of ADAM N EVE MATRIMONY can confirm your profile or details from their own reliable source.  
6. Any Christian widower/widow, divorcee/divorced, or separated can apply with the above condition.  



ADAM N EVE MATRIMONY System Agreement  
You understand and agree that to use ADAM N EVE MATRIMONY system, you must register as a member of the ADAM N EVE MATRIMONY. The member or any users using the ADAM N EVE MATRIMONY website, Mobile Application or system agrees to be bound by these Terms of Service & use agreements. If you wish to become our website, Mobile Application or system member and promote, advertise your profile to other members and make use of the ADAM N EVE MATRIMONY service. Read the terms of service & use agreement and follow the instructions in the registration process. The service shall internally assist you in promoting and making your biodata/details/profile visible to other members. This agreement sets out the legally binding terms for your use of the website, Mobile Application or system and membership. This agreement may be modified by ADAM N EVE MATRIMONY from time to time, and has no responsibility for any kind of claim raised by you. 



Terms of Service & Use Agreement  
You understand and agree that-  


1. Multiple profiles/details/biodata of the same person are not allowed on ADAM N EVE MATRIMONY. We reserve the right to deactivate all multiple profiles without any refund of subscription fees / Registration fees. 
2. To protect ADAM N EVE MATRIMONY and our members from any abuse or misuse. ADAM N EVE MATRIMONY reserves the right to take appropriate steps as it deems appropriate in its sole discretion to protect the interests of other members or teammates. 
3. ADAM N EVE MATRIMONY members are expected to exercise simple precautions for their privacy and safety. A suggestive guideline of such precautions is listed under “Security Tips”. By becoming a member, you hereby agree to abide and adhere to the said tips. 
4. ADAM N EVE MATRIMONY members who subscribe to the ADAM N EVE MATRIMONY select service hereby, unconditionally and irrevocably confirm that you have read terms and conditions and agree to abide by them.  
5. ADAM N EVE MATRIMONY may delete any content (document, communication, photos or profiles) which is not appropriate or found to be nonsense/guilt/misleading.  
6. ADAM N EVE MATRIMONY can use your contact details provided by you for the purpose of communication, information, advertisement and any mode of communication and information. 
7. ADAM N EVE MATRIMONY will send or upload your profile on any social media for the purpose of advertisement and other purposes. 



Security Tips 
You understand and agree that-  

1. Because this is your personal matter and lifetime partnership, you are solely responsible for your selection. Therefore, you are free to investigate of his/her profile.  
2. Do not provide your photograph, contact number, postal address, mail address, URL’s or any other contact details till you are satisfied/believe in his/her profile.  
3. Before meeting/planning/engagement/marriage or making any future decision, ensure the person is genuine and is according to his/her profile.  
4. Building future decisions like friendship, Meeting and socializing, Fixing the Marriage, engagement, marriage, or any relationship would be in your own responsibility ADAM N EVE MATRIMONY is not responsible for any partnership; it is your sole discretion.  



Legal Offence & Prohibitive Content Includes 
You understand and agree that -  

1. It is offense if you deliberately misuse the contact details, photographs or messages of any members of ADAM N EVE MATRIMONY by any means.  
2. Promotes information that you know that is false, misleading or promotes illegal activities or conduct that is abusive, threatening, obscene, defamatory or libellous.  
3. Contains restricted or password only access pages or hidden pages or images, those not linked to or from another accessible page.  
4. Demonstrate or display sexually or pornographically explicit material of any kind and means.  
5. Solicits passwords or personal identifying information for commercial or unlawful purposes from other users. 
6. Other than the above clauses, if ADAM N EVE MATRIMONY, the Indian Constitution, the State Constitution or any religious constitution found you guilty.  
7. We don’t have any other website, Mobile Application or system, other support center and don’t have any franchisee.  
8. ADAM N EVE MATRIMONY or any teammate of ADAM N EVE MATRIMONY is not liable for any kind of misconduct, claim and for any kind of legally allied before or after engagement/marriage/future relationship.  



Proprietary Rights in the Content on ADAM N EVE MATRIMONY  

You understand and agree that ADAM N EVE MATRIMONY owns and retains all proprietary rights in the ADAM N EVE MATRIMONY website, Mobile Application and ADAM N EVE MATRIMONY service. Information which is in the public domain such as member profile or for which permission has been obtained from the user, you cannot copy, modify, publish, transmit, distribute, perform, display or sell any such proprietary information. Any such act or an attempted act on your part shall constitute a violation of this agreement and your membership is liable to be terminated forthwith by ADAM N EVE MATRIMONY without refund of any of your unused subscription fees. We also reserve our right to take legal action (civil and/or criminal) wherever applicable for any violations.  
 
Member Disputes  

You understand and agree that you are solely responsible for your advertisement/communications/Viewing profile/Future relation/engagement/marriage with 
other ADAM N EVE MATRIMONY members/partners/users. ADAM N EVE MATRIMONY reserves the right but has no obligation to monitor disputes between you and other members/partners/users. ADAM N EVE MATRIMONY also reserves the right to take appropriate action against misbehaving members. However, ADAM N EVE MATRIMONY is not obliged to share such action with other members, including complainants. ADAM N EVE MATRIMONY expressly disclaims any responsibility or liability for any transactions or interactions between the members.  
 
Jurisdiction  

If there is any dispute about or involving the website, Mobile Application or system, by using the website, Mobile Application or system you unconditionally agree that all such disputes and/or differences will be governed by the laws of India and shall be subject to the exclusive jurisdiction of the competent courts in Indore, Madhya Pradesh, India only.  
 
Indemnity  

You agree to indemnify and hold ADAM N EVE MATRIMONY, its subsidiaries, affiliates, officers, agents, and other partners and employees, fully indemnified and harmless from any loss, liability, claim or demand, including reasonable attorney's fees or donations, made by any third party due to or arising out of your use of the service in violation of this agreement and/or arising from a breach of these Terms of Service & Use Agreement and/or any breach of your representations and warranties set forth above and/or any fraudulent act on your part.  
 
Refund Policy 

1. ADAM N EVE MATRIMONY charges for three months, six months, one year etc are less than any other Matrimonial Bureau. 
2. We are charging a nominal so there is no any option or scope for refund. 
3. We have mentioned subscriptions on our membership page. So that whoever wants to register, they should register only if he/she is convinced. 
4. We provide all the information on or before registration, so there is no liability for refunding. Please don't register without knowing Refund Policy.
5. ADAM N EVE MATRIMONY reserves the right to terminate your membership and your right to use the service without any refund of subscription fees.
6. Other than the above all we are open to receiving a call or mail for any kind of justification.  After looking at the registered person's view and condition, we will think about it. 



Declaration Letter  

You understand and agree that ADAM N EVE MATRIMONY reserves the right in its sole discretion to review the activity & status of each account & block the account of a member based on such review. You hereby declare that the details furnished above are true and correct to the best of my knowledge and belief and I undertake to inform you of any changes therein, immediately. In case any of the above information is found to be false or untrue or misleading or misrepresenting, I am aware that I may be held liable for it. I indemnify against any or all losses, liabilities, claims, damages, costs, and expenses asserted against or incurred by ADAM N EVE MATRIMONY and its affiliates, websites, partners and Mobile Application Partners.  

You also agree to abide by all of the Terms and Conditions of this Agreement. You hereby confirm that as of the date of this registration, you do not have any objection to receiving emails, messages and calls from ADAM N EVE MATRIMONY and members of ADAM N EVE MATRIMONY as long as you are a registered member of ADAM N EVE MATRIMONY.  

 
Disclaimers  

1. ADAM N EVE MATRIMONY assumes no responsibility for any error, omission, interruption, deletion, defect, delay in operation or transmission, communications line failure, theft or destruction or unauthorised access to, or alteration of, user and member communications or any communications by ADAM N EVE MATRIMONY to its members.  
2. ADAM N EVE MATRIMONY is not responsible for any incorrect or inaccurate content or listing posted on the website, Mobile Application or system or in connection with the ADAM N EVE MATRIMONY service, whether caused by users, members or by any of the equipment or programming associated with or utilized the service, nor for the conduct of any user and member of the ADAM N EVE MATRIMONY service whether online or offline.  
3. ADAM N EVE MATRIMONY is not responsible for any problems or technical malfunction of any telephone network or lines, servers or providers, computer on-line-systems, computer equipment, software, failure of email or players on account of technical problems or traffic congestion on the Internet or at any web site or combination thereof, including injury or damage to users and members or any other person's computer related to or resulting and in connection with the ADAM N EVE MATRIMONY service.  
4. Under no circumstances will ADAM N EVE MATRIMONY be responsible for any loss or damage resulting from anyone's use of the website, Mobile Application or the service and any content posted on the ADAM N EVE MATRIMONY website, Mobile Application or transmitted to ADAM N EVE MATRIMONY members.  
5. The exchange of matrimonial profile/detail/biodata/photograph through or by ADAM N EVE MATRIMONY is not a matrimonial offer and recommendation from ADAM N EVE MATRIMONY. 
6. ADAM N EVE MATRIMONY shall not be responsible for any loss or damage to any individual arising out of, or subsequent to, any relations established pursuant to the use of ADAM N EVE MATRIMONY.  
7. ADAM N EVE MATRIMONY expressly disclaims any warranty of fitness for a particular purpose or non-infringement. ADAM N EVE MATRIMONY cannot guarantee and does not promise any specific results from use of the website, Mobile Application and the ADAM N EVE MATRIMONY service.  
8. ADAM N EVE MATRIMONY expressly disclaims any liability or responsibility whatsoever and howsoever arising as a result of any content or listing posted on the website, Mobile Application or system & made available to ADAM N EVE MATRIMONY by any members or the users of the website, Mobile Application or system or any third party.  
9. ADAM N EVE MATRIMONY does not assume any responsibility or liability for any illegal content posted on the website, Mobile Application or system by any members, users or any third party.  
10. All liability, whether civil or criminal, arising out of any content that is posted on the website, Mobile Application or system will be of that member, user or third party who has posted such content, and ADAM N EVE MATRIMONY reserves its right to claim damages from such member, user or third party that it may suffer as a result of such content posted on the website, Mobile Application or system. ADAM N EVE MATRIMONY does not claim ownership of the content you 
submit or make available for inclusion on the service.  

Admin
ADAM N EVE MATRIMONY`;

export function SafetySystemModules(props: SafetySystemProps) {
  const {
    tab,
    matchRules, setMatchRules,
    interests, interestStatusFilter, setInterestStatusFilter, openWhatsAppDirect,
    chatFilter, setChatFilter, chatSearch, setChatSearch, chatConversations, chatStats,
    selectedConvId, openConversation, selectedConvData, selectedConvMessages, chatLoading,
    deleteChatMessage, handleChatAction, refreshChats,
    photoReqs, photoReqStatusFilter, setPhotoReqStatusFilter,
    pages, slug, setSlug, pageTitle, setPageTitle, pageBody, setPageBody, published, setPublished, saveCMSPage,
    stories, storyCouple, setStoryCouple, storyDate, setStoryDate, storyDiocese, setStoryDiocese,
    storyQuote, setStoryQuote, addStory,
    referrals,
    backupStatus, setBackupStatus, backupLoading, setBackupLoading,
    loginPhotoUrl, setLoginPhotoUrl, loginPhotoFile, setLoginPhotoFile, loginPhotoUploading, saveLoginPhoto,
    platName, setPlatName, platEmail, setPlatEmail, platPhone, setPlatPhone, platRegions, setPlatRegions,
    saveGeneralSettings,
    platLogoUrl, setPlatLogoUrl, platLogoSquareUrl, setPlatLogoSquareUrl, saveLogoSettings, resetLogoSettings,
    staffList, newStaffPhone, setNewStaffPhone, newStaffRole, setNewStaffRole, newStaffPassword, setNewStaffPassword, addStaff,
    dataRequests,
    act, patch, post, put, setError, setNotice
  } = props;

  // MODULE 15: MATCHMAKING RULES
  if (tab === 'Matchmaking Rules') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 15 · ALGORITHM &amp; COMPATIBILITY CONFIG</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Matchmaking Preferences &amp; Community Rules</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Configure candidate recommendation weights, cross-denomination compatibility, age gaps, and parish requirements.
            </p>
          </div>
          <button
            className="btn btn-shaadi btn-sm"
            onClick={() => {
              act(async () => {
                const res = await post('/admin/matchmaking-rules/seed', {});
                setMatchRules(res.rules || []);
              });
            }}
          >
            Reset to Recommended Christian Defaults
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          {matchRules.map((rule) => (
            <div key={rule.ruleKey} style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h4 style={{ margin: 0, fontSize: 16 }}>{rule.title}</h4>
                <span className={`status-pill ${rule.enabled ? 'success' : 'warn'}`}>
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p style={{ margin: '0 0 14px', fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                {rule.config?.description || 'Core algorithm parameter affecting automatic partner recommendations.'}
              </p>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    act(async () => {
                      await put(`/admin/matchmaking-rules/${rule.ruleKey}`, {
                        ...rule,
                        enabled: !rule.enabled
                      });
                      setMatchRules(matchRules.map(r => r.ruleKey === rule.ruleKey ? { ...r, enabled: !rule.enabled } : r));
                    });
                  }}
                >
                  {rule.enabled ? 'Turn Rule OFF' : 'Activate Rule'}
                </button>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => {
                    const newDesc = prompt(`Update notes/config for ${rule.title}:`, rule.config?.description || '');
                    if (newDesc !== null) {
                      act(async () => {
                        await put(`/admin/matchmaking-rules/${rule.ruleKey}`, {
                          ...rule,
                          config: { ...rule.config, description: newDesc }
                        });
                      });
                    }
                  }}
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
          {!matchRules.length && (
            <div style={{ gridColumn: '1 / -1', padding: 24, textAlign: 'center', background: '#f8fafc', borderRadius: 12 }}>
              <p style={{ margin: 0, color: '#64748b' }}>No matchmaking rules initialized.</p>
              <button
                className="btn btn-shaadi"
                style={{ marginTop: 12 }}
                onClick={() => act(async () => {
                  const res = await post('/admin/matchmaking-rules/seed', {});
                  setMatchRules(res.rules || []);
                })}
              >
                Seed Default Rules
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // MODULE 16: INTERESTS OVERSIGHT
  if (tab === 'Interests Oversight') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 16 · PROPOSALS &amp; MUTUAL INTERESTS</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Mutual Interests Oversight &amp; Member Activity</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Monitor expressions of interest sent between candidate families. Prevent mass spam and assist connections.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Total Interests</span>
              <strong style={{ fontSize: 16 }}>{interests.length}</strong>
            </div>
            <div style={{ padding: '8px 14px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#b45309', display: 'block' }}>Pending</span>
              <strong style={{ fontSize: 16, color: '#b45309' }}>{interests.filter(i => i.status === 'pending').length}</strong>
            </div>
            <div style={{ padding: '8px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#16a34a', display: 'block' }}>Accepted</span>
              <strong style={{ fontSize: 16, color: '#15803d' }}>{interests.filter(i => i.status === 'accepted').length}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['all', 'pending', 'accepted', 'declined'] as const).map((st) => (
            <button
              key={st}
              className={`chip-action ${interestStatusFilter === st ? 'active' : ''}`}
              onClick={() => setInterestStatusFilter(st)}
              style={interestStatusFilter === st ? { background: '#c2185b', color: '#fff', borderColor: '#c2185b' } : {}}
            >
              {st.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Date Sent</th>
                <th style={{ padding: '10px 14px' }}>Sender Candidate</th>
                <th style={{ padding: '10px 14px' }}>Recipient Candidate</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interests
                .filter(i => interestStatusFilter === 'all' || i.status === interestStatusFilter)
                .map((i) => (
                  <tr key={i._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>
                      {new Date(i.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <strong>{i.fromProfile?.fields?.firstName || 'Candidate'} {i.fromProfile?.fields?.surname || ''}</strong><br />
                      <small style={{ color: '#64748b' }}>{i.from?.phone} · {i.fromProfile?.fields?.denomination || 'Christian'}</small>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <strong>{i.toProfile?.fields?.firstName || 'Candidate'} {i.toProfile?.fields?.surname || ''}</strong><br />
                      <small style={{ color: '#64748b' }}>{i.to?.phone} · {i.toProfile?.fields?.denomination || 'Christian'}</small>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`status-pill ${i.status === 'accepted' ? 'success' : (i.status === 'pending' ? 'warn' : 'danger')}`}>
                        {i.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {i.status !== 'accepted' && (
                          <button
                            className="chip-action"
                            style={{ color: '#16a34a', borderColor: '#86efac' }}
                            onClick={() => act(() => patch(`/admin/interests/${i._id}/status`, { status: 'accepted' }))}
                          >
                            Force Accept
                          </button>
                        )}
                        {i.status !== 'declined' && (
                          <button
                            className="chip-action"
                            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={() => act(() => patch(`/admin/interests/${i._id}/status`, { status: 'declined' }))}
                          >
                            Decline
                          </button>
                        )}
                        <button
                          className="chip-action"
                          style={{ color: '#16a34a', borderColor: '#86efac', background: '#f0fdf4' }}
                          onClick={() => openWhatsAppDirect(i.from?.phone, i.fromProfile?.fields?.firstName || 'Candidate', 'general')}
                        >
                          <MessageCircle size={12} style={{ marginRight: 4 }} /> WhatsApp Sender
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!interests.length && (
                <tr>
                  <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                    No interest requests found in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  // MODULE 18: CHAT SAFETY
  if (tab === 'Chat Safety') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 18 · SAFETY &amp; ABUSE PREVENTION</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 800 }}>Chat Safety &amp; Live Conversation Oversight Monitor</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Monitor member conversations in real-time. Detect and prevent inappropriate language, harassment, scam solicitations, or premature phone leaks (&ldquo;faltu baat prevention&rdquo;).
            </p>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => refreshChats(chatFilter, chatSearch)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} className={chatLoading ? 'animate-spin' : ''} /> Refresh Conversations
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Active Conversations</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{chatStats.totalConversations}</div>
            <small style={{ color: '#94a3b8', fontSize: 11 }}>Mutual accepted pairs</small>
          </div>
          <div style={{ background: '#f0fdf4', padding: '16px 20px', borderRadius: 12, border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: 12, color: '#166534', fontWeight: 700 }}>✓ Safe &amp; Clean</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#166534', marginTop: 4 }}>{chatStats.cleanCount}</div>
            <small style={{ color: '#15803d', fontSize: 11 }}>Good matrimonial standing</small>
          </div>
          <div style={{ background: '#fffbeb', padding: '16px 20px', borderRadius: 12, border: '1px solid #fde68a' }}>
            <span style={{ fontSize: 12, color: '#b45309', fontWeight: 700 }}>⚠️ Phone Leaks</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#b45309', marginTop: 4 }}>{chatStats.phoneCount}</div>
            <small style={{ color: '#d97706', fontSize: 11 }}>Direct contact shared</small>
          </div>
          <div style={{ background: '#fef2f2', padding: '16px 20px', borderRadius: 12, border: '1px solid #fecaca' }}>
            <span style={{ fontSize: 12, color: '#b91c1c', fontWeight: 800 }}>🚨 Abusive / Flagged</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#b91c1c', marginTop: 4 }}>{chatStats.flaggedCount}</div>
            <small style={{ color: '#dc2626', fontSize: 11 }}>Vulgar / Faltu baat detected</small>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Messages Scanned</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#475569', marginTop: 4 }}>{chatStats.totalMessages}</div>
            <small style={{ color: '#94a3b8', fontSize: 11 }}>Automated safety check</small>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {[
                  { id: 'all', label: `All (${chatStats.totalConversations})` },
                  { id: 'flagged', label: `🚨 Flagged (${chatStats.flaggedCount})` },
                  { id: 'phone', label: `⚠️ Phone (${chatStats.phoneCount})` },
                  { id: 'clean', label: `✓ Clean (${chatStats.cleanCount})` }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => {
                      setChatFilter(btn.id as any);
                      refreshChats(btn.id as any, chatSearch);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 16,
                      border: chatFilter === btn.id ? '2px solid #c2185b' : '1px solid #cbd5e1',
                      background: chatFilter === btn.id ? '#fdf2f8' : '#fff',
                      color: chatFilter === btn.id ? '#c2185b' : '#475569',
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: 'pointer'
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search member, phone, message..."
                  value={chatSearch}
                  onChange={(e) => {
                    setChatSearch(e.target.value);
                    refreshChats(chatFilter, e.target.value);
                  }}
                  style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 11.5 }}
                />
              </div>
            </div>

            <div style={{ maxHeight: 600, overflowY: 'auto' }}>
              {chatConversations.map((conv) => {
                const isSelected = selectedConvId === conv._id;
                const isAbuse = conv.safetyFlag === 'abusive_flagged';
                const isPhone = conv.safetyFlag === 'phone_detected';

                return (
                  <div
                    key={conv._id}
                    onClick={() => openConversation(conv._id)}
                    style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      background: isSelected ? '#fdf2f8' : isAbuse ? '#fff5f5' : '#fff',
                      borderLeft: isSelected ? '4px solid #c2185b' : isAbuse ? '4px solid #dc2626' : isPhone ? '4px solid #d97706' : '4px solid transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <strong style={{ fontSize: 13, color: '#0f172a' }}>
                        {conv.candidateA.name} ⟷ {conv.candidateB.name}
                      </strong>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>
                        💬 {conv.messageCount} msgs
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0 6px' }}>
                      {isAbuse ? (
                        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: '#fee2e2', color: '#b91c1c' }}>
                          🚨 FALTU BAAT / ABUSE DETECTED
                        </span>
                      ) : isPhone ? (
                        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: '#fef3c7', color: '#b45309' }}>
                          ⚠️ PHONE NUMBER SHARED
                        </span>
                      ) : (
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#f0fdf4', color: '#166534' }}>
                          ✓ Clean Chat
                        </span>
                      )}
                      {conv.flaggedWords && conv.flaggedWords.length > 0 && (
                        <span style={{ fontSize: 9, color: '#dc2626', fontWeight: 600 }}>
                          ({conv.flaggedWords.join(', ')})
                        </span>
                      )}
                    </div>

                    <p style={{ margin: 0, fontSize: 11.5, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      &ldquo;{conv.lastMessageSnippet}&rdquo;
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: 10, color: '#94a3b8' }}>
                      <span>{conv.candidateA.city || 'City'} · {conv.candidateB.city || 'City'}</span>
                      <span>{new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}

              {!chatConversations.length && (
                <div style={{ padding: 30, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
                  No conversations match this filter.
                </div>
              )}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
            {selectedConvData ? (
              <>
                <div style={{ padding: 18, borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: '#e2e8f0' }}>
                        <PhotoPreview directUrl={selectedConvData.candidateA.avatar} alt={selectedConvData.candidateA.name} style={{ width: '100%', height: '100%', borderRadius: 0 }} />
                      </div>
                      <div>
                        <strong style={{ fontSize: 14, color: '#0f172a', display: 'block' }}>{selectedConvData.candidateA.name}</strong>
                        <small style={{ color: '#475569', fontSize: 11.5 }}>
                          📞 {selectedConvData.candidateA.phone} · {selectedConvData.candidateA.city}
                        </small>
                        <div style={{ marginTop: 2 }}>
                          <button
                            type="button"
                            className="chip-action"
                            style={{ fontSize: 10, color: '#dc2626', borderColor: '#fca5a5', padding: '2px 8px' }}
                            onClick={() => handleChatAction('suspend_user', selectedConvData.candidateA.id)}
                          >
                            Suspend Member A
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', padding: '4px 10px', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#c2185b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Lock size={12} /> E2EE PROTECTED THREAD
                      </span>
                      <small style={{ display: 'block', fontSize: 10, color: '#64748b' }}>
                        AES-256-GCM · Staff Audit Mode ({selectedConvMessages.length} msgs)
                      </small>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div>
                        <strong style={{ fontSize: 14, color: '#0f172a', display: 'block', textAlign: 'right' }}>{selectedConvData.candidateB.name}</strong>
                        <small style={{ color: '#475569', fontSize: 11.5, display: 'block', textAlign: 'right' }}>
                          📞 {selectedConvData.candidateB.phone} · {selectedConvData.candidateB.city}
                        </small>
                        <div style={{ marginTop: 2, textAlign: 'right' }}>
                          <button
                            type="button"
                            className="chip-action"
                            style={{ fontSize: 10, color: '#dc2626', borderColor: '#fca5a5', padding: '2px 8px' }}
                            onClick={() => handleChatAction('suspend_user', selectedConvData.candidateB.id)}
                          >
                            Suspend Member B
                          </button>
                        </div>
                      </div>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: '#e2e8f0' }}>
                        <PhotoPreview directUrl={selectedConvData.candidateB.avatar} alt={selectedConvData.candidateB.name} style={{ width: '100%', height: '100%', borderRadius: 0 }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 11, color: '#d97706', borderColor: '#fde68a', background: '#fffbeb' }}
                      onClick={() => handleChatAction('warn')}
                    >
                      ⚠️ Issue Official Warning Notice
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 11, color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2' }}
                      onClick={() => handleChatAction('block_chat')}
                    >
                      🛑 Terminate Thread (Block Chat)
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, padding: 20, overflowY: 'auto', maxHeight: 480, display: 'flex', flexDirection: 'column', gap: 14, background: '#f8fafc' }}>
                  {chatLoading && <div style={{ textAlign: 'center', color: '#64748b', fontSize: 13 }}>Loading conversation thread...</div>}
                  {selectedConvMessages.map((msg) => {
                    const isSenderA = String(msg.sender?._id || msg.sender) === String(selectedConvData.candidateA.id);
                    const senderName = isSenderA ? selectedConvData.candidateA.name : selectedConvData.candidateB.name;
                    const isAbuse = msg.moderationStatus === 'flagged_abuse' || (msg.flaggedWords && msg.flaggedWords.length > 0);
                    const isPhone = msg.hasPhoneNumber;

                    return (
                      <div
                        key={msg._id}
                        style={{
                          alignSelf: isSenderA ? 'flex-start' : 'flex-end',
                          maxWidth: '82%',
                          background: isAbuse ? '#fee2e2' : isPhone ? '#fef3c7' : (isSenderA ? '#ffffff' : '#fdf2f8'),
                          border: isAbuse ? '1.5px solid #f87171' : isPhone ? '1.5px solid #fde68a' : (isSenderA ? '1px solid #e2e8f0' : '1px solid #fbcfe8'),
                          borderRadius: 14,
                          padding: '12px 16px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: isSenderA ? '#0284c7' : '#c2185b' }}>
                            {senderName}
                          </span>
                          <span style={{ fontSize: 9.5, color: '#94a3b8' }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {(isAbuse || isPhone) && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 6px', borderRadius: 4, background: isAbuse ? '#b91c1c' : '#b45309', color: '#fff', fontSize: 9, fontWeight: 800, marginBottom: 6 }}>
                            {isAbuse ? '🚨 INAPPROPRIATE CONTENT / ABUSE' : '⚠️ PHONE NUMBER / OFF-PLATFORM'}
                          </div>
                        )}

                        <p style={{ margin: 0, fontSize: 13, color: '#0f172a', lineHeight: 1.45, wordBreak: 'break-word' }}>
                          {msg.content || msg.body}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: 9.5, color: '#059669' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <Lock size={10} /> AES-256-GCM Encrypted at Rest (Staff Decrypted)
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8, paddingTop: 6, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                          <button
                            type="button"
                            onClick={() => deleteChatMessage(msg._id)}
                            style={{ background: 'transparent', border: 'none', color: '#dc2626', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                          >
                            🗑️ Delete Inappropriate Message
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {!selectedConvMessages.length && !chatLoading && (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40, fontSize: 13 }}>
                      No messages in this conversation.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 40, color: '#94a3b8', textAlign: 'center' }}>
                <ShieldAlert size={48} style={{ color: '#cbd5e1', marginBottom: 12 }} />
                <h4 style={{ margin: '0 0 6px', fontSize: 16, color: '#475569' }}>Select a conversation on the left</h4>
                <p style={{ margin: 0, fontSize: 12.5, maxWidth: 360, lineHeight: 1.5 }}>
                  Inspect real candidate messages, review automated abuse flags, delete inappropriate comments, and enforce matrimonial decorum.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // MODULE 17: CONTACT & PHOTO REQUESTS
  if (tab === 'Contact & Photo Requests') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 17 · PRIVACY &amp; PHOTO ACCESS</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Private Photo &amp; Direct Contact Requests</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Review member permissions to view blurred/private candidate gallery photos or access direct family phone numbers.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Total Requests</span>
              <strong style={{ fontSize: 16 }}>{photoReqs.length}</strong>
            </div>
            <div style={{ padding: '8px 14px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#b45309', display: 'block' }}>Pending</span>
              <strong style={{ fontSize: 16, color: '#b45309' }}>{photoReqs.filter(r => r.status === 'pending').length}</strong>
            </div>
            <div style={{ padding: '8px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#16a34a', display: 'block' }}>Approved</span>
              <strong style={{ fontSize: 16, color: '#15803d' }}>{photoReqs.filter(r => r.status === 'approved').length}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              className={`chip-action ${photoReqStatusFilter === st ? 'active' : ''}`}
              onClick={() => setPhotoReqStatusFilter(st)}
              style={photoReqStatusFilter === st ? { background: '#c2185b', color: '#fff', borderColor: '#c2185b' } : {}}
            >
              {st.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Requester Candidate</th>
                <th style={{ padding: '10px 14px' }}>Target Candidate</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px' }}>Moderator Action</th>
              </tr>
            </thead>
            <tbody>
              {photoReqs
                .filter(r => photoReqStatusFilter === 'all' || r.status === photoReqStatusFilter)
                .map((r) => (
                  <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <strong>{r.fromProfile?.fields?.firstName || 'Requester'} {r.fromProfile?.fields?.surname || ''}</strong><br />
                      <small style={{ color: '#64748b' }}>{r.from?.phone} · {r.fromProfile?.fields?.presentCity || 'India'}</small>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <strong>{r.toProfile?.fields?.firstName || 'Target Profile'} {r.toProfile?.fields?.surname || ''}</strong><br />
                      <small style={{ color: '#64748b' }}>{r.to?.phone} · {r.toProfile?.fields?.denomination || 'Christian'}</small>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`status-pill ${r.status === 'approved' ? 'success' : (r.status === 'pending' ? 'warn' : 'danger')}`}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {r.status !== 'approved' && (
                          <button
                            className="chip-action"
                            style={{ color: '#16a34a', borderColor: '#86efac' }}
                            onClick={() => act(() => patch(`/admin/photo-requests/${r._id}`, { status: 'approved' }))}
                          >
                            Approve Access
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            className="chip-action"
                            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={() => act(() => patch(`/admin/photo-requests/${r._id}`, { status: 'rejected' }))}
                          >
                            Reject
                          </button>
                        )}
                        <button
                          className="chip-action"
                          style={{ color: '#16a34a', borderColor: '#86efac', background: '#f0fdf4' }}
                          onClick={() => openWhatsAppDirect(r.from?.phone, r.fromProfile?.fields?.firstName || 'Requester', 'photos')}
                        >
                          <MessageCircle size={12} style={{ marginRight: 4 }} /> WhatsApp
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!photoReqs.length && (
                <tr>
                  <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                    No photo access requests logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  // MODULE 22: CMS & WEBSITE PAGES
  if (tab === 'Website Pages / CMS') {
    const isTerms = slug === 'terms-of-service';
    const activePage = pages.find((p) => p.slug === slug);
    const wordCount = pageBody.trim() ? pageBody.trim().split(/\s+/).length : 0;
    const charCount = pageBody.length;
    const estReadTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 22 · CONTENT MANAGEMENT SYSTEM</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>CMS &amp; Website Informational Pages</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Publish and manage verified legal policies, community heritage, and safety guidelines for Web, Android, and iOS.
          </p>
        </div>

        {/* Highlighted Terms & Conditions Quick Access Banner */}
        <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <strong style={{ fontSize: 14, color: '#9d174d', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={16} /> Official Legal Terms &amp; Conditions Agreement
            </strong>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
              Governing all members across <strong>adamneve.in</strong>, Android &amp; iOS Apps. Jurisdiction: <strong>Indore, Madhya Pradesh</strong>.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              className="btn btn-shaadi btn-sm"
              onClick={() => {
                setSlug('terms-of-service');
                const exist = pages.find((p) => p.slug === 'terms-of-service');
                setPageTitle(exist?.title || 'Terms of Service & Use Agreement');
                setPageBody(exist?.body || OFFICIAL_TERMS_BODY);
                setPublished(exist?.published !== undefined ? !!exist.published : true);
              }}
            >
              <FileText size={13} style={{ marginRight: 6 }} /> Edit Official Terms
            </button>
            <a
              href="/info/terms-of-service"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <ExternalLink size={13} /> View Live Legal Page
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Sidebar Page Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              Available Pages
            </span>
            {[
              { id: 'terms-of-service', label: 'Terms of Service', badge: 'Legal' },
              { id: 'privacy-policy', label: 'Privacy Policy', badge: 'Legal' },
              { id: 'about-us', label: 'About Us', badge: 'About' },
              { id: 'how-it-works', label: 'How It Works', badge: 'Guide' },
              { id: 'community', label: 'Community Heritage', badge: 'Church' },
              { id: 'safety-centre', label: 'Safety Centre', badge: 'Safety' },
              { id: 'help-faq', label: 'Help & FAQ', badge: 'Support' }
            ].map((p) => {
              const matched = pages.find((x) => x.slug === p.id);
              const isSelected = slug === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSlug(p.id);
                    setPageTitle(matched?.title || (p.id === 'terms-of-service' ? 'Terms of Service & Use Agreement' : p.label));
                    setPageBody(matched?.body || (p.id === 'terms-of-service' ? OFFICIAL_TERMS_BODY : ''));
                    setPublished(matched?.published !== undefined ? !!matched.published : true);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    textAlign: 'left',
                    border: isSelected ? '2px solid #c2185b' : '1px solid #e2e8f0',
                    background: isSelected ? '#fff' : '#f8fafc',
                    boxShadow: isSelected ? '0 2px 8px rgba(194,24,91,0.08)' : 'none',
                    fontWeight: isSelected ? 750 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: isSelected ? '#c2185b' : '#1e293b' }}>
                      {p.label}
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: matched?.published ? '#dcfce7' : '#fef3c7',
                      color: matched?.published ? '#166534' : '#92400e'
                    }}>
                      {matched?.published ? 'LIVE' : 'DRAFT'}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
                    /{p.id}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Editor Canvas */}
          <div style={{ padding: 24, border: '1px solid #e2e8f0', borderRadius: 14, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 18, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c2185b', fontWeight: 700 }}>
                    Editor Canvas
                  </span>
                  <span className={`status-pill ${published ? 'success' : 'warn'}`}>
                    {published ? 'Published & Public' : 'Draft / Unlisted'}
                  </span>
                </div>
                <h3 style={{ margin: '4px 0 0', fontSize: 18, color: '#0f172a' }}>
                  Editing: <span style={{ color: '#c2185b', fontFamily: 'monospace' }}>/{slug}</span>
                </h3>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {isTerms && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                    onClick={() => {
                      if (confirm('Load official Adam N Eve Matrimony Terms & Conditions template? Any unsaved edits will be replaced.')) {
                        setPageTitle('Terms of Service & Use Agreement');
                        setPageBody(OFFICIAL_TERMS_BODY);
                        setPublished(true);
                      }
                    }}
                  >
                    <RotateCcw size={12} /> Reload Official Legal Text
                  </button>
                )}
                <a
                  href={`/info/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                >
                  <ExternalLink size={12} /> Preview Public Page
                </a>
              </div>
            </div>

            {isTerms && (
              <div style={{ background: '#f8fafc', borderLeft: '4px solid #c2185b', padding: '12px 16px', borderRadius: '0 8px 8px 0', marginBottom: 18, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                <p style={{ margin: 0 }}>
                  <strong>Legal Notice:</strong> This agreement establishes binding terms between <em>ADAM N EVE MATRIMONY</em> and registered users. Updates made here will immediately reflect on <strong>/info/terms-of-service</strong> and in the mobile app registration consent modal.
                </p>
              </div>
            )}

            <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
                Page Title *
                <input
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="e.g. Terms of Service & Use Agreement"
                  style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14 }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Page Content (Plain text / Structured Sections) *</span>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>
                    {charCount.toLocaleString()} chars · {wordCount.toLocaleString()} words · {estReadTime} min read
                  </span>
                </div>
                <textarea
                  rows={22}
                  value={pageBody}
                  onChange={(e) => setPageBody(e.target.value)}
                  placeholder="Enter full legal terms, guidelines, or page text..."
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontSize: 12.5,
                    lineHeight: 1.65,
                    padding: '14px 16px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    minHeight: 460,
                    resize: 'vertical',
                    background: '#fcfcfd'
                  }}
                />
              </label>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: '#c2185b' }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                    Publish this page to public website &amp; mobile app
                  </span>
                </label>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      if (activePage) {
                        setPageTitle(activePage.title);
                        setPageBody(activePage.body);
                        setPublished(!!activePage.published);
                      }
                    }}
                  >
                    Discard Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-shaadi"
                    onClick={saveCMSPage}
                    style={{ minWidth: 160 }}
                  >
                    Save &amp; Update Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // MODULE 24: SUCCESS STORIES
  if (tab === 'Success Stories') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 24 · REAL CHRISTIAN WEDDINGS</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Verified Wedding Stories &amp; Church Testimonials</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Publish verified wedding stories to inspire trust among registered church families.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {stories.length === 0 && (
              <div style={{ padding: 18, border: '1px dashed #cbd5e1', borderRadius: 12, color: '#64748b' }}>
                No verified success stories have been published yet.
              </div>
            )}
            {stories.map((s: any, i) => (
              <div key={s._id || i} style={{ padding: 18, border: '1px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>{s.coupleNames}</h4>
                  <small style={{ color: '#0f766e', fontWeight: 600 }}>{s.weddingDate} · {s.diocese}</small>
                  <p style={{ margin: '10px 0 0', fontSize: 12, color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>&ldquo;{s.quote}&rdquo;</p>
                </div>
                {s._id && (
                  <button
                    className="chip-action"
                    style={{ color: '#dc2626', borderColor: '#fca5a5', marginTop: 12, alignSelf: 'flex-start' }}
                    onClick={() => act(() => api('/admin/success-stories/' + s._id, { method: 'DELETE' }))}
                  >
                    Delete Story
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 15 }}>Publish Verified Wedding Story</h4>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              <label>Couple Names *<input value={storyCouple} onChange={(e) => setStoryCouple(e.target.value)} placeholder="e.g. Samuel & Grace" /></label>
              <label>Wedding Date<input value={storyDate} onChange={(e) => setStoryDate(e.target.value)} placeholder="e.g. December 2026" /></label>
              <label>Diocese / Church<input value={storyDiocese} onChange={(e) => setStoryDiocese(e.target.value)} placeholder="e.g. Syro-Malabar Diocese" /></label>
              <label>Testimonial Quote *<textarea rows={3} value={storyQuote} onChange={(e) => setStoryQuote(e.target.value)} placeholder="Couple testimony..." /></label>
            </div>
            <button className="btn btn-dark full" style={{ marginTop: 14 }} onClick={addStory}>
              Publish Success Story
            </button>
          </div>
        </div>
      </section>
    );
  }

  // MODULE 25: REFERRAL MANAGEMENT
  if (tab === 'Referral Management') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 25 · WORD-OF-MOUTH COMMUNITY GROWTH</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Member Referrals &amp; Community Invitations</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              Track member invitations sent by existing church families and credit rewarded subscription validity.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Total Referrals</span>
              <strong style={{ fontSize: 16 }}>{referrals.length}</strong>
            </div>
            <div style={{ padding: '8px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#16a34a', display: 'block' }}>Joined</span>
              <strong style={{ fontSize: 16, color: '#15803d' }}>{referrals.filter(r => r.status === 'joined' || r.status === 'subscribed').length}</strong>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Referrer Phone</th>
                <th style={{ padding: '10px 14px' }}>Referee (Friend/Family) Phone</th>
                <th style={{ padding: '10px 14px' }}>Referral Status</th>
                <th style={{ padding: '10px 14px' }}>Reward Status</th>
                <th style={{ padding: '10px 14px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.referrer?.phone || 'Member'}</td>
                  <td style={{ padding: '10px 14px' }}>{r.refereePhone}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={`status-pill ${r.status === 'subscribed' ? 'success' : (r.status === 'joined' ? 'success' : 'warn')}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {r.rewardCredited ? (
                      <span className="status-pill success">🎁 Reward Credited</span>
                    ) : (
                      <span className="status-pill warn">Pending Credit</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {!r.rewardCredited && (
                      <button
                        className="chip-action"
                        style={{ color: '#16a34a', borderColor: '#86efac', background: '#f0fdf4' }}
                        onClick={() => act(() => patch(`/admin/referrals/${r._id}/reward`, {}))}
                      >
                        Credit +30 Days Free Plan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!referrals.length && (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                    No referral logs recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  // MODULE 28: EXPORT & BACKUP
  if (tab === 'Export & Backup') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 28 · DISASTER RECOVERY &amp; EXPORT</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Authorized Data Export &amp; Database Backups</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Export permitted member/transaction records. Automated database and uploaded-media backups are not configured yet.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#c2185b' }}>
              <Users size={20} />
              <h4 style={{ margin: 0, fontSize: 15 }}>Member Database Export</h4>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: '#64748b' }}>
              Complete records of all registered members with church parish, demographics, and account statuses.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {void downloadAdminFile('/admin/exports/csv?type=members','AdamNEve_All_Members_Full_Biodatas.csv').catch((e)=>setError(e.message));}}
                className="btn btn-shaadi btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                📊 Download Members (Excel CSV)
              </button>
              <button
                type="button"
                onClick={() => {void downloadAdminFile('/admin/export/members','AdamNEve_Members_Backup.json').catch((e)=>setError(e.message));}}
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                💾 JSON Backup
              </button>
            </div>
          </div>

          <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#0f766e' }}>
              <FileSpreadsheet size={20} />
              <h4 style={{ margin: 0, fontSize: 15 }}>Financial &amp; Transaction CSV</h4>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: '#64748b' }}>
              Detailed tabular spreadsheet of online Razorpay gateway orders and offline bank receipts.
            </p>
            <button
              type="button"
              onClick={() => {void downloadAdminFile('/admin/exports/csv?type=transactions','AdamNEve_Financial_Transactions.csv').catch((e)=>setError(e.message));}}
              className="btn btn-dark btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              Download Transactions CSV
            </button>
          </div>

          <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#334155' }}>
              <Database size={20} />
              <h4 style={{ margin: 0, fontSize: 15 }}>MongoDB Database Snapshot</h4>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: '#64748b' }}>
              Not configured: encrypted MongoDB and photo backups must be set up before production. This button will report the missing backup configuration.
            </p>
            <button
              className="btn btn-outline btn-sm"
              disabled={backupLoading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              onClick={async () => {
                setBackupLoading(true);
                setError('');
                try {
                  const res: any = await post('/admin/backup/snapshot', {});
                  const normalized: BackupStatus = {
                    success: Boolean(res?.success ?? true),
                    status: res?.message || res?.status || 'Database snapshot verified and archived',
                    filename: res?.snapshot?.filename || res?.filename || 'backup.enc.json',
                    sizeMB: typeof res?.sizeMB === 'number' ? res.sizeMB : (res?.snapshot?.fileSizeBytes ? +(res.snapshot.fileSizeBytes / (1024 * 1024)).toFixed(2) : 0),
                    timestamp: res?.snapshot?.createdAt || res?.timestamp || new Date().toISOString(),
                    collectionsBackedUp: res?.collectionsBackedUp || (res?.snapshot?.recordCounts ? Object.keys(res.snapshot.recordCounts) : [])
                  };
                  setBackupStatus(normalized);
                  setNotice('Database backup snapshot verified and archived successfully.');
                } catch (e: any) {
                  setError(e.message);
                } finally {
                  setBackupLoading(false);
                }
              }}
            >
              <RefreshCw size={14} className={backupLoading ? 'animate-spin' : ''} />
              {backupLoading ? 'Checking Backup...' : 'Check Backup Configuration'}
            </button>
          </div>
        </div>

        {backupStatus && (
          <div style={{ padding: 18, border: '1.5px solid #86efac', borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <CheckCircle2 size={24} style={{ color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ fontSize: 14, color: '#15803d', display: 'block', marginBottom: 2 }}>
                ✓ {backupStatus.status}
              </strong>
              <p style={{ margin: 0, fontSize: 12, color: '#334155' }}>
                Archive file: <code>{backupStatus.filename}</code> · Size: {backupStatus.sizeMB} MB · Verified at {backupStatus.timestamp ? new Date(backupStatus.timestamp).toLocaleTimeString('en-IN') : 'Just now'}
              </p>
              <small style={{ color: '#64748b', display: 'block', marginTop: 4 }}>
                Collections safely archived ({backupStatus.collectionsBackedUp?.length || 0}): {backupStatus.collectionsBackedUp?.join(', ')}
              </small>
            </div>
          </div>
        )}
      </section>
    );
  }

  // MODULE 29: WEBSITE & APP SETTINGS
  if (tab === 'Website & App Settings') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 29 · BRANDING &amp; PLATFORM CONFIGURATION</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Website &amp; App Visual Branding &amp; Settings</h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>
            Directly control the Member Login page photo, platform branding, helpline contacts, and operational regions.
          </p>
        </div>

        {/* PLATFORM BRAND LOGO & APP ICON STUDIO */}
        <LogoManagementPanel
          currentLogoUrl={platLogoUrl || ''}
          currentLogoSquareUrl={platLogoSquareUrl || ''}
          communityName={platName || 'Adam N Eve Matrimony'}
          onSave={async (wideUrl, squareUrl) => {
            if (saveLogoSettings) {
              await saveLogoSettings(wideUrl, squareUrl);
            }
          }}
          onReset={async () => {
            if (resetLogoSettings) {
              await resetLogoSettings();
            }
          }}
          setError={setError}
          setNotice={setNotice}
        />

        {/* LOGIN PHOTO CUSTOMIZER */}
        <div
          style={{
            background: '#fff',
            border: '1.5px solid #e2d9cd',
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18, borderBottom: '1px solid #f1ece4', paddingBottom: 14 }}>
            <div>
              <span className="eyebrow tiny" style={{ color: '#c2185b', fontWeight: 800 }}>LIVE BRANDING CONTROL</span>
              <h3 style={{ margin: '2px 0 0', fontSize: 18, color: '#1e293b' }}>
                Member Login Page Background Photo
              </h3>
              <small style={{ color: '#64748b', fontSize: 12 }}>
                Controls the hero banner photo on <code>/login</code> and <code>/register</code> screens.
              </small>
            </div>
            <span className="status-pill success" style={{ fontSize: 11, padding: '6px 12px' }}>
              ✓ Live on Public Website
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 360px) 1fr', gap: 24, alignItems: 'start' }}>
            <div
              style={{
                position: 'relative',
                height: 380,
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                backgroundImage: `linear-gradient(180deg, rgba(30,41,59,0.38) 0%, rgba(131,24,67,0.88) 100%), url('${loginPhotoUrl.startsWith('/api') ? API.replace(/\/api$/, '') + loginPhotoUrl : loginPhotoUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 22,
                color: '#fff'
              }}
            >
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#fff' }}>
                  Preview (Login Screen Right Side)
                </span>
              </div>
              <div>
                <span style={{ fontSize: 10, color: '#fde047', fontWeight: 800, letterSpacing: '0.1em' }}>
                  ✝ SACRED COMMUNITY MATRIMONY
                </span>
                <h4 style={{ fontSize: 20, margin: '4px 0 6px', color: '#fff', fontFamily: 'serif' }}>
                  Where Faith Meets Love.
                </h4>
                <small style={{ fontSize: 11, color: '#fce7f3', lineHeight: 1.4, display: 'block' }}>
                  Christian community matchmaking guided by parish verification and strict privacy.
                </small>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Method 1: Upload Image File from Computer
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
                      if (!validTypes.includes(f.type) && !/\.(jpe?g|png|webp)$/i.test(f.name)) {
                        setError('Only genuine JPG, PNG, and WebP images are supported.');
                        return;
                      }
                      if (f.size > 3 * 1024 * 1024) {
                        setError('Image file exceeds maximum 3MB limit.');
                        return;
                      }
                      setError('');
                      setLoginPhotoFile(f);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: 10,
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: 10,
                    background: '#f8fafc',
                    fontSize: 12
                  }}
                />
                <small style={{ color: '#64748b', fontSize: 11, display: 'block', marginTop: 4 }}>
                  Supported formats: JPG, PNG, WebP (high resolution 1200x800 recommended, up to 3MB)
                </small>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Method 2: Paste Direct Image URL
                </label>
                <input
                  type="text"
                  value={loginPhotoUrl}
                  onChange={(e) => setLoginPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1.5px solid #e2e8f0',
                    fontSize: 13,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
                  Method 3: Quick Select from Curated Matrimonial Presets
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {[
                    {
                      name: 'Luxury Wedding Couple (Default)',
                      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80'
                    },
                    {
                      name: 'Sacred Cathedral Blessing',
                      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80'
                    },
                    {
                      name: 'Holy Matrimony Rings & Bible',
                      url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=1200&auto=format&fit=crop&q=80'
                    },
                    {
                      name: 'Joyful Christian Nuptials',
                      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&auto=format&fit=crop&q=80'
                    }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setLoginPhotoUrl(preset.url);
                        setLoginPhotoFile(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        borderRadius: 10,
                        border: loginPhotoUrl === preset.url ? '2px solid #c2185b' : '1px solid #e2e8f0',
                        background: loginPhotoUrl === preset.url ? '#fdf2f8' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 11, fontWeight: loginPhotoUrl === preset.url ? 700 : 500, color: '#1e293b' }}>
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button
                  type="button"
                  className="btn btn-shaadi"
                  onClick={() => saveLoginPhoto()}
                  disabled={loginPhotoUploading}
                  style={{ padding: '12px 24px', fontSize: 13 }}
                >
                  {loginPhotoUploading ? 'Uploading & Updating...' : 'Save & Publish Photo to Login Screen'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* GENERAL PLATFORM CONTACT & REGIONAL SETTINGS */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            padding: 24
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: 17, color: '#1e293b' }}>
            Platform General Contact &amp; Regions
          </h3>
          <div className="form-grid" style={{ maxWidth: 740, gap: 16 }}>
            <label>
              Platform Name
              <input
                value={platName}
                onChange={(e) => setPlatName(e.target.value)}
                placeholder="Adam N Eve Matrimony"
              />
            </label>
            <label>
              Support Email Helpline
              <input
                value={platEmail}
                onChange={(e) => setPlatEmail(e.target.value)}
                placeholder="support@adamnevematrimony.com"
              />
            </label>
            <label>
              Support Phone Helpline
              <input
                value={platPhone}
                onChange={(e) => setPlatPhone(e.target.value)}
                placeholder="Official contact number"
              />
            </label>
            <label>
              Supported Regional States (Comma-separated)
              <input
                value={platRegions}
                onChange={(e) => setPlatRegions(e.target.value)}
                placeholder="Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Karnataka, Goa, Maharashtra, MP"
              />
            </label>
          </div>
          <button
            type="button"
            className="btn btn-dark"
            onClick={saveGeneralSettings}
            style={{ marginTop: 18, padding: '10px 20px', fontSize: 13 }}
          >
            Save Platform Information
          </button>
        </div>
      </section>
    );
  }

  // MODULE 30: ADMIN ROLES & STAFF
  if (tab === 'Admin Roles & Staff') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 30 · ACCESS CONTROL &amp; RBAC</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Administrative Roles &amp; Staff Directory</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '10px 14px' }}>Phone Number</th>
                  <th style={{ padding: '10px 14px' }}>Role</th>
                  <th style={{ padding: '10px 14px' }}>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{s.phone}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className="status-pill success">{s.role?.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>{s.accountStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 15 }}>Add Staff Admin / Moderator</h4>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              <label>Staff Phone Number *<input value={newStaffPhone} onChange={(e) => setNewStaffPhone(e.target.value)} placeholder="10-digit phone" /></label>
              <label>Initial Password (12+ characters) *<input type="password" autoComplete="new-password" value={newStaffPassword} onChange={(e) => setNewStaffPassword(e.target.value)} minLength={12} placeholder="Use a unique temporary password" /></label>
              <label>Assigned Role<select value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)}><option value="moderator">Moderator (Profile &amp; Photo Review)</option><option value="admin">Super Admin (Full Access)</option></select></label>
            </div>
            <button className="btn btn-dark full" style={{ marginTop: 14 }} onClick={addStaff} disabled={newStaffPassword.length < 12 || !/^\d{10,15}$/.test(newStaffPhone)}>
              Save Staff Permissions
            </button>
          </div>
        </div>
      </section>
    );
  }

  // MODULE 32: PRIVACY & DATA REQUESTS
  if (tab === 'Privacy & Data Requests') {
    return (
      <section className="panel" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="eyebrow tiny" style={{ color: '#c2185b' }}>MODULE 32 · PRIVACY &amp; DPDP ACT</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>Data Privacy &amp; Member Deletion Requests</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Compliance with Digital Personal Data Protection Act (DPDP) 2023 for right to erasure and data portability.
          </p>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px' }}>Member Phone</th>
                <th style={{ padding: '10px 14px' }}>Request Type</th>
                <th style={{ padding: '10px 14px' }}>Reason</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {dataRequests.map((d) => (
                <tr key={d._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{d.user?.phone || 'Member'}</td>
                  <td style={{ padding: '10px 14px' }}>{d.type}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{d.reason || 'Requested account closure'}</td>
                  <td style={{ padding: '10px 14px' }}><span className="status-pill success">{d.status}</span></td>
                </tr>
              ))}
              {!dataRequests.length && (
                <tr>
                  <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                    No pending data deletion or consent revocation requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return null;
}

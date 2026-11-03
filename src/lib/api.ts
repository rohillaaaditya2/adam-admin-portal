export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const MEMBER_KEY = 'ane_token';
const ADMIN_KEY = 'ane_admin_token';

// Member Authentication (Consumer Matrimony Website)
export const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem(MEMBER_KEY) || '' : '');
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem(MEMBER_KEY, token);
};
export const signOut = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MEMBER_KEY);
    window.dispatchEvent(new Event('ane_auth_change'));
    if (window.location.pathname === '/login') {
      window.location.reload();
    } else {
      window.location.href = '/login';
    }
  }
};

// Admin Operations Authentication (Isolated Backoffice)
export const getAdminToken = () => (typeof window !== 'undefined' ? localStorage.getItem(ADMIN_KEY) || '' : '');
export const setAdminToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem(ADMIN_KEY, token);
};
export const adminSignOut = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_KEY);
    window.location.href = '/admin/login';
  }
};

export async function api<T = any>(route: string, options: RequestInit = {}): Promise<T> {
  const isForm = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    ...((options.headers as Record<string, string>) || {})
  };

  // Route & context-based token isolation:
  if (!headers.Authorization) {
    const isAdminContext = route.startsWith('/admin') || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));
    const token = isAdminContext ? (getAdminToken() || getToken()) : getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(API + route, { ...options, headers, cache: 'no-store' });
  } catch {
    throw new Error('Backend unavailable. Check MongoDB and API server.');
  }

  const data = await response.json().catch(() => ({ error: 'Unexpected response' }));
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data as T;
}

export const post = (route: string, data: any) => api(route, { method: 'POST', body: JSON.stringify(data) });
export const patch = (route: string, data: any) => api(route, { method: 'PATCH', body: JSON.stringify(data) });
export const put = (route: string, data: any) => api(route, { method: 'PUT', body: JSON.stringify(data) });

// Admin exports require an Authorization header; plain <a href> downloads get HTTP 401.
export async function downloadAdminFile(route: string, filename: string): Promise<void> {
  if (!route.startsWith('/admin/')) throw new Error('Admin export path required');
  const token=getAdminToken();
  if (!token) throw new Error('Admin login required to export this file');
  const response=await fetch(API+route,{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});
  if (!response.ok) {
    const err=await response.json().catch(()=>({}));
    throw new Error(err.error||`Download failed (HTTP ${response.status})`);
  }
  const blob=await response.blob();
  const url=URL.createObjectURL(blob);
  try {
    const link=document.createElement('a');link.href=url;link.download=filename;
    document.body.appendChild(link);link.click();link.remove();
  } finally {URL.revokeObjectURL(url)}
}

// Secure Media Loader: loads media via Authorization header to prevent exposing session JWT in URLs
const mediaBlobCache = new Map<string, string>();

export async function getSecureMediaUrl(mediaId: string, isAdmin = false): Promise<string> {
  if (!mediaId) return '';
  if (mediaId.startsWith('blob:') || mediaId.startsWith('data:')) return mediaId;
  const isProtectedMedia = mediaId.includes('/media/') || (!mediaId.startsWith('http://') && !mediaId.startsWith('https://'));
  if (!isProtectedMedia) return mediaId;

  const cleanId = mediaId.replace(/^https?:\/\/[^\/]+/, '').replace(/^\/?(api\/)?media\//, '');
  const cacheKey = `${isAdmin ? 'admin' : 'member'}:${cleanId}`;
  if (mediaBlobCache.has(cacheKey)) return mediaBlobCache.get(cacheKey)!;

  const token = isAdmin ? (getAdminToken() || getToken()) : getToken();
  if (!token) return '';
  try {
    const res = await fetch(`${API}/media/${cleanId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return '';
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    mediaBlobCache.set(cacheKey, objectUrl);
    return objectUrl;
  } catch {
    return '';
  }
}


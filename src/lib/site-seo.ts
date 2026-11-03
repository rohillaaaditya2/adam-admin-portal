// Only opt in public pages when there is an explicitly configured HTTPS production domain.
export const siteOrigin=process.env.NEXT_PUBLIC_SITE_URL||'';
export const siteSeoEnabled=process.env.NODE_ENV==='production' && /^https:\/\//i.test(siteOrigin) && !/localhost|127\.0\.0\.1/i.test(siteOrigin);

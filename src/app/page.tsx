'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminToken } from '@/lib/api';

export default function AdminRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (getAdminToken()) {
      router.replace('/operations');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', fontFamily: 'sans-serif', color: '#64748b' }}>
      <p>Redirecting to Admin Operations...</p>
    </div>
  );
}

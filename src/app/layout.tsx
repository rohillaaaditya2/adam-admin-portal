import type {Metadata, Viewport} from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import NetworkStatus from '@/components/NetworkStatus';
import Footer from '@/components/Footer';
import CustomerSupportWidget from '@/components/CustomerSupportWidget';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import PwaRegister from '@/components/PwaRegister';
import MobileBottomNav from '@/components/MobileBottomNav';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#831843',
};

export const metadata: Metadata = {
  title: 'Adam N Eve Matrimony | Christian Matrimony Platform',
  description: 'Adam N Eve Matrimony - A private, trust-focused Christian community matrimony platform with church details, verified biodatas and member privacy.',
  robots: {index:false,follow:false},
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Adam N Eve'
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png'
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <PwaRegister />
        <Navbar />
        <NetworkStatus />
        {children}
        <CustomerSupportWidget />
        <CookieConsentBanner />
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}


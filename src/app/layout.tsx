import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'BizTools India — Free GST Invoice, QR, Calculators & Business Documents for MSMEs',
  description:
    'All-in-one free business utility platform for Indian MSMEs, shopkeepers, freelancers, and startups. Create GST tax invoices, quotations, salary slips, POs, UPI payment QR codes, calculate GST & EMI instantly.',
  keywords: [
    'GST invoice generator',
    'free invoice maker India',
    'GST calculator India',
    'quotation maker',
    'salary slip generator',
    'UPI QR code generator',
    'business invoice PDF',
    'purchase order maker',
    'payment receipt generator',
    'visiting card maker India',
  ],
  authors: [{ name: 'BizTools India Team' }],
  metadataBase: new URL('https://biztools.in'),
  openGraph: {
    title: 'BizTools India — Create. Calculate. Grow.',
    description:
      'Free GST Invoicing, Estimations, Payslips, UPI QR Codes and Financial Calculators for Indian Businesses.',
    url: 'https://biztools.in',
    siteName: 'BizTools India',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

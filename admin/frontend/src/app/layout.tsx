import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/lib/query-provider';

import SmoothScrollProvider from '@/components/SmoothScrollProvider';

export const metadata: Metadata = {
  title: 'Katalyst | Student Outreach & Application Tracking System',
  description:
    'Centralized portal empowering high-potential young women from low-income communities in STEM careers.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50">
        <QueryProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

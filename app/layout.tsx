import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Institutional Trading Terminal',
  description: 'VIP Signals, Community, and Trading Analytics Terminal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#070A10] text-slate-100 antialiased`}>
        {children}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
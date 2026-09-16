import type { Metadata } from 'next';
import { Inter, Noto_Serif_Bengali } from 'next/font/google';
import '@/app/globals.css';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/home/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Khulna University Deeni Community',
  description: 'খুলনা বিশ্ববিদ্যালয় দ্বীনি কমিউনিটি ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoSerifBengali.variable}`}>
      <body className="font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
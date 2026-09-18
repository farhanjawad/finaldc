import type { Metadata } from 'next';
import { Inter,  Baloo_Da_2  } from 'next/font/google';
import '@/app/globals.css';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/home/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const balooDa2 = Baloo_Da_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-baloo-da-2',
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
    <html lang="bn" className={`${inter.variable} ${balooDa2.variable}`}>
      <body className="font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
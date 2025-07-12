import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Header } from '@/components/features/Header';
import Providers from '@/components/infra/Providers';
import { Toaster } from '@/components/ui/Sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Supporting Human Understanding of Formal Compliance Rules',
  description: "Lukas Rossi's Master Thesis Use Case",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-vh h-dvh flex flex-col overflow-hidden bg-gray-900`}
      >
        <Header />
        <main className={'flex-grow flex flex-col p-4 overflow-auto'}>
          <Providers>{children}</Providers>
        </main>
        <footer>
          <hr className={'my-2 border-gray-200'} />
          <div className="text-center text-sm text-gray-200  mb-2">
            Part of Lukas Rossi's Master's Thesis (
            <Link
              prefetch={false}
              className="text-blue-400 hover:underline"
              href={'https://github.com/l-rossi/ma-use-case'}
            >
              Code
            </Link>
            )
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}

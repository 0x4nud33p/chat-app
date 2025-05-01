import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import SessionProvider from '@/providers/SessionProvider';
import MainLayout from '@/components/layouts/MainLayout';
import Sidebar from '@/components/layouts/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Real-Time Chat App',
  description: 'A modern real-time chat application built with Next.js 14, Prisma, Socket.io and TailwindCSS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* <MainLayout > */}
              {children}
              {/* </MainLayout> */}
            </ThemeProvider>
          </SessionProvider>
      </body>
    </html>
  );
}
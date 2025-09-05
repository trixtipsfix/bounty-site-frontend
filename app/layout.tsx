import './globals.css';
import type { Metadata } from 'next';
import { Inter, Alexandria } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const alex = Alexandria(
  { 
    subsets: ['latin'] ,
    weight: ['400', '500', '600', '700'],
    display: 'swap',
  }
);
export const metadata: Metadata = {
  title: 'Engagement Bounty - Programs',
  description: 'Manage your bounty programs and assets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={alex.className}>{children}</body>
    </html>
  );
}
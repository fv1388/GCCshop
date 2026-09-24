import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CC Shop Platform - Launch Your Store in Minutes',
  description: 'Build your own e-commerce store. $19.99/month. No coding required.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import RequireUserData from './components/RequireUserData';

export const metadata: Metadata = {
  title: 'ROG Gaming Laptops - Ultimate Performance',
  description: 'Experience next-level gaming with ASUS ROG laptops. High-precision location tracking and premium gaming performance.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RequireUserData>
          {children}
        </RequireUserData>
      </body>
    </html>
  );
}



import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tool ghép ảnh liên quân',
  description: 'Bản dựng giao diện theo gheplienquan.com'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

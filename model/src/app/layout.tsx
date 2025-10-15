import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Evidence Upload System',
  description: 'Upload and search evidence files with AI-powered text extraction',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
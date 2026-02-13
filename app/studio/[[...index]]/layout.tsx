// app/studio/[[...index]]/layout.tsx
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'RETURN 0; Studio | Content Management',
  description: 'Admin dashboard for managing RETURN 0; website content',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  // Sanity Studio requires specific viewport settings
  themeColor: '#0A0A0F',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Don't render <html> or <body> - this layout is nested within the root layout
  // Just apply studio-specific styles via a wrapper div
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'auto',
        // Reset any inherited styles
        margin: 0,
        padding: 0,
      }}
    >
      {children}
    </div>
  );
}
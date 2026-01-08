import '@/styles/globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Logistics Enterprise Portal',
  description: 'Unified dashboard for Power BI reports and Copilot Studio chatbots',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://cdn.jsdelivr.net/npm/powerbi-client@2.21.1/dist/powerbi.min.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dr Khojo | Find & Book Doctor Appointments',
  description: 'Simple, trustworthy doctor-discovery and appointment-booking platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-teal-100 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}

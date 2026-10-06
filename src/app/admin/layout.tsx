'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Users,
  Stethoscope,
  MapPin,
  Calendar,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Doctors & Clinics', href: '/admin/doctors', icon: Stethoscope },
  { label: 'Locations & Coverage', href: '/admin/locations', icon: MapPin },
  { label: 'Appointments Log', href: '/admin/appointments', icon: Calendar },
  { label: 'Users & Inquiries', href: '/admin/users', icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Admin Badge */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs">
                  <Image
                    src="/logo.png"
                    alt="Dr Khojo"
                    width={160}
                    height={100}
                    priority
                    unoptimized
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>
              </Link>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-xs font-bold text-amber-300">
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Console
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-3">
              <Link
                href="/doctors"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/doctor/dashboard"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
              >
                Doctor Portal
              </Link>
            </div>
          </div>

          {/* Admin Navigation Bar */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 py-2">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500">
        Dr Khojo Platform Administration & Operations • Internal Use Only
      </footer>
    </div>
  );
}

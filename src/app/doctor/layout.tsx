'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  User,
  ShieldCheck,
  ExternalLink,
  Stethoscope,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
  { label: 'Appointments', href: '/doctor/appointments', icon: CalendarCheck },
  { label: 'Availability', href: '/doctor/availability', icon: Clock },
  { label: 'Profile & Clinic', href: '/doctor/profile', icon: User },
  { label: 'Verification', href: '/doctor/verification', icon: ShieldCheck },
];

export default function DoctorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Doctor Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Portal Badge */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Dr Khojo"
                  width={200}
                  height={130}
                  priority
                  unoptimized
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </Link>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-bold text-teal-800">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                Doctor Portal
              </div>
            </div>

            {/* Quick action to public site */}
            <div className="flex items-center gap-3">
              <Link
                href="/doctors"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
              >
                <span>View Patient Discovery</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/doctor-registration"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors"
              >
                + Register New Clinic
              </Link>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 py-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2026 Dr Khojo Healthcare Portal • Doctor Management Hub</p>
      </footer>
    </div>
  );
}

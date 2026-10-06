'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Calendar, Search, UserPlus } from 'lucide-react';
import { CitySelector, LocationSelection } from './CitySelector';
import { Logo } from './Logo';

interface HeaderProps {
  selectedLocation: LocationSelection;
  onSelectLocation: (location: LocationSelection) => void;
  onOpenDoctorRegistration?: () => void;
  onOpenAppointments?: () => void;
}

export function Header({
  selectedLocation,
  onSelectLocation,
  onOpenDoctorRegistration,
  onOpenAppointments,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-40 bg-gradient-to-r from-sky-50/60 via-white to-emerald-50/50 backdrop-blur-md border-b border-sky-100/80 shadow-xs">
      {/* Brand color accent stripe matching logo blues and greens */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[94px] sm:min-h-[104px] py-2 sm:py-2.5 gap-4">
          {/* 1. Dr Khojo Crisp Brand Logo */}
          <Link
            href="/"
            className="flex items-center group shrink-0 outline-none focus:outline-none select-none active:opacity-85 transition-opacity"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Logo variant="default" size="header" priority />
          </Link>

          {/* Desktop & Wide Navigation:
              Dr Khojo → Location selector → Find a Doctor → Your Appointments → Emergency → Doctor Registration */}
          <nav className="hidden lg:flex items-center gap-2.5 text-xs sm:text-sm font-semibold shrink-0">
            {/* 2. Separate Header Location Selector Navigation Control */}
            <div className="shrink-0">
              <CitySelector selectedLocation={selectedLocation} onSelectLocation={onSelectLocation} />
            </div>

            {/* 3. Find a Doctor Control */}
            <Link
              href="/doctors"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white/90 hover:bg-sky-50 text-slate-800 hover:text-sky-800 border border-slate-200/90 hover:border-sky-300 transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-sky-600" />
              Find a doctor
            </Link>

            {/* 4. Your Appointments Control */}
            {onOpenAppointments ? (
              <button
                type="button"
                onClick={onOpenAppointments}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white/90 hover:bg-teal-50 text-slate-800 hover:text-teal-900 border border-slate-200/90 hover:border-teal-300 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-teal-600" />
                Your appointments
              </button>
            ) : (
              <Link
                href="/appointments"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white/90 hover:bg-teal-50 text-slate-800 hover:text-teal-900 border border-slate-200/90 hover:border-teal-300 transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-teal-600" />
                Your appointments
              </Link>
            )}

            {/* 5. Emergency (108) Control */}
            <Link
              href="/#emergency"
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-50/90 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              Emergency (108)
            </Link>

            {/* 6. Doctor Registration Control */}
            {onOpenDoctorRegistration ? (
              <button
                type="button"
                onClick={onOpenDoctorRegistration}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-700 hover:from-teal-800 hover:to-emerald-700 text-white shadow-xs shadow-teal-900/10 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4 text-teal-200" />
                Doctor Registration (₹499/mo)
              </button>
            ) : (
              <Link
                href="/doctor-registration"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-700 hover:from-teal-800 hover:to-emerald-700 text-white shadow-xs shadow-teal-900/10 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4 text-teal-200" />
                Doctor Registration (₹499/mo)
              </Link>
            )}
          </nav>

          {/* Tablet & Mobile Header Right: Location Selector + Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="shrink-0">
              <CitySelector selectedLocation={selectedLocation} onSelectLocation={onSelectLocation} />
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sky-100 bg-gradient-to-b from-white via-sky-50/30 to-emerald-50/20 px-4 pt-3 pb-5 space-y-2.5 shadow-lg">
          <Link
            href="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-3 px-4 text-sm font-bold text-slate-900 bg-white hover:bg-sky-50 rounded-xl border border-slate-200/90 shadow-2xs"
          >
            <Search className="w-4 h-4 text-sky-600" />
            Find a doctor
          </Link>

          {onOpenAppointments ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAppointments();
              }}
              className="w-full flex items-center gap-2.5 py-3 px-4 text-sm font-bold text-slate-900 bg-white hover:bg-teal-50 rounded-xl border border-slate-200/90 shadow-2xs cursor-pointer text-left"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              Your appointments
            </button>
          ) : (
            <Link
              href="/appointments"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-3 px-4 text-sm font-bold text-slate-900 bg-white hover:bg-teal-50 rounded-xl border border-slate-200/90 shadow-2xs"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              Your appointments
            </Link>
          )}

          <Link
            href="/#emergency"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-3 px-4 text-sm font-bold text-rose-700 bg-rose-50/90 hover:bg-rose-100 rounded-xl border border-rose-200 shadow-2xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            Emergency Care (108)
          </Link>

          {onOpenDoctorRegistration ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDoctorRegistration();
              }}
              className="w-full flex items-center gap-2.5 py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-700 hover:from-teal-800 hover:to-emerald-700 rounded-xl shadow-xs cursor-pointer text-left"
            >
              <UserPlus className="w-4 h-4 text-teal-200" />
              Doctor Registration (₹499/mo)
            </button>
          ) : (
            <Link
              href="/doctor-registration"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-700 hover:from-teal-800 hover:to-emerald-700 rounded-xl shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-teal-200" />
              Doctor Registration (₹499/mo)
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

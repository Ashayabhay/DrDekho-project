import React from 'react';
import Link from 'next/link';
import { Shield, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          <div>
            {/* Dr Khojo prominent inverse brand logo sitting directly on dark navy footer */}
            <Link
              href="/"
              className="inline-block mb-4 hover:opacity-90 transition-opacity outline-none focus:outline-none"
            >
              <Logo variant="inverse" size="footer" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              A calm, trustworthy doctor-discovery and appointment booking platform. Designed for local clinics and patients first.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400" /> Patient Guarantees
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                100% Free search & booking for patients
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                Verified doctor timings & clinic addresses
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                No ads, no forced payments, calm interface
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-teal-400" /> Founding Pilot Program
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3">
              Clinics pay ₹499/month per clinic for one doctor during our founding launch.
            </p>
            <div className="inline-block bg-teal-950/80 border border-teal-800/60 rounded-xl px-3.5 py-2 text-xs text-teal-300 font-bold">
              3 Pilot Clinics Founding Goal
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© 2026 Dr Khojo. All rights reserved.</div>
          <div className="flex items-center gap-4 font-medium">
            <span>Find. Compare. Book.</span>
            <span>•</span>
            <span>Calm Healthcare Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

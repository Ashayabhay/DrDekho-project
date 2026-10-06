'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Lock,
  ExternalLink,
  Award,
} from 'lucide-react';

export default function DoctorVerificationPage() {
  const [docState, setDocState] = useState({
    registrationCert: true,
    degreeCert: true,
    clinicProof: true,
    idProof: false,
  });

  const [message, setMessage] = useState('');

  const handleUploadSimulate = (field: keyof typeof docState) => {
    setDocState((prev) => ({ ...prev, [field]: true }));
    setMessage('Document uploaded successfully for verification.');
    setTimeout(() => setMessage(''), 3000);
  };

  const isFullyVerified = Object.values(docState).every(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Practitioner & Clinic Verification</h1>
        <p className="text-xs text-slate-500 mt-1">
          Dr Khojo guarantees 100% verified doctors to build trust with local patients
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {message}
        </div>
      )}

      {/* Verification Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Dr Khojo Verified Doctor</h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {isFullyVerified ? 'Verified' : 'Under Review'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                License details verified against National Medical Commission / State Medical Council
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
              <Award className="w-4 h-4 text-teal-600" />
              Council ID: RMC-2014-992
            </span>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Required Documents Checklist
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-teal-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Medical Council Registration</div>
                  <div className="text-[11px] text-slate-500">NMC / State Council Certificate</div>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-teal-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Degree & Specialization Proof</div>
                  <div className="text-[11px] text-slate-500">MBBS, MD, MS, or BDS Degree</div>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-teal-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Clinic Address Proof</div>
                  <div className="text-[11px] text-slate-500">Clinic Board / Utility / Rent Deed</div>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-teal-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Government Photo ID</div>
                  <div className="text-[11px] text-slate-500">
                    {docState.idProof ? 'Verified' : 'Pending upload'}
                  </div>
                </div>
              </div>
              {docState.idProof ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <button
                  type="button"
                  onClick={() => handleUploadSimulate('idProof')}
                  className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Upload
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            Verification Privacy Assurance
          </div>
          <p>
            Your identification and certificate documents are strictly stored in an encrypted vault solely for compliance and manual credential audit. They are never shared publicly.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { MapPin, Clock, ShieldCheck, Building2 } from 'lucide-react';

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  qualification: string;
  experienceYears: number;
  clinicName: string;
  address: string;
  city: string;
  availabilityToday: string;
  consultationFee: number;
  providesEmergency?: boolean;
  emergencyFee?: number;
  emergencyHours?: string;
  emergencyInstructions?: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookClick?: (doctorId: string) => void;
}

export function DoctorCard({ doctor, onBookClick }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between">
      <div>
        {/* Header Badges & Speciality */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/60">
                {doctor.speciality}
              </span>
              {doctor.providesEmergency && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  🚨 Emergency Available
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-2.5 leading-snug">
              {doctor.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {doctor.qualification} • {doctor.experienceYears} yrs experience
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/50 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Clinic
          </span>
        </div>

        {/* Clinic & Location */}
        <div className="space-y-1.5 my-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800">{doctor.clinicName}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="text-slate-600 line-clamp-2">{doctor.address}</span>
          </div>
          <div className="flex items-center gap-2 pt-1 text-teal-800 font-medium">
            <Clock className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Available Today: {doctor.availabilityToday}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-400 font-medium">Consultation Fee</div>
          <div className="text-sm font-bold text-slate-900">
            ₹{doctor.consultationFee} <span className="text-[11px] font-normal text-slate-500">(Pay at Clinic)</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onBookClick?.(doctor.id)}
          className="px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 transition-colors"
        >
          Book appointment
        </button>
      </div>
    </div>
  );
}

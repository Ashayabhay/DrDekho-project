'use client';

import React from 'react';
import { X, Calendar, Clock, MapPin, Building2, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface BookedAppointment {
  id: string;
  doctorName: string;
  speciality: string;
  clinicName: string;
  clinicAddress: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  consultationFee: number;
  appointmentType?: 'REGULAR' | 'EMERGENCY';
  bookingFor?: 'MYSELF' | 'SOMEONE_ELSE';
  patientAge?: string | number;
  patientGender?: 'Male' | 'Female' | 'Other';
  reasonForVisit?: string;
  notes?: string;
  patientEmail?: string;
}

interface AppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments?: BookedAppointment[];
  onCancelAppointment?: (id: string) => void;
  onFindDoctorClick?: () => void;
}

export function AppointmentsModal({
  isOpen,
  onClose,
  appointments = [],
  onCancelAppointment,
  onFindDoctorClick,
}: AppointmentsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-teal-900 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800/90 flex items-center justify-center text-teal-200 border border-teal-700/60">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Your Appointments
              </h2>
              <p className="text-xs text-teal-100">
                Track and manage your upcoming doctor consultations
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-teal-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-100 text-teal-900">
                          {appt.speciality}
                        </span>
                        {appt.appointmentType === 'EMERGENCY' && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            🚨 Emergency
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        {appt.doctorName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{appt.clinicName}</span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${
                        appt.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : appt.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {appt.status}
                    </span>
                  </div>

                  {/* Timing & Address Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5 font-medium text-teal-900">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{appt.date} at {appt.timeSlot}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{appt.clinicAddress}</span>
                    </div>
                  </div>

                  {/* Footer & Cancel */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <div className="text-slate-500">
                      Fee: <strong className="text-slate-800">₹{appt.consultationFee}</strong> (Pay at Clinic)
                    </div>
                    {appt.status === 'CONFIRMED' && onCancelAppointment && (
                      <button
                        type="button"
                        onClick={() => onCancelAppointment(appt.id)}
                        className="text-red-600 hover:text-red-700 font-semibold text-xs cursor-pointer hover:underline"
                      >
                        Cancel appointment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-100">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  No appointments booked yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you book an appointment with a verified doctor, it will appear here for easy tracking and cancellation.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onFindDoctorClick?.();
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Find a doctor now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { doctorService } from '@/services/doctorService';
import { appointmentService } from '@/services/appointmentService';
import { Doctor } from '@/components/DoctorCard';
import { BookedAppointment } from '@/components/AppointmentsModal';
import {
  Calendar,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  MapPin,
  IndianRupee,
  AlertCircle,
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<BookedAppointment[]>([]);

  useEffect(() => {
    // Select first registered doctor or default doctor
    const doctors = doctorService.getAllDoctors();
    if (doctors.length > 0) {
      setActiveDoctor(doctors[0]);
    }
    const allAppointments = appointmentService.getAllAppointments();
    setAppointments(allAppointments);
  }, []);

  const confirmedAppointments = appointments.filter((a) => a.status === 'CONFIRMED');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/70 border border-teal-600/50 text-xs font-semibold text-teal-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Practitioner
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {activeDoctor?.name || 'Doctor'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-xl">
            {activeDoctor?.clinicName} • {activeDoctor?.city} • Fee: ₹{activeDoctor?.consultationFee || 400}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/doctor/availability"
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors shadow-2xs"
          >
            Update Slots
          </Link>
          <Link
            href={activeDoctor ? `/doctors/${activeDoctor.id}` : '/doctors'}
            className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition-colors shadow-2xs"
          >
            Public Profile →
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
            <Calendar className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{appointments.length}</div>
          <div className="text-xs text-slate-500">All-time patient requests</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{confirmedAppointments.length}</div>
          <div className="text-xs text-emerald-700 font-semibold">Active upcoming visits</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pilot Plan</span>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-700">₹499<span className="text-xs font-normal text-slate-500">/mo</span></div>
          <div className="text-xs text-teal-800 font-medium">Flat subscription • 0% commission</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Status</span>
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">Active</div>
          <div className="text-xs text-slate-500">Clinic open for discovery</div>
        </div>
      </div>

      {/* Main Grid: Recent Appointments & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments Queue */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming Patient Appointments</h2>
              <p className="text-xs text-slate-500">Patient appointments booked via Dr Khojo</p>
            </div>
            <Link
              href="/doctor/appointments"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              View All ({appointments.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Patient Appointments Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                As per platform rules, new doctors start with a clean appointment list. When patients book slots, they appear here instantly.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 5).map((appt) => (
                <div
                  key={appt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{appt.patientName}</span>
                      <span className="text-[11px] text-slate-500">({appt.patientPhone})</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span>{appt.date}</span>
                      <span>•</span>
                      <span>{appt.timeSlot}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {appt.appointmentType === 'EMERGENCY' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                        🚨 Emergency
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        🗓️ Regular
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        appt.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clinic & Profile Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Clinic Quick Details
            </h3>

            {activeDoctor ? (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-slate-500 mb-0.5">Clinic Name</div>
                  <div className="font-bold text-slate-900">{activeDoctor.clinicName}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-0.5">Address</div>
                  <div className="text-slate-700">{activeDoctor.address}, {activeDoctor.city}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-0.5">Consultation Fee</div>
                  <div className="font-bold text-teal-700">₹{activeDoctor.consultationFee}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-0.5">Current Schedule</div>
                  <div className="text-slate-700">{activeDoctor.availabilityToday}</div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No clinic details loaded.</p>
            )}

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/doctor/profile"
                className="w-full text-center py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                Edit Clinic Details
              </Link>
              <Link
                href="/doctor/verification"
                className="w-full text-center py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors"
              >
                View Verification Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { appointmentService } from '@/services/appointmentService';
import { BookedAppointment } from '@/components/AppointmentsModal';
import {
  CalendarCheck,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
} from 'lucide-react';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<BookedAppointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'REGULAR' | 'EMERGENCY'>('ALL');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const list = appointmentService.getAllAppointments();
    setAppointments(list);
  };

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this patient appointment?')) {
      appointmentService.cancelAppointment(id);
      loadAppointments();
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesType =
      typeFilter === 'ALL' ||
      (typeFilter === 'EMERGENCY' ? a.appointmentType === 'EMERGENCY' : a.appointmentType !== 'EMERGENCY');
    const matchesSearch =
      !searchQuery ||
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientPhone.includes(searchQuery) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Appointments</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and manage consultations scheduled at your clinic
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            {(['ALL', 'CONFIRMED', 'CANCELLED'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  statusFilter === filter
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            {(['ALL', 'REGULAR', 'EMERGENCY'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  typeFilter === t
                    ? t === 'EMERGENCY'
                      ? 'bg-rose-700 text-white'
                      : 'bg-teal-700 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t === 'EMERGENCY' ? '🚨 Emergency' : t === 'REGULAR' ? '🗓️ Regular' : 'All Types'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by patient name, phone, or appointment ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Appointments Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {appointments.length === 0
                ? 'No patient appointments exist yet. Appointments booked by patients will show here.'
                : 'No appointments match your current filter.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                      {appt.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        appt.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {appt.status}
                    </span>
                    {appt.appointmentType === 'EMERGENCY' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                        🚨 Emergency
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        🗓️ Regular
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-900">{appt.patientName}</span>
                    <span className="text-slate-400 text-xs">•</span>
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-600">{appt.patientPhone}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {appt.date} at {appt.timeSlot}
                    </span>
                    <span>Fee: ₹{appt.consultationFee}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {appt.status === 'CONFIRMED' && (
                    <button
                      type="button"
                      onClick={() => handleCancel(appt.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                    >
                      Cancel Visit
                    </button>
                  )}
                  <Link
                    href={`/appointments/${appt.id}`}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { appointmentService } from '@/services/appointmentService';
import { BookedAppointment } from '@/components/AppointmentsModal';
import {
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Phone,
  User,
  Clock,
} from 'lucide-react';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<BookedAppointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'REGULAR' | 'EMERGENCY'>('ALL');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    setAppointments(appointmentService.getAllAppointments());
  };

  const handleCancel = (id: string) => {
    if (confirm('Admin action: Cancel this appointment?')) {
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
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientPhone.includes(searchQuery) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments Registry</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global appointment audit log and patient bookings tracking
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
          placeholder="Search by ID, patient, doctor, or phone..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Appointments Recorded</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {appointments.length === 0
                ? 'System starts clean with zero initial appointments. When users book consultations, they are logged here.'
                : 'No appointments match the search filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">ID & Status</th>
                  <th className="py-3.5 px-5">Patient Details</th>
                  <th className="py-3.5 px-5">Doctor & Clinic</th>
                  <th className="py-3.5 px-5">Date & Slot</th>
                  <th className="py-3.5 px-5">Fee</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-mono font-bold text-teal-700">{appt.id}</div>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900">{appt.patientName}</div>
                      <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {appt.patientPhone}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-800">{appt.doctorName}</div>
                      <div className="text-[11px] text-slate-400">{appt.clinicName}</div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-medium text-slate-800">{appt.date}</div>
                      <div className="text-slate-500">{appt.timeSlot}</div>
                    </td>

                    <td className="py-4 px-5 font-bold text-slate-900">₹{appt.consultationFee}</td>

                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        {appt.status === 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => handleCancel(appt.id)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <Link
                          href={`/appointments/${appt.id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

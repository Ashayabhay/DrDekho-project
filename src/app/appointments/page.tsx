'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { appointmentService } from '@/services/appointmentService';
import { locationService, LocationItem } from '@/services/locationService';
import { BookedAppointment } from '@/components/AppointmentsModal';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Search,
  ArrowRight,
} from 'lucide-react';

export default function AppointmentsPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>({
    city: 'Jaipur',
    state: 'Rajasthan',
  });
  const [appointments, setAppointments] = useState<BookedAppointment[]>([]);

  useEffect(() => {
    setSelectedLocation(locationService.getCurrentLocation());
    setAppointments(appointmentService.getAllAppointments());
  }, []);

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      appointmentService.cancelAppointment(id);
      setAppointments(appointmentService.getAllAppointments());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Calendar className="w-7 h-7 text-teal-700" />
              Your Appointments
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track upcoming consultations, clinic visits, and appointment status.
            </p>
          </div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs self-start sm:self-auto"
          >
            <Search className="w-3.5 h-3.5" /> Book New Appointment
          </Link>
        </div>

        {/* Appointments List */}
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-teal-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        {appt.speciality}
                      </span>
                      {appt.appointmentType === 'EMERGENCY' && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          🚨 Emergency Appointment
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {appt.doctorName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">{appt.clinicName}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border self-start ${
                      appt.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {appt.status === 'CONFIRMED' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {appt.status}
                  </span>
                </div>

                {/* Date & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2 font-semibold text-teal-900">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{appt.date} at {appt.timeSlot}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="truncate">{appt.clinicAddress}</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="text-slate-500">
                    Fee: <strong className="text-slate-900">₹{appt.consultationFee}</strong> (Pay at Clinic)
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/appointments/${appt.id}`}
                      className="font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {appt.status === 'CONFIRMED' && (
                      <button
                        type="button"
                        onClick={() => handleCancel(appt.id)}
                        className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                No appointments booked yet
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                You haven&apos;t booked an appointment yet. Browse verified local doctors and reserve your slot.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors"
              >
                <Search className="w-3.5 h-3.5" /> Find a Doctor
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

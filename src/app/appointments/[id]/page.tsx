'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  ArrowLeft,
  User,
  Phone,
  AlertCircle,
} from 'lucide-react';

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [selectedLocation, setSelectedLocation] = useState<LocationItem>({
    city: 'Jaipur',
    state: 'Rajasthan',
  });
  const [appointment, setAppointment] = useState<BookedAppointment | null>(null);

  useEffect(() => {
    setSelectedLocation(locationService.getCurrentLocation());
    if (appointmentId) {
      const appt = appointmentService.getAppointmentById(appointmentId);
      setAppointment(appt || null);
    }
  }, [appointmentId]);

  const handleCancel = () => {
    if (!appointment) return;
    if (confirm('Are you sure you want to cancel this appointment?')) {
      appointmentService.cancelAppointment(appointment.id);
      setAppointment(appointmentService.getAppointmentById(appointment.id) || null);
    }
  };

  if (!appointment) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 text-center space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Appointment Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            This appointment ID does not exist in your account.
          </p>
          <Link
            href="/appointments"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800"
          >
            ← View All Appointments
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link
          href="/appointments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Appointments
        </Link>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase">
                ID: {appointment.id}
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                {appointment.appointmentType === 'EMERGENCY' ? 'Emergency Appointment Details' : 'Appointment Details'}
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              {appointment.appointmentType === 'EMERGENCY' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border bg-rose-50 text-rose-700 border-rose-300">
                  🚨 Emergency Priority
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                  appointment.status === 'CONFIRMED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {appointment.status === 'CONFIRMED' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {appointment.status}
              </span>
            </div>
          </div>

          {/* Doctor & Clinic */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-50 px-2.5 py-1 rounded-md inline-block">
              Doctor & Clinic
            </h3>
            <div className="space-y-1">
              <div className="text-lg font-bold text-slate-900">{appointment.doctorName}</div>
              <div className="text-xs font-medium text-teal-800">{appointment.speciality}</div>
              <div className="flex items-center gap-2 text-sm text-slate-700 pt-1">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold">{appointment.clinicName}</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{appointment.clinicAddress}</span>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-50 px-2.5 py-1 rounded-md inline-block">
              Schedule & Timing
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-medium">Date</div>
                <div className="font-bold text-slate-800 mt-0.5">{appointment.date}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-400 font-medium">Time Slot</div>
                <div className="font-bold text-teal-800 mt-0.5">{appointment.timeSlot}</div>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-50 px-2.5 py-1 rounded-md inline-block">
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span>{appointment.patientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{appointment.patientPhone}</span>
              </div>
            </div>
          </div>

          {/* Fee & Action */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-semibold">Consultation Fee</div>
              <div className="text-xl font-extrabold text-slate-900">
                ₹{appointment.consultationFee} <span className="text-xs font-normal text-slate-500">(Pay at Clinic)</span>
              </div>
            </div>

            {appointment.status === 'CONFIRMED' && (
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
              >
                Cancel Appointment
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { doctorService } from '@/services/doctorService';
import { locationService, LocationItem } from '@/services/locationService';
import { Doctor } from '@/components/DoctorCard';
import {
  Stethoscope,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Award,
  IndianRupee,
} from 'lucide-react';

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [selectedLocation, setSelectedLocation] = useState<LocationItem>({
    city: 'Jaipur',
    state: 'Rajasthan',
  });
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    setSelectedLocation(locationService.getCurrentLocation());
    if (doctorId) {
      const doc = doctorService.getDoctorById(doctorId);
      setDoctor(doc || null);
    }
  }, [doctorId]);

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Doctor Profile Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            The requested doctor profile does not exist or has been removed.
          </p>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800"
          >
            ← Back to Doctors
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <Link href="/doctors" className="hover:text-teal-700">Doctors</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{doctor.name}</span>
        </div>

        {/* Doctor Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    {doctor.speciality}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Profile
                  </span>
                  {doctor.providesEmergency && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                      🚨 Emergency Appointments Available
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {doctor.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {doctor.qualification} • {doctor.experienceYears} Years Experience
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2 bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-slate-200">
              <div className="text-xs text-slate-400 font-semibold uppercase">Consultation Fee</div>
              <div className="text-2xl font-extrabold text-slate-900 flex items-center">
                ₹{doctor.consultationFee}
                <span className="text-xs font-normal text-slate-500 ml-1.5">(Pay at Clinic)</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => router.push(`/book/${doctor.id}`)}
                  className="px-6 py-3 text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md transition-colors cursor-pointer text-center"
                >
                  Book Appointment
                </button>

                {doctor.providesEmergency && (
                  <button
                    type="button"
                    onClick={() => router.push(`/book/${doctor.id}?type=emergency`)}
                    className="px-5 py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    🚨 Book Emergency Appointment
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Clinic & Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-50 px-2.5 py-1 rounded-md inline-block">
                Clinic & Address
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{doctor.clinicName}</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{doctor.address}, {doctor.city}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-50 px-2.5 py-1 rounded-md inline-block">
                Consultation Hours
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2 text-teal-900 font-semibold">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Daily: {doctor.availabilityToday}</span>
                </div>
                <div className="text-xs text-slate-500">
                  Clinic maintains real-time slot pacing. Walk-ins subject to queue; priority given to Dr Khojo reservations.
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200/80 text-xs text-teal-950 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Zero Patient Booking Fee:</span> Booking through Dr Khojo is 100% free for patients. Pay consultation fees directly at the clinic reception.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

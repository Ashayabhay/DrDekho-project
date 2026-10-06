'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { doctorService } from '@/services/doctorService';
import { appointmentService } from '@/services/appointmentService';
import { locationService } from '@/services/locationService';
import {
  Stethoscope,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [doctorCount, setDoctorCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [stateCount, setStateCount] = useState(0);
  const [cityCount, setCityCount] = useState(0);

  useEffect(() => {
    const doctors = doctorService.getAllDoctors();
    setDoctorCount(doctors.length);

    const appointments = appointmentService.getAllAppointments();
    setAppointmentCount(appointments.length);

    const states = locationService.getAllStates();
    setStateCount(states.length);

    const cities = locationService.getAllCities();
    setCityCount(cities.length);
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Platform Administration Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Real-time metrics for Dr Khojo discovery platform, practitioner onboarding, Pan-India geographic coverage, and appointment flow.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Doctors</span>
            <Stethoscope className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{doctorCount}</div>
          <div className="text-xs text-teal-700 font-semibold">Active verified listings</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Patient Bookings</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{appointmentCount}</div>
          <div className="text-xs text-slate-500">Scheduled consultations</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">States & UTs Covered</span>
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stateCount}</div>
          <div className="text-xs text-emerald-700 font-semibold">{cityCount}+ Cities in Directory</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pilot Subscription</span>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹499/mo</div>
          <div className="text-xs text-slate-500">Flat model (zero commission)</div>
        </div>
      </div>

      {/* Navigation Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Doctor Directory Management</h3>
            <p className="text-xs text-slate-500">
              Review registered doctors, verify credentials, modify consultation fees, or add new clinic listings.
            </p>
          </div>
          <Link
            href="/admin/doctors"
            className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-800 hover:text-teal-900 text-xs font-bold border border-slate-200 transition-colors"
          >
            <span>Manage Doctors</span>
            <ArrowRight className="w-4 h-4 text-teal-600" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Locations & Coverage</h3>
            <p className="text-xs text-slate-500">
              Inspect all Indian states, districts, and cities currently available in the Dr Khojo location selector.
            </p>
          </div>
          <Link
            href="/admin/locations"
            className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 text-xs font-bold border border-slate-200 transition-colors"
          >
            <span>Inspect Locations</span>
            <ArrowRight className="w-4 h-4 text-emerald-600" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Appointments Registry</h3>
            <p className="text-xs text-slate-500">
              Track live patient bookings, confirmations, and cancellations across all clinics in the system.
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-900 text-xs font-bold border border-slate-200 transition-colors"
          >
            <span>View Appointments</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}

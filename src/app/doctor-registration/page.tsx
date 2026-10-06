'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { doctorService } from '@/services/doctorService';
import { locationService, LocationItem } from '@/services/locationService';
import { Doctor } from '@/components/DoctorCard';
import {
  Stethoscope,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  IndianRupee,
  BadgeCheck,
} from 'lucide-react';

const SPECIALITY_OPTIONS = [
  'General Physician',
  'Dermatologist',
  'Pediatrician',
  'Gynecologist',
  'Orthopedist',
  'Dentist',
  'Cardiologist',
  'ENT Specialist',
  'Ophthalmologist',
  'Psychiatrist',
  'Neurologist',
];

export default function DoctorRegistrationPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>({
    city: 'Jaipur',
    state: 'Rajasthan',
  });

  const [allStates, setAllStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '',
    speciality: 'General Physician',
    qualification: '',
    experienceYears: 5,
    clinicName: '',
    state: 'Rajasthan',
    city: 'Jaipur',
    address: '',
    consultationFee: 400,
    availabilityToday: '10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM',
    registrationNumber: '',
    providesEmergency: false,
    emergencyFee: 600,
    emergencyHours: '06:00 PM - 10:00 PM',
    emergencyInstructions: 'Report to emergency reception counter immediately upon arrival.',
  });

  const [submittedDoctor, setSubmittedDoctor] = useState<Doctor | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loc = locationService.getCurrentLocation();
    setSelectedLocation(loc);
    const states = locationService.getAllStates();
    setAllStates(states);
    const cities = locationService.getCitiesByState(loc.state);
    setAvailableCities(cities);

    setForm((prev) => ({
      ...prev,
      state: loc.state,
      city: loc.city,
    }));
  }, []);

  const handleStateChange = (state: string) => {
    const cities = locationService.getCitiesByState(state);
    setAvailableCities(cities);
    setForm((prev) => ({
      ...prev,
      state,
      city: cities[0] || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.clinicName.trim() || !form.address.trim()) {
      setErrorMsg('Please fill in all mandatory clinic and doctor fields.');
      return;
    }

    const newDocId = `doc-${Date.now().toString(36)}`;
    const newDoctor: Doctor = {
      id: newDocId,
      name: form.name.startsWith('Dr.') ? form.name : `Dr. ${form.name}`,
      speciality: form.speciality,
      qualification: form.qualification || 'MBBS',
      experienceYears: Number(form.experienceYears) || 5,
      clinicName: form.clinicName,
      address: form.address,
      city: form.city,
      consultationFee: Number(form.consultationFee) || 400,
      availabilityToday: form.availabilityToday || '10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM',
      providesEmergency: form.providesEmergency,
      emergencyFee: form.providesEmergency ? (Number(form.emergencyFee) || 600) : undefined,
      emergencyHours: form.providesEmergency ? form.emergencyHours : undefined,
      emergencyInstructions: form.providesEmergency ? form.emergencyInstructions : undefined,
    };

    doctorService.registerDoctor(newDoctor);
    setSubmittedDoctor(newDoctor);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => {
          locationService.setCurrentLocation(loc);
          setSelectedLocation(loc);
        }}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <span className="text-slate-800">Doctor Registration</span>
        </div>

        {submittedDoctor ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-teal-200 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold tracking-wide">
                Founding Pilot Enrolled
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Welcome to Dr Khojo, {submittedDoctor.name}!
              </h1>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Your clinic <strong>{submittedDoctor.clinicName}</strong> in {submittedDoctor.city} is now registered.
                Patients can now discover your consultation slots directly.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Speciality:</span>
                <span className="font-bold text-slate-900">{submittedDoctor.speciality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-slate-900">{submittedDoctor.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fee:</span>
                <span className="font-bold text-teal-700">₹{submittedDoctor.consultationFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Emergency Appointments:</span>
                <span className={`font-bold ${submittedDoctor.providesEmergency ? 'text-rose-700' : 'text-slate-600'}`}>
                  {submittedDoctor.providesEmergency
                    ? `🚨 Enabled (${submittedDoctor.emergencyHours || 'Active'})`
                    : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Founding Pilot Price:</span>
                <span className="font-bold text-slate-900">₹499/month (30-day trial activated)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/doctors/${submittedDoctor.id}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs text-center transition-colors"
              >
                View Public Profile
              </Link>
              <Link
                href="/doctor/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-colors"
              >
                Go to Doctor Portal →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-3 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-800/80 border border-teal-700 rounded-full text-xs font-bold text-teal-200">
                <Sparkles className="w-3.5 h-3.5" />
                Founding Pilot Program
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Register Your Clinic on Dr Khojo
              </h1>
              <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed">
                Empower patients in your city to find your clinic with zero friction.
                Flat ₹499/month per clinic for one doctor. Free verified listing and no commission on patient visits.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  Doctor Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your medical qualification and practitioner credentials
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Speciality *</label>
                  <select
                    value={form.speciality}
                    onChange={(e) => setForm({ ...form, speciality: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  >
                    {SPECIALITY_OPTIONS.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Qualification</label>
                  <input
                    type="text"
                    value={form.qualification}
                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                    placeholder="e.g. MBBS, MD (Medicine)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">State Medical Council / Registration No.</label>
                  <input
                    type="text"
                    value={form.registrationNumber}
                    onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                    placeholder="e.g. RMC/2014/19822 or MCI registration ID"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="border-b border-slate-100 pt-4 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  Clinic & Location Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Where patients will visit you for offline consultations
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Clinic Name *</label>
                  <input
                    type="text"
                    required
                    value={form.clinicName}
                    onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                    placeholder="e.g. Sharma Health Clinic"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">State *</label>
                  <select
                    value={form.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  >
                    {allStates.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">City / District *</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  >
                    {availableCities.map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Complete Address & Landmark *</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="e.g. 12-A, Tonk Road, Near SMS Hospital"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Consultation Fee (₹) *</label>
                  <div className="relative">
                    <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="number"
                      required
                      min="0"
                      step="50"
                      value={form.consultationFee}
                      onChange={(e) => setForm({ ...form, consultationFee: Number(e.target.value) })}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Working / Availability Hours</label>
                  <input
                    type="text"
                    value={form.availabilityToday}
                    onChange={(e) => setForm({ ...form, availabilityToday: e.target.value })}
                    placeholder="e.g. 10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* EMERGENCY SERVICE CONFIGURATION */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-rose-600">🚨</span>
                    Emergency Appointments Capability
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Decide whether patients can request emergency appointments with your clinic.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">
                    Do you provide emergency appointments? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, providesEmergency: false })}
                      className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        !form.providesEmergency
                          ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      No, I don&apos;t provide emergency appointments
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm({ ...form, providesEmergency: true })}
                      className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        form.providesEmergency
                          ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Yes, I provide emergency appointments
                    </button>
                  </div>
                </div>

                {/* Sub-config when YES */}
                {form.providesEmergency && (
                  <div className="p-4 sm:p-5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-4 mt-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                      <span>🚨</span>
                      <span>Configure Your Emergency Service Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Emergency Consultation Fee (₹) *
                        </label>
                        <div className="relative">
                          <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={form.emergencyFee}
                            onChange={(e) =>
                              setForm({ ...form, emergencyFee: Number(e.target.value) })
                            }
                            className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Emergency Hours / Shift Range *
                        </label>
                        <input
                          type="text"
                          value={form.emergencyHours}
                          onChange={(e) => setForm({ ...form, emergencyHours: e.target.value })}
                          placeholder="e.g. 06:00 PM - 10:00 PM or 24/7"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700">
                          Emergency Patient Arrival Instructions
                        </label>
                        <input
                          type="text"
                          value={form.emergencyInstructions}
                          onChange={(e) =>
                            setForm({ ...form, emergencyInstructions: e.target.value })
                          }
                          placeholder="e.g. Report directly to emergency triage counter at reception."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Notice */}
              <div className="p-4 bg-teal-50 border border-teal-200/80 rounded-2xl flex items-start gap-3">
                <BadgeCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-xs text-teal-950 space-y-1">
                  <div className="font-bold">Pilot Guarantee: ₹499/month, zero booking commissions</div>
                  <div className="text-teal-800">
                    Patients book appointments directly. No deduction from your consultation fee. Cancel or update your availability at any time.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                Submit Registration & Activate Clinic Listing
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

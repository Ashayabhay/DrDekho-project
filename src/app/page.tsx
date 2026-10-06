'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { DoctorCard, Doctor } from '@/components/DoctorCard';
import { Footer } from '@/components/Footer';
import { DoctorRegistrationModal } from '@/components/DoctorRegistrationModal';
import { AppointmentsModal, BookedAppointment } from '@/components/AppointmentsModal';
import { doctorService } from '@/services/doctorService';
import { appointmentService } from '@/services/appointmentService';
import { locationService, LocationItem } from '@/services/locationService';
import {
  Search,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  Building2,
  MapPin,
  UserPlus,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  Heart,
  Baby,
  Smile,
  Activity,
  Bone,
  PhoneCall,
  AlertTriangle,
  HeartPulse,
  ShieldAlert,
  Phone,
} from 'lucide-react';

const POPULAR_SPECIALITIES = [
  { label: 'All Specialities', icon: Stethoscope },
  { label: 'General Physician', icon: Activity },
  { label: 'Pediatrician', icon: Baby },
  { label: 'Dermatologist', icon: Sparkles },
  { label: 'Gynecologist', icon: Heart },
  { label: 'Dentist', icon: Smile },
  { label: 'Orthopedist', icon: Bone },
];

interface EmergencyCenter {
  name: string;
  address: string;
  phone: string;
  type: string;
}

const CITY_EMERGENCY_CENTERS: Record<string, EmergencyCenter[]> = {
  jaipur: [
    {
      name: 'SMS Hospital 24x7 Trauma & Casualty Center',
      address: 'Tonk Road, Near SMS Stadium, Jaipur',
      phone: '0141-2518224',
      type: 'Apex Government Trauma',
    },
    {
      name: 'Santokba Durlabhji (SDMH) 24x7 Emergency',
      address: 'Bhawani Singh Road, Bapu Nagar, Jaipur',
      phone: '0141-2566251',
      type: 'NABH Multi-Speciality Emergency',
    },
    {
      name: 'Fortis Escorts Hospital Emergency Care',
      address: 'JLN Marg, Malviya Nagar, Jaipur',
      phone: '0141-2547000',
      type: 'Cardiac & Trauma Emergency',
    },
  ],
  patna: [
    {
      name: 'AIIMS Patna 24x7 Emergency & Trauma Centre',
      address: 'Phulwari Sharif, Patna, Bihar',
      phone: '0612-2451006',
      type: 'National Apex Emergency',
    },
    {
      name: 'PMCH Casualty & Emergency Ward',
      address: 'Ashok Rajpath, Near Gandhi Maidan, Patna',
      phone: '0612-2300080',
      type: 'Government Medical College Casualty',
    },
    {
      name: 'Paras HMRI 24x7 Emergency Wing',
      address: 'NH 30, Bailey Road, Raja Bazar, Patna',
      phone: '0612-7107777',
      type: 'Critical Care & Trauma',
    },
  ],
  'new delhi': [
    {
      name: 'AIIMS New Delhi 24x7 Emergency Department',
      address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
      phone: '011-26588500',
      type: 'National Apex Emergency',
    },
    {
      name: 'Safdarjung Hospital Emergency & Burns Wing',
      address: 'Ring Road, Opposite AIIMS, New Delhi',
      phone: '011-26165060',
      type: 'Multi-Speciality Casualty',
    },
  ],
  mumbai: [
    {
      name: 'KEM Hospital 24x7 Emergency & Trauma Care',
      address: 'Acharya Donde Marg, Parel, Mumbai',
      phone: '022-24107000',
      type: 'Municipal Apex Trauma',
    },
    {
      name: 'Lilavati Hospital & Research Centre Emergency',
      address: 'A-791, Bandra Reclamation, Bandra West, Mumbai',
      phone: '022-26751000',
      type: '24x7 Acute Critical Care',
    },
  ],
  bengaluru: [
    {
      name: 'Victoria Hospital 24x7 Emergency & Trauma',
      address: 'Fort Road, Near City Market, Bengaluru',
      phone: '080-26701150',
      type: 'Government Apex Trauma',
    },
    {
      name: 'Manipal Hospital 24x7 Emergency Care',
      address: '98, HAL Old Airport Road, Kodihalli, Bengaluru',
      phone: '080-25024444',
      type: 'Comprehensive Emergency Medicine',
    },
  ],
};

function getEmergencyCentersForCity(city: string): EmergencyCenter[] {
  const normalized = city.toLowerCase();
  if (CITY_EMERGENCY_CENTERS[normalized]) {
    return CITY_EMERGENCY_CENTERS[normalized];
  }
  return [
    {
      name: `${city} District Civil Hospital 24x7 Casualty Ward`,
      address: `Civil Hospital Campus, Main Hospital Road, ${city}`,
      phone: '108',
      type: 'District 24x7 Casualty',
    },
    {
      name: `${city} Government Medical College Trauma Center`,
      address: `Medical College Road, Central Ward, ${city}`,
      phone: '112',
      type: 'Apex Government Trauma',
    },
  ];
}

export default function Home() {
  const router = useRouter();

  // Centralized Location State
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>({
    city: 'Jaipur',
    state: 'Rajasthan',
  });

  const [selectedSpeciality, setSelectedSpeciality] = useState<string>('All Specialities');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<BookedAppointment[]>([]);

  // Modals state
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState<boolean>(false);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState<boolean>(false);

  // Initialize from services
  useEffect(() => {
    const loc = locationService.getCurrentLocation();
    setSelectedLocation(loc);
    loadDoctors(loc.city);
    loadAppointments();
  }, []);

  const loadDoctors = (city: string) => {
    const docs = doctorService.getAllDoctors();
    setDoctorsList(docs);
  };

  const loadAppointments = () => {
    const list = appointmentService.getAllAppointments();
    setAppointments(list);
  };

  // Handle location update
  const handleSelectLocation = (loc: LocationItem) => {
    locationService.setCurrentLocation(loc);
    setSelectedLocation(loc);
  };

  // Handle registration callback
  const handleDoctorRegistered = (newDoctor: Doctor) => {
    doctorService.registerDoctor(newDoctor);
    loadDoctors(newDoctor.city);
    setSelectedLocation({
      city: newDoctor.city,
      state: 'Selected State',
    });
  };

  // Navigate to booking flow
  const handleBookDoctor = (doctorId: string) => {
    router.push(`/book/${doctorId}`);
  };

  // Cancel appointment from modal
  const handleCancelAppointment = (id: string) => {
    appointmentService.cancelAppointment(id);
    loadAppointments();
  };

  // Filter doctors based on current location, speciality, and search text
  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesCity = doc.city.toLowerCase() === selectedLocation.city.toLowerCase();
    const matchesSpeciality =
      selectedSpeciality === 'All Specialities' || doc.speciality === selectedSpeciality;
    const matchesSearch =
      searchQuery.trim() === '' ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesSpeciality && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
        onOpenDoctorRegistration={() => setIsDoctorModalOpen(true)}
        onOpenAppointments={() => {
          loadAppointments();
          setIsAppointmentsModalOpen(true);
        }}
      />

      <main className="flex-1 space-y-12">
        {/* Consumer-First Hero Section */}
        <section className="bg-gradient-to-b from-teal-50/80 via-white to-slate-50 border-b border-slate-200/60 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            {/* Live Pilot Location Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-100/90 text-teal-800 border border-teal-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>
                Discovering verified clinics in {selectedLocation.city}, {selectedLocation.state}
              </span>
            </div>

            {/* Value Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Find trusted doctors & book appointments in{' '}
              <span className="text-teal-700 underline decoration-teal-300 underline-offset-4">
                {selectedLocation.city}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Skip crowded waiting rooms. Discover verified neighborhood doctors, compare consultation fees, and reserve your direct clinic slot in seconds.
            </p>

            {/* Instant Consumer Search Box */}
            <div className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200/90 p-2 focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-teal-600 transition-all">
                <Search className="w-5 h-5 text-teal-600 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder={`Search doctors, clinics, or conditions in ${selectedLocation.city}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-3 cursor-pointer"
                  >
                    Clear
                  </button>
                ) : (
                  <Link
                    href="/doctors"
                    className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition-colors shrink-0"
                  >
                    Explore All
                  </Link>
                )}
              </div>
            </div>

            {/* Popular Specialities Pills */}
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Popular Specialities
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {POPULAR_SPECIALITIES.map((spec) => {
                  const Icon = spec.icon;
                  const isSelected = selectedSpeciality === spec.label;
                  return (
                    <button
                      key={spec.label}
                      type="button"
                      onClick={() => setSelectedSpeciality(spec.label)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-teal-600'}`} />
                      {spec.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Doctor Discovery Results Section */}
        <section id="search" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-700" />
                Available Doctors in {selectedLocation.city}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Showing {filteredDoctors.length} verified doctor{filteredDoctors.length !== 1 ? 's' : ''} in{' '}
                {selectedLocation.city}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/doctor-registration"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-teal-700" />
                Are you a Doctor? Register here
              </Link>

              <div className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>{selectedLocation.city}, {selectedLocation.state}</span>
              </div>
            </div>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onBookClick={handleBookDoctor}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center max-w-lg mx-auto my-8 space-y-4 shadow-2xs">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  No doctors listed in {selectedLocation.city} yet
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Are you a clinic owner or doctor in {selectedLocation.city}? Join our founding pilot program today.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <Link
                  href="/doctor-registration"
                  className="px-4 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors"
                >
                  Register Doctor in {selectedLocation.city}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectLocation({ city: 'Jaipur', state: 'Rajasthan' });
                    setSelectedSpeciality('All Specialities');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors cursor-pointer"
                >
                  View Jaipur Doctors
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 3 Calm Trust Pillars */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">100% Free for Patients</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Search, compare, and book consultation slots with zero fees.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Verified Clinic Addresses</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Every doctor&apos;s physical clinic and schedule is manually audited.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Upfront Consultation Fees</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Clear pricing before booking. Pay directly at the doctor&apos;s clinic desk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            24/7 EMERGENCY & CRITICAL URGENT CARE DIRECTORY
           ======================================================== */}
        <section
          id="emergency"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28"
        >
          <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 rounded-3xl p-6 sm:p-8 text-white border border-rose-800/80 shadow-md space-y-6">
            {/* Header with live emergency beacon */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-800/60 pb-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                  24/7 EMERGENCY & URGENT CARE DIRECTORY
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Immediate Medical Assistance in {selectedLocation.city}
                </h2>
                <p className="text-xs sm:text-sm text-rose-100/90 max-w-2xl">
                  For sudden acute trauma, cardiac distress, poisoning, or life-threatening symptoms, contact national emergency lines or visit a verified 24x7 hospital casualty center immediately.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="tel:108"
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  Call Ambulance (108)
                </a>
                <a
                  href="tel:112"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-300" />
                  All Emergency (112)
                </a>
              </div>
            </div>

            {/* Quick 1-Tap Helplines Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              <a
                href="tel:108"
                className="p-3 rounded-2xl bg-white/5 hover:bg-rose-900/60 border border-rose-700/50 transition-all text-center group cursor-pointer"
              >
                <div className="text-[11px] text-rose-300 font-semibold uppercase tracking-wider">
                  Ambulance
                </div>
                <div className="text-lg font-black text-white group-hover:text-rose-200">
                  108
                </div>
                <div className="text-[10px] text-slate-400">Toll-Free • 24x7</div>
              </a>

              <a
                href="tel:112"
                className="p-3 rounded-2xl bg-white/5 hover:bg-rose-900/60 border border-rose-700/50 transition-all text-center group cursor-pointer"
              >
                <div className="text-[11px] text-rose-300 font-semibold uppercase tracking-wider">
                  National Helpline
                </div>
                <div className="text-lg font-black text-white group-hover:text-rose-200">
                  112
                </div>
                <div className="text-[10px] text-slate-400">Police & Medical</div>
              </a>

              <a
                href="tel:104"
                className="p-3 rounded-2xl bg-white/5 hover:bg-rose-900/60 border border-rose-700/50 transition-all text-center group cursor-pointer"
              >
                <div className="text-[11px] text-rose-300 font-semibold uppercase tracking-wider">
                  Health & Blood
                </div>
                <div className="text-lg font-black text-white group-hover:text-rose-200">
                  104
                </div>
                <div className="text-[10px] text-slate-400">Medical Advice & Blood</div>
              </a>

              <a
                href="tel:1091"
                className="p-3 rounded-2xl bg-white/5 hover:bg-rose-900/60 border border-rose-700/50 transition-all text-center group cursor-pointer"
              >
                <div className="text-[11px] text-rose-300 font-semibold uppercase tracking-wider">
                  Women Helpline
                </div>
                <div className="text-lg font-black text-white group-hover:text-rose-200">
                  1091
                </div>
                <div className="text-[10px] text-slate-400">Women Protection</div>
              </a>

              <a
                href="tel:1098"
                className="p-3 rounded-2xl bg-white/5 hover:bg-rose-900/60 border border-rose-700/50 transition-all text-center group cursor-pointer"
              >
                <div className="text-[11px] text-rose-300 font-semibold uppercase tracking-wider">
                  Childline
                </div>
                <div className="text-lg font-black text-white group-hover:text-rose-200">
                  1098
                </div>
                <div className="text-[10px] text-slate-400">Child Emergency</div>
              </a>
            </div>

            {/* Emergency Triage Notice */}
            <div className="p-4 bg-rose-900/40 rounded-2xl border border-rose-800/80 flex items-start gap-3 text-xs text-rose-100">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-white">When to seek emergency hospital care: </span>
                Severe crushing chest pain, sudden numbness or paralysis, acute breathlessness, uncontrolled bleeding, poisoning, or head trauma with unconsciousness. For routine outpatient consultations, use our standard doctor search above.
              </div>
            </div>

            {/* Verified 24x7 Emergency Casualty Hospitals in Current City */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-rose-200 uppercase tracking-wider flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-400" />
                  Verified 24x7 Casualty & Trauma Wings in {selectedLocation.city}
                </h3>
                <span className="text-[11px] text-slate-400">Open 24 Hours • 7 Days</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {getEmergencyCentersForCity(selectedLocation.city).map((center, idx) => (
                  <div
                    key={`${center.name}-${idx}`}
                    className="p-4 rounded-2xl bg-white/5 border border-rose-800/40 hover:border-rose-600/60 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {center.type}
                      </span>
                      <div className="font-bold text-sm text-white">{center.name}</div>
                      <div className="text-xs text-slate-300 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{center.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">Casualty Desk</span>
                      <a
                        href={`tel:${center.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {center.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Doctor & Clinic Value Proposition Section */}
        <section id="for-clinics" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-teal-800/90 text-teal-200 border border-teal-700">
                FOR CLINIC OWNERS & PRACTITIONERS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                Join Dr Khojo as a Founding Pilot Clinic
              </h2>
              <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
                Streamline your clinic reception, prevent waiting room chaos, and let patients book confirmed appointments directly.
              </p>
              <ul className="space-y-2.5 text-xs text-teal-100/90 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  Flat ₹499/month per clinic for 1 doctor during founding launch
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  0% commission on consultations (all fees stay with the clinic)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  Printable reception desk QR code for instant patient booking
                </li>
              </ul>
            </div>

            <div className="bg-teal-950/80 rounded-2xl border border-teal-800/80 p-6 space-y-4 text-center">
              <div className="text-xs uppercase tracking-wider text-teal-400 font-bold">
                Founding Pilot Plan
              </div>
              <div className="text-4xl font-black text-white">
                ₹499 <span className="text-xs font-normal text-teal-300">/ month</span>
              </div>
              <p className="text-xs text-teal-200/90">
                Targeting our first 3 pilot clinics. Simple, transparent, and cancellation anytime.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 justify-center">
                <Link
                  href="/doctor-registration"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-300 hover:bg-teal-200 text-teal-950 font-bold text-xs shadow-xs text-center transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Register Your Clinic
                </Link>
                <Link
                  href="/doctor/dashboard"
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-teal-200 font-bold text-xs border border-teal-700 text-center transition-colors"
                >
                  Doctor Portal →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Doctor Registration Modal */}
      <DoctorRegistrationModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onDoctorRegistered={handleDoctorRegistered}
      />

      {/* Patient Appointments Modal */}
      <AppointmentsModal
        isOpen={isAppointmentsModalOpen}
        onClose={() => setIsAppointmentsModalOpen(false)}
        appointments={appointments}
        onCancelAppointment={handleCancelAppointment}
        onFindDoctorClick={() => {
          setIsAppointmentsModalOpen(false);
          const searchElem = document.getElementById('search');
          searchElem?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <Footer />
    </div>
  );
}

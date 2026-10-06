'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DoctorCard, Doctor } from '@/components/DoctorCard';
import { doctorService } from '@/services/doctorService';
import { locationService, LocationItem } from '@/services/locationService';
import { Search, Stethoscope, MapPin, Building2, UserPlus, Filter } from 'lucide-react';

const SPECIALITIES = [
  'All Specialities',
  'General Physician',
  'Dermatologist',
  'Pediatrician',
  'Gynecologist',
  'Orthopedist',
  'Dentist',
];

export default function DoctorsListingPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>({
    city: 'Jaipur',
    state: 'Rajasthan',
  });
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>('All Specialities');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const loc = locationService.getCurrentLocation();
    setSelectedLocation(loc);
  }, []);

  useEffect(() => {
    const filtered = doctorService.getDoctorsByFilter({
      city: selectedLocation.city,
      speciality: selectedSpeciality,
      query: searchQuery,
    });
    setDoctors(filtered);
  }, [selectedLocation, selectedSpeciality, searchQuery]);

  const handleSelectLocation = (loc: LocationItem) => {
    locationService.setCurrentLocation(loc);
    setSelectedLocation(loc);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb & Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-teal-700">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Doctors in {selectedLocation.city}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                <Stethoscope className="w-7 h-7 text-teal-700" />
                Find Doctors in {selectedLocation.city}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verified clinics with genuine consultation timings and transparent fees.
              </p>
            </div>
            <Link
              href="/doctor-registration"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors self-start sm:self-auto"
            >
              <UserPlus className="w-3.5 h-3.5 text-teal-700" />
              Register as Doctor
            </Link>
          </div>
        </div>

        {/* Search & Speciality Filters */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search by doctor name, speciality, or clinic in ${selectedLocation.city}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-24 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0 pl-1">
              <Filter className="w-3.5 h-3.5" /> Speciality:
            </span>
            {SPECIALITIES.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpeciality(spec)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSpeciality === spec
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Results Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}</span>
            <div className="flex items-center gap-1.5 text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              <MapPin className="w-3 h-3 text-teal-600" />
              <span>{selectedLocation.city}, {selectedLocation.state}</span>
            </div>
          </div>

          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="flex flex-col">
                  <DoctorCard doctor={doctor} onBookClick={(id) => window.location.href = `/book/${id}`} />
                  <Link
                    href={`/doctors/${doctor.id}`}
                    className="mt-2 text-center text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline py-1"
                  >
                    View Doctor Profile & Working Hours →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto space-y-4">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  No doctors found in {selectedLocation.city}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try switching specialities or selecting another city from the location bar above.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <Link
                  href="/doctor-registration"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs"
                >
                  Register Clinic in {selectedLocation.city}
                </Link>
                <button
                  onClick={() => {
                    handleSelectLocation({ city: 'Jaipur', state: 'Rajasthan' });
                    setSelectedSpeciality('All Specialities');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  View Jaipur Doctors
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

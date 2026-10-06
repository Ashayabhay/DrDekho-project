'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { doctorService } from '@/services/doctorService';
import { Doctor } from '@/components/DoctorCard';
import {
  Stethoscope,
  Search,
  MapPin,
  ExternalLink,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Building2,
} from 'lucide-react';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('ALL');

  useEffect(() => {
    setDoctors(doctorService.getAllDoctors());
  }, []);

  const specialities = Array.from(new Set(doctors.map((d) => d.speciality)));

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpec = selectedSpeciality === 'ALL' || doc.speciality === selectedSpeciality;
    const matchesQuery =
      !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpec && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctors Directory Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered practitioners, clinic listings, and verification status
          </p>
        </div>

        <Link
          href="/doctor-registration"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          Add / Register Doctor
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, clinic, city or speciality..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <select
          value={selectedSpeciality}
          onChange={(e) => setSelectedSpeciality(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          <option value="ALL">All Specialities ({doctors.length})</option>
          {specialities.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Doctor & Speciality</th>
                <th className="py-3.5 px-5">Clinic & Location</th>
                <th className="py-3.5 px-5">Experience</th>
                <th className="py-3.5 px-5">Fee</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
                    <div className="text-teal-700 font-medium">{doc.speciality}</div>
                    <div className="text-[11px] text-slate-400">{doc.qualification}</div>
                  </td>

                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-800">{doc.clinicName}</div>
                    <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {doc.city}
                    </div>
                  </td>

                  <td className="py-4 px-5 font-medium text-slate-700">
                    {doc.experienceYears} Years
                  </td>

                  <td className="py-4 px-5 font-bold text-slate-900">
                    ₹{doc.consultationFee}
                  </td>

                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/doctors/${doc.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 transition-colors inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <Link
                        href={`/book/${doc.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition-colors"
                      >
                        Book
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

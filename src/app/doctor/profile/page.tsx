'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { doctorService } from '@/services/doctorService';
import { locationService } from '@/services/locationService';
import { Doctor } from '@/components/DoctorCard';
import {
  Stethoscope,
  Building2,
  MapPin,
  Clock,
  IndianRupee,
  Save,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export default function DoctorProfileManagePage() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    speciality: '',
    qualification: '',
    experienceYears: 10,
    clinicName: '',
    address: '',
    city: '',
    consultationFee: 400,
    availabilityToday: '',
    providesEmergency: false,
    emergencyFee: 600,
    emergencyHours: '06:00 PM - 10:00 PM',
    emergencyInstructions: 'Report to clinic emergency reception desk.',
  });

  useEffect(() => {
    const list = doctorService.getAllDoctors();
    if (list.length > 0) {
      const d = list[0];
      setDoctor(d);
      setForm({
        name: d.name,
        speciality: d.speciality,
        qualification: d.qualification,
        experienceYears: d.experienceYears,
        clinicName: d.clinicName,
        address: d.address,
        city: d.city,
        consultationFee: d.consultationFee,
        availabilityToday: d.availabilityToday,
        providesEmergency: !!d.providesEmergency,
        emergencyFee: d.emergencyFee || (d.consultationFee ? d.consultationFee + 200 : 600),
        emergencyHours: d.emergencyHours || '06:00 PM - 10:00 PM',
        emergencyInstructions: d.emergencyInstructions || '',
      });
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;

    const updated: Doctor = {
      ...doctor,
      name: form.name,
      speciality: form.speciality,
      qualification: form.qualification,
      experienceYears: Number(form.experienceYears),
      clinicName: form.clinicName,
      address: form.address,
      city: form.city,
      consultationFee: Number(form.consultationFee),
      availabilityToday: form.availabilityToday,
      providesEmergency: form.providesEmergency,
      emergencyFee: form.providesEmergency ? Number(form.emergencyFee) : undefined,
      emergencyHours: form.providesEmergency ? form.emergencyHours : undefined,
      emergencyInstructions: form.providesEmergency ? form.emergencyInstructions : undefined,
    };

    // Update via service
    doctorService.registerDoctor(updated);
    setDoctor(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctor Profile & Clinic Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage how patients see your credentials and clinic details on Dr Khojo
          </p>
        </div>
        {doctor && (
          <Link
            href={`/doctors/${doctor.id}`}
            className="text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            Preview Profile →
          </Link>
        )}
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Profile settings saved successfully! Changes are live immediately.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            Practitioner Credentials
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Doctor Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Speciality</label>
            <input
              type="text"
              required
              value={form.speciality}
              onChange={(e) => setForm({ ...form, speciality: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Qualification</label>
            <input
              type="text"
              value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Years of Experience</label>
            <input
              type="number"
              value={form.experienceYears}
              onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="border-b border-slate-100 pt-4 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            Clinic Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">Clinic Name</label>
            <input
              type="text"
              required
              value={form.clinicName}
              onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">City</label>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Consultation Fee (₹)</label>
            <input
              type="number"
              required
              value={form.consultationFee}
              onChange={(e) => setForm({ ...form, consultationFee: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">Address & Landmark</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">Availability Summary Display</label>
            <input
              type="text"
              value={form.availabilityToday}
              onChange={(e) => setForm({ ...form, availabilityToday: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Emergency Service Settings Card */}
          <div className="sm:col-span-2 p-5 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                🚨 Emergency Appointments Capability
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Do you accept urgent walk-in / triage emergency appointments at your clinic?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, providesEmergency: true })}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  form.providesEmergency
                    ? 'bg-rose-700 text-white border-rose-700 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Yes, I provide emergency appointments
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, providesEmergency: false })}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  !form.providesEmergency
                    ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                No, I don&apos;t provide emergency appointments
              </button>
            </div>

            {form.providesEmergency && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-rose-200/80">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Emergency Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={form.emergencyFee}
                    onChange={(e) => setForm({ ...form, emergencyFee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Emergency Hours Window</label>
                  <input
                    type="text"
                    value={form.emergencyHours}
                    onChange={(e) => setForm({ ...form, emergencyHours: e.target.value })}
                    placeholder="e.g. 06:00 PM - 10:00 PM or 24/7"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Emergency Arrival Instructions</label>
                  <input
                    type="text"
                    value={form.emergencyInstructions}
                    onChange={(e) => setForm({ ...form, emergencyInstructions: e.target.value })}
                    placeholder="e.g. Report to emergency counter at clinic. Urgent triage available."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}

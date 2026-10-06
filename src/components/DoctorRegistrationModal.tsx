'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Stethoscope, IndianRupee, Award } from 'lucide-react';
import { Doctor } from './DoctorCard';
import { INDIAN_STATES_AND_CITIES } from '@/data/indianCities';

interface DoctorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDoctorRegistered: (doctor: Doctor) => void;
}

export function DoctorRegistrationModal({
  isOpen,
  onClose,
  onDoctorRegistered,
}: DoctorRegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    speciality: 'General Physician',
    experienceYears: '5',
    clinicName: '',
    state: 'Rajasthan',
    city: 'Jaipur',
    address: '',
    phone: '',
    consultationFee: '400',
    timing: '10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Selected state cities
  const availableCities =
    INDIAN_STATES_AND_CITIES.find((g) => g.state === formData.state)?.cities || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Doctor name is required.');
      return;
    }
    if (!formData.clinicName.trim()) {
      setError('Clinic name is required.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Valid 10-digit phone number is required.');
      return;
    }
    if (!formData.address.trim()) {
      setError('Clinic address is required.');
      return;
    }

    const newDoctor: Doctor = {
      id: `doc-${Date.now()}`,
      name: formData.name.startsWith('Dr.') ? formData.name : `Dr. ${formData.name}`,
      speciality: formData.speciality,
      qualification: formData.qualification || 'MBBS',
      experienceYears: parseInt(formData.experienceYears, 10) || 5,
      clinicName: formData.clinicName,
      address: formData.address,
      city: formData.city,
      availabilityToday: formData.timing,
      consultationFee: parseInt(formData.consultationFee, 10) || 400,
    };

    onDoctorRegistered(newDoctor);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={handleResetAndClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 to-teal-800 text-white flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-800/80 text-teal-200 border border-teal-700/60 mb-2">
              <Stethoscope className="w-3.5 h-3.5 text-teal-300" />
              <span>Founding Pilot Clinic Onboarding (₹499/mo)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Doctor & Clinic Registration
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 mt-1">
              Join Dr Khojo to publish your verified clinic timings and receive online patient bookings.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Registration Successful!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                <strong>{formData.name}</strong> has been registered for <strong>{formData.clinicName}</strong> in <strong>{formData.city}</strong> under our Founding Pilot Program.
              </p>
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900 max-w-md mx-auto space-y-1">
                <div>✓ 30-Day Pilot Trial Activated</div>
                <div>✓ ₹499/month per clinic founding rate locked</div>
                <div>✓ Profile is now discoverable in {formData.city}</div>
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="mt-4 px-6 py-2.5 text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow transition-colors cursor-pointer"
              >
                Go to Doctor Discovery
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                  {error}
                </div>
              )}

              {/* Section 1: Doctor Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-50 px-2.5 py-1 rounded-md inline-block">
                  1. Doctor Credentials
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="doctorName" className="block text-xs font-semibold text-slate-700 mb-1">
                      Doctor Name *
                    </label>
                    <input
                      id="doctorName"
                      type="text"
                      placeholder="Dr. Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="qualifications" className="block text-xs font-semibold text-slate-700 mb-1">
                      Qualifications (Degrees) *
                    </label>
                    <input
                      id="qualifications"
                      type="text"
                      placeholder="MBBS, MD (General Medicine)"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="speciality" className="block text-xs font-semibold text-slate-700 mb-1">
                      Medical Speciality *
                    </label>
                    <select
                      id="speciality"
                      value={formData.speciality}
                      onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="General Physician">General Physician</option>
                      <option value="Dermatologist">Dermatologist (Skin & Hair)</option>
                      <option value="Pediatrician">Pediatrician (Child Specialist)</option>
                      <option value="Gynecologist">Gynecologist & Obstetrician</option>
                      <option value="Orthopedist">Orthopedist (Bone & Joint)</option>
                      <option value="Dentist">Dentist (Dental Care)</option>
                      <option value="ENT Specialist">ENT Specialist</option>
                      <option value="Cardiologist">Cardiologist (Heart)</option>
                      <option value="Ophthalmologist">Ophthalmologist (Eye)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="experienceYears" className="block text-xs font-semibold text-slate-700 mb-1">
                      Experience (Years) *
                    </label>
                    <input
                      id="experienceYears"
                      type="number"
                      min="1"
                      max="60"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Clinic Location */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-50 px-2.5 py-1 rounded-md inline-block">
                  2. Clinic & Location
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="clinicName" className="block text-xs font-semibold text-slate-700 mb-1">
                      Clinic / Hospital Name *
                    </label>
                    <input
                      id="clinicName"
                      type="text"
                      placeholder="e.g. Sharma Health Clinic"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-xs font-semibold text-slate-700 mb-1">
                      State *
                    </label>
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => {
                        const newState = e.target.value;
                        const defaultCity =
                          INDIAN_STATES_AND_CITIES.find((g) => g.state === newState)?.cities[0] || '';
                        setFormData({ ...formData, state: newState, city: defaultCity });
                      }}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {INDIAN_STATES_AND_CITIES.map((g) => (
                        <option key={g.state} value={g.state}>
                          {g.state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-xs font-semibold text-slate-700 mb-1">
                      City *
                    </label>
                    <select
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {availableCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinic Address (Street, Landmark, Area) *
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="e.g. Shop 4, Malviya Nagar Main Market, Near Hospital"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Section 3: Fee & Timings */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-50 px-2.5 py-1 rounded-md inline-block">
                  3. Timings & Consultation Fee
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fee" className="block text-xs font-semibold text-slate-700 mb-1">
                      Consultation Fee (₹) *
                    </label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        id="fee"
                        type="number"
                        min="0"
                        step="50"
                        value={formData.consultationFee}
                        onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="timing" className="block text-xs font-semibold text-slate-700 mb-1">
                      Daily Consultation Hours *
                    </label>
                    <input
                      id="timing"
                      type="text"
                      placeholder="10:00 AM - 1:30 PM, 5:00 PM - 8:00 PM"
                      value={formData.timing}
                      onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Plan note */}
              <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200/80 text-xs text-teal-950 flex items-start gap-3">
                <Award className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Founding Pilot Clinic Privilege:</span> You get 30 days free trial, followed by flat ₹499/month per clinic for 1 doctor. No setup fees, cancel anytime.
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Complete Registration (₹499/mo Plan)
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

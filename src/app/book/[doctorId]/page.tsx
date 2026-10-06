'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { doctorService } from '@/services/doctorService';
import { appointmentService } from '@/services/appointmentService';
import { locationService, LocationItem } from '@/services/locationService';
import { Doctor } from '@/components/DoctorCard';
import { BookedAppointment } from '@/components/AppointmentsModal';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  AlertCircle,
  Lock,
  Edit2,
  AlertTriangle,
  Flame,
  Zap,
} from 'lucide-react';

const MORNING_SLOTS = [
  '06:00 AM - 07:00 AM',
  '07:00 AM - 08:00 AM',
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
];

const AFTERNOON_SLOTS = [
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
];

const EVENING_SLOTS = [
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 07:30 PM',
];

const REASON_OPTIONS = [
  'General Check-up',
  'Fever / Cold',
  'Pain',
  'Skin Problem',
  'Child Health',
  'Follow-up',
  'Other',
];

const EMERGENCY_REASONS = [
  'Severe pain',
  'Breathing problem',
  'High fever',
  'Injury',
  'Sudden symptoms',
  'Other',
];

type BookingStep = 'datetime' | 'patient' | 'review' | 'confirmed';

function BookDoctorContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = Array.isArray(params?.doctorId) ? params.doctorId[0] : (params?.doctorId as string);

  // Check URL param ?type=emergency
  const isEmergencyRequested = searchParams ? searchParams.get('type') === 'emergency' : false;

  const [selectedLocation, setSelectedLocation] = useState<LocationItem>({
    city: 'Jaipur',
    state: 'Rajasthan',
  });
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  // Emergency Mode state (can be toggled or initialized via URL)
  const [isEmergencyMode, setIsEmergencyMode] = useState(isEmergencyRequested);

  // Flow State
  const [currentStep, setCurrentStep] = useState<BookingStep>('datetime');

  // Step 1: Date & Time selection (6:00 AM till 7:30 PM)
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState(MORNING_SLOTS[0]);

  // Step 2: Patient Details
  const [bookingFor, setBookingFor] = useState<'MYSELF' | 'SOMEONE_ELSE'>('MYSELF');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [ageMode, setAgeMode] = useState<'age' | 'dob'>('age');
  const [patientAge, setPatientAge] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other' | ''>('');
  const [patientEmail, setPatientEmail] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState(isEmergencyRequested ? 'Severe pain' : 'General Check-up');
  const [notes, setNotes] = useState('');

  // Inline Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 4: Final confirmed appointment
  const [confirmedAppt, setConfirmedAppt] = useState<BookedAppointment | null>(null);

  useEffect(() => {
    setSelectedLocation(locationService.getCurrentLocation());
    if (doctorId) {
      const doc = doctorService.getDoctorById(doctorId);
      setDoctor(doc || null);
    }
  }, [doctorId]);

  // Update default reason if switching modes
  const handleToggleEmergency = (enableEmergency: boolean) => {
    setIsEmergencyMode(enableEmergency);
    if (enableEmergency) {
      setReasonForVisit('Severe pain');
    } else {
      setReasonForVisit('General Check-up');
    }
    setErrors({});
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Doctor Profile Not Found</h2>
          <p className="text-xs text-slate-500">
            The doctor you are trying to book an appointment with does not exist.
          </p>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800"
          >
            ← View All Doctors
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Emergency availability evaluation
  const emergencyCheck = doctorService.isEmergencyAvailableNow(doctor);
  const activeConsultationFee = isEmergencyMode
    ? doctor.emergencyFee || doctor.consultationFee
    : doctor.consultationFee;

  // Validate patient details before advancing to Review
  const validatePatientDetails = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Full Name
    if (!patientName.trim()) {
      newErrors.patientName =
        bookingFor === 'MYSELF'
          ? 'Please enter your full name.'
          : 'Please enter patient full name.';
    } else if (patientName.trim().length < 2) {
      newErrors.patientName = 'Name must be at least 2 characters long.';
    }

    // 2. Mobile Number
    const phoneClean = patientPhone.trim().replace(/\D/g, '');
    if (bookingFor === 'MYSELF') {
      if (!phoneClean) {
        newErrors.patientPhone = 'Mobile number is required for SMS/WhatsApp appointment updates.';
      } else if (phoneClean.length !== 10) {
        newErrors.patientPhone = 'Please enter a valid 10-digit Indian mobile number.';
      }
    } else {
      // For Someone Else, phone is optional, but if entered, must be 10 digits
      if (phoneClean && phoneClean.length !== 10) {
        newErrors.patientPhone = 'Please enter a valid 10-digit mobile number or leave blank.';
      }
    }

    // 3. Age OR Date of Birth
    if (ageMode === 'age') {
      const ageNum = parseInt(patientAge, 10);
      if (!patientAge.trim()) {
        newErrors.patientAge = 'Please enter patient age.';
      } else if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
        newErrors.patientAge = 'Please enter a valid age between 1 and 120.';
      }
    } else {
      if (!patientDob) {
        newErrors.patientDob = 'Please select date of birth.';
      }
    }

    // 4. Gender
    if (!patientGender) {
      newErrors.patientGender = 'Please select patient gender.';
    }

    // 5. Reason for visit
    if (!reasonForVisit) {
      newErrors.reasonForVisit = isEmergencyMode
        ? 'Please select the emergency reason for visit.'
        : 'Please select reason for visit.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePatientDetails()) {
      setCurrentStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step 3 -> 4: ONLY at this point is an appointment created
  const handleConfirmBooking = () => {
    const ageOrDobString = ageMode === 'age' ? `${patientAge} yrs` : `DOB: ${patientDob}`;

    const newAppointment: BookedAppointment = {
      id: `DK-${Date.now().toString().slice(-6)}`,
      doctorName: doctor.name,
      speciality: doctor.speciality,
      clinicName: doctor.clinicName,
      clinicAddress: `${doctor.address}, ${doctor.city}`,
      date: isEmergencyMode ? 'Today' : selectedDate,
      timeSlot: isEmergencyMode ? 'Immediate / Emergency Priority Slot' : selectedSlot,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim() || 'Not Provided',
      status: 'CONFIRMED',
      consultationFee: activeConsultationFee,
      appointmentType: isEmergencyMode ? 'EMERGENCY' : 'REGULAR',
      bookingFor,
      patientAge: ageOrDobString,
      patientGender: patientGender || 'Other',
      reasonForVisit,
      notes: notes.trim(),
      patientEmail: patientEmail.trim(),
    };

    // Commit to appointment service (localStorage)
    appointmentService.createAppointment(newAppointment);
    setConfirmedAppt(newAppointment);
    setCurrentStep('confirmed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        {currentStep !== 'confirmed' && (
          <div className="flex items-center justify-between">
            <Link
              href={`/doctors/${doctor.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Doctor Profile
            </Link>

            {/* Stepper Progress */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className={currentStep === 'datetime' ? (isEmergencyMode ? 'text-rose-700 font-bold' : 'text-teal-700 font-bold') : ''}>
                {isEmergencyMode ? '1. Emergency Triage' : '1. Date & Time'}
              </span>
              <span>→</span>
              <span className={currentStep === 'patient' ? (isEmergencyMode ? 'text-rose-700 font-bold' : 'text-teal-700 font-bold') : ''}>
                2. Patient Details
              </span>
              <span>→</span>
              <span className={currentStep === 'review' ? (isEmergencyMode ? 'text-rose-700 font-bold' : 'text-teal-700 font-bold') : ''}>
                3. Review
              </span>
            </div>
          </div>
        )}

        {/* Doctor Summary Header Card */}
        {currentStep !== 'confirmed' && (
          <div className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isEmergencyMode ? 'border-rose-300 ring-1 ring-rose-100' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isEmergencyMode ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'
              }`}>
                {isEmergencyMode ? <Flame className="w-6 h-6 animate-pulse" /> : <Stethoscope className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{doctor.name}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified
                  </span>
                  {isEmergencyMode && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                      🚨 Emergency Booking
                    </span>
                  )}
                </div>
                <div className="text-xs text-teal-700 font-medium">
                  {doctor.speciality} • {doctor.qualification}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {doctor.clinicName}, {doctor.city}
                </div>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium">
                {isEmergencyMode ? 'Emergency Consultation Fee' : 'Consultation Fee'}
              </div>
              <div className="text-lg font-black text-slate-900">
                ₹{activeConsultationFee}{' '}
                <span className="text-[11px] font-normal text-slate-500">(Pay at Clinic)</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 1: DATE & TIME OR EMERGENCY TRIAGE
           ======================================================== */}
        {currentStep === 'datetime' && (
          <div className="space-y-6">
            {/* If Emergency Mode is active */}
            {isEmergencyMode ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-6">
                {/* Check Case 1: Doctor does NOT provide emergency service */}
                {!doctor.providesEmergency ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-slate-900">
                        Emergency Appointments Not Provided
                      </h2>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        {doctor.name} has not enabled emergency appointments on Dr Khojo. Normal scheduled consultations remain available.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-md mx-auto">
                      <strong>Emergency Medical Disclaimer:</strong> Dr Khojo is not an emergency medical or ambulance service. For life-threatening emergencies, call <strong>108 / 112</strong> or visit the nearest trauma center immediately.
                    </div>

                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleToggleEmergency(false)}
                        className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Book Regular Appointment Instead
                      </button>
                    </div>
                  </div>
                ) : !emergencyCheck.isAvailable ? (
                  /* Check Case 2: Doctor provides emergency service, but NOT AVAILABLE NOW */
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <Clock className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-slate-900">
                        Emergency Appointments Currently Unavailable
                      </h2>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        {doctor.name} provides emergency appointments during configured hours:
                      </p>
                      <div className="inline-block mt-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold font-mono">
                        Configured Hours: {doctor.emergencyHours || 'Not configured'}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Current time is outside the doctor&apos;s emergency window. You can still schedule a normal appointment.
                    </p>

                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 text-left max-w-md mx-auto">
                      <strong>🚨 Life-Threatening Emergency?</strong> Dr Khojo is not an ambulance service. Call <strong>108</strong> (Ambulance) or <strong>112</strong> (Emergency) immediately.
                    </div>

                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleEmergency(false)}
                        className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Book Regular Appointment
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Check Case 3: Emergency IS AVAILABLE NOW */
                  <div className="space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" /> Emergency Priority Booking
                        </span>
                        <h1 className="text-xl font-bold text-slate-900 pt-1">
                          Emergency Consultation Available Now
                        </h1>
                        <p className="text-xs text-slate-600">
                          This doctor accepts emergency appointment requests during their configured emergency availability ({doctor.emergencyHours}).
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleEmergency(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 underline shrink-0"
                      >
                        Switch to Normal Booking
                      </button>
                    </div>

                    {/* Mandatory Disclaimer */}
                    <div className="p-4 bg-rose-50/90 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                        Important Emergency Medical Notice:
                      </div>
                      <p className="text-rose-800">
                        Dr Khojo is not an emergency medical service or ambulance service. For life-threatening emergencies, call <strong>108</strong> or go to the nearest hospital casualty/emergency room immediately.
                      </p>
                    </div>

                    {/* Priority Allocation Details */}
                    <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Priority Appointment Configuration
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block font-medium">Date</span>
                          <span className="font-bold text-slate-900 text-sm">Today</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block font-medium">Priority Slot</span>
                          <span className="font-bold text-rose-700 text-sm">Immediate / Priority Slot</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block font-medium">Emergency Fee</span>
                          <span className="font-bold text-slate-900 text-sm">₹{activeConsultationFee}</span>
                        </div>
                      </div>

                      {doctor.emergencyInstructions && (
                        <div className="text-xs text-slate-700 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                          <span className="font-bold text-amber-900">Clinic Instructions: </span>
                          {doctor.emergencyInstructions}
                        </div>
                      )}

                      <p className="text-[11px] text-slate-500">
                        ℹ️ Emergency appointments bypass normal hourly slot selection. Proceed directly to submit patient details.
                      </p>
                    </div>

                    {/* Step 1 Actions */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleToggleEmergency(false)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900"
                      >
                        ← Regular Consultation
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep('patient');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        Continue to Emergency Patient Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Normal Step 1: SELECT DATE & TIME */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">
                      Select Date & Time Slot
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Choose when you want to visit {doctor.clinicName}
                    </p>
                  </div>

                  {doctor.providesEmergency && (
                    <button
                      type="button"
                      onClick={() => handleToggleEmergency(true)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      <Flame className="w-3.5 h-3.5 text-rose-600" />
                      Need Emergency Visit?
                    </button>
                  )}
                </div>

                {/* Date Selection */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    Select Consultation Date
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {['Today', 'Tomorrow', 'In 2 Days', 'In 3 Days'].map((dateOption) => (
                      <button
                        key={dateOption}
                        type="button"
                        onClick={() => setSelectedDate(dateOption)}
                        className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          selectedDate === dateOption
                            ? 'bg-teal-700 border-teal-700 text-white shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {dateOption}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-4 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    Select Time Slot
                  </label>

                  {/* Morning Slots (06:00 AM - 12:00 PM) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Morning (06:00 AM - 12:00 PM)</span>
                      <span className="text-[11px] text-teal-700 font-semibold">{MORNING_SLOTS.length} slots</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {MORNING_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                            selectedSlot === slot
                              ? 'bg-teal-700 border-teal-700 text-white shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Afternoon Slots (12:00 PM - 04:00 PM) */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Afternoon (12:00 PM - 04:00 PM)</span>
                      <span className="text-[11px] text-teal-700 font-semibold">{AFTERNOON_SLOTS.length} slots</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {AFTERNOON_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                            selectedSlot === slot
                              ? 'bg-teal-700 border-teal-700 text-white shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Evening Slots (04:00 PM - 07:30 PM) */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Evening (04:00 PM - 07:30 PM)</span>
                      <span className="text-[11px] text-teal-700 font-semibold">{EVENING_SLOTS.length} slots</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {EVENING_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                            selectedSlot === slot
                              ? 'bg-teal-700 border-teal-700 text-white shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step 1 Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Selected: <span className="font-bold text-slate-900">{selectedDate}</span> at{' '}
                    <span className="font-bold text-teal-700">{selectedSlot}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep('patient');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    Continue to Patient Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            STEP 2: PATIENT DETAILS
           ======================================================== */}
        {currentStep === 'patient' && (
          <form
            onSubmit={handleProceedToReview}
            className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-2xs space-y-6 ${
              isEmergencyMode ? 'border-rose-200 ring-1 ring-rose-50' : 'border-slate-200/90'
            }`}
          >
            <div>
              {isEmergencyMode && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-1 rounded-md inline-block mb-2">
                  🚨 Emergency Priority Consultation
                </span>
              )}
              <h1 className="text-xl font-bold text-slate-900">Patient Details</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Who will be visiting the doctor for this {isEmergencyMode ? 'emergency' : ''} consultation?
              </p>
            </div>

            {/* WHO IS THIS APPOINTMENT FOR? */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Who is this appointment for? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setBookingFor('MYSELF');
                    setErrors({});
                  }}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
                    bookingFor === 'MYSELF'
                      ? isEmergencyMode
                        ? 'bg-rose-50 border-rose-600 text-rose-900 ring-1 ring-rose-600'
                        : 'bg-teal-50 border-teal-600 text-teal-900 ring-1 ring-teal-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Myself</span>
                  </div>
                  {bookingFor === 'MYSELF' && (
                    <CheckCircle2 className={`w-4 h-4 ${isEmergencyMode ? 'text-rose-600' : 'text-teal-600'}`} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBookingFor('SOMEONE_ELSE');
                    setErrors({});
                  }}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
                    bookingFor === 'SOMEONE_ELSE'
                      ? isEmergencyMode
                        ? 'bg-rose-50 border-rose-600 text-rose-900 ring-1 ring-rose-600'
                        : 'bg-teal-50 border-teal-600 text-teal-900 ring-1 ring-teal-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Someone else</span>
                  </div>
                  {bookingFor === 'SOMEONE_ELSE' && (
                    <CheckCircle2 className={`w-4 h-4 ${isEmergencyMode ? 'text-rose-600' : 'text-teal-600'}`} />
                  )}
                </button>
              </div>
            </div>

            {/* PATIENT FORM FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Full Name */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  {bookingFor === 'MYSELF' ? 'Your Full Name *' : 'Patient Full Name *'}
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => {
                    setPatientName(e.target.value);
                    if (errors.patientName) setErrors({ ...errors, patientName: '' });
                  }}
                  placeholder={bookingFor === 'MYSELF' ? 'e.g. Rahul Sharma' : 'e.g. Sunita Devi'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                    errors.patientName ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                  }`}
                />
                {errors.patientName && (
                  <p className="text-[11px] text-red-600 font-semibold">{errors.patientName}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {bookingFor === 'MYSELF' ? 'Mobile Number (10 Digits) *' : 'Patient Mobile Number (Optional)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={patientPhone}
                    onChange={(e) => {
                      setPatientPhone(e.target.value);
                      if (errors.patientPhone) setErrors({ ...errors, patientPhone: '' });
                    }}
                    placeholder="9876543210"
                    className={`w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                      errors.patientPhone ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.patientPhone && (
                  <p className="text-[11px] text-red-600 font-semibold">{errors.patientPhone}</p>
                )}
              </div>

              {/* Age or Date of Birth */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {ageMode === 'age' ? 'Patient Age (Years) *' : 'Date of Birth *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAgeMode(ageMode === 'age' ? 'dob' : 'age');
                      if (errors.patientAge || errors.patientDob) {
                        setErrors({ ...errors, patientAge: '', patientDob: '' });
                      }
                    }}
                    className="text-[11px] font-bold text-teal-700 hover:underline"
                  >
                    Switch to {ageMode === 'age' ? 'Date of Birth' : 'Age'}
                  </button>
                </div>

                {ageMode === 'age' ? (
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={patientAge}
                    onChange={(e) => {
                      setPatientAge(e.target.value);
                      if (errors.patientAge) setErrors({ ...errors, patientAge: '' });
                    }}
                    placeholder="e.g. 28"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                      errors.patientAge ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                    }`}
                  />
                ) : (
                  <input
                    type="date"
                    value={patientDob}
                    onChange={(e) => {
                      setPatientDob(e.target.value);
                      if (errors.patientDob) setErrors({ ...errors, patientDob: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                      errors.patientDob ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                    }`}
                  />
                )}
                {(errors.patientAge || errors.patientDob) && (
                  <p className="text-[11px] text-red-600 font-semibold">
                    {errors.patientAge || errors.patientDob}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Patient Gender *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Male', 'Female', 'Other'] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => {
                        setPatientGender(gender);
                        if (errors.patientGender) setErrors({ ...errors, patientGender: '' });
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        patientGender === gender
                          ? isEmergencyMode
                            ? 'bg-rose-700 text-white border-rose-700 shadow-2xs'
                            : 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
                {errors.patientGender && (
                  <p className="text-[11px] text-red-600 font-semibold">{errors.patientGender}</p>
                )}
              </div>

              {/* Optional Email */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com (for appointment receipt)"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* REASON FOR VISIT */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                {isEmergencyMode ? 'Reason for Emergency Visit *' : 'Reason for Visit *'}
              </label>
              <div className="flex flex-wrap gap-2">
                {(isEmergencyMode ? EMERGENCY_REASONS : REASON_OPTIONS).map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => {
                      setReasonForVisit(reason);
                      if (errors.reasonForVisit) setErrors({ ...errors, reasonForVisit: '' });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      reasonForVisit === reason
                        ? isEmergencyMode
                          ? 'bg-rose-700 text-white border-rose-700 shadow-2xs'
                          : 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              {errors.reasonForVisit && (
                <p className="text-[11px] text-red-600 font-semibold">{errors.reasonForVisit}</p>
              )}
            </div>

            {/* Optional Additional Note */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {isEmergencyMode ? 'Urgent Symptoms / Context Note (Optional)' : 'Additional Notes / Symptoms (Optional)'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isEmergencyMode ? 'Any specific symptoms, pain severity, or medical history to alert the clinic...' : 'Any specific symptoms or prior context you want to mention...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
              />
            </div>

            {/* Privacy or Emergency Notification Callout */}
            {isEmergencyMode ? (
              <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
                <Flame className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Clinic Alert: </span>
                  The doctor and clinic triage desk will be notified immediately upon confirmation.
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Privacy Assurance: </span>
                  Dr Khojo collects only minimal details needed for clinic scheduling. We never ask for Aadhaar, PAN, blood group, or insurance cards.
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep('datetime');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {isEmergencyMode ? 'Back to Triage' : 'Back to Date & Time'}
              </button>

              <button
                type="submit"
                className={`px-6 py-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer ${
                  isEmergencyMode ? 'bg-rose-700 hover:bg-rose-800' : 'bg-teal-700 hover:bg-teal-800'
                }`}
              >
                {isEmergencyMode ? 'Review Emergency Appointment' : 'Review Appointment'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            STEP 3: REVIEW APPOINTMENT
           ======================================================== */}
        {currentStep === 'review' && (
          <div className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-2xs space-y-6 ${
            isEmergencyMode ? 'border-rose-300 ring-1 ring-rose-100' : 'border-slate-200/90'
          }`}>
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md inline-block ${
                isEmergencyMode ? 'bg-rose-100 text-rose-800' : 'bg-teal-50 text-teal-800'
              }`}>
                Step 3 of 3 • {isEmergencyMode ? '🚨 Emergency Review' : 'Review'}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                {isEmergencyMode ? 'Review Emergency Appointment Details' : 'Review Appointment Details'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Please verify the consultation information before confirming your booking.
              </p>
            </div>

            {/* Emergency Disclaimer Reminder */}
            {isEmergencyMode && (
              <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Emergency Disclaimer: </strong>
                  Dr Khojo is not an emergency medical service or ambulance service. For life-threatening emergencies, call <strong>108</strong> or go to the nearest emergency room immediately.
                </div>
              </div>
            )}

            {/* Review Sections */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/40">
              {/* Doctor & Clinic */}
              <div className="p-4 sm:p-5 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Doctor & Clinic
                </div>
                <div className="text-sm font-bold text-slate-900">{doctor.name}</div>
                <div className="text-xs text-teal-700 font-semibold">{doctor.speciality}</div>
                <div className="text-xs text-slate-600">{doctor.clinicName}</div>
                <div className="text-xs text-slate-500">{doctor.address}, {doctor.city}</div>
              </div>

              {/* Schedule */}
              <div className="p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Schedule & Timing
                  </div>
                  <div className={`text-sm font-bold mt-0.5 ${isEmergencyMode ? 'text-rose-700' : 'text-slate-900'}`}>
                    {isEmergencyMode ? 'Today • Immediate / Emergency Priority Slot' : `${selectedDate} • ${selectedSlot}`}
                  </div>
                </div>
                {!isEmergencyMode && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep('datetime')}
                    className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
              </div>

              {/* Patient Information */}
              <div className="p-4 sm:p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Patient Information
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('patient')}
                    className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Name:</span>
                    <div className="font-bold text-slate-900">{patientName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Booking For:</span>
                    <div className="font-bold text-slate-900">
                      {bookingFor === 'MYSELF' ? 'Myself' : 'Someone else'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Age / DOB:</span>
                    <div className="font-bold text-slate-900">
                      {ageMode === 'age' ? `${patientAge} Years` : patientDob}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Gender:</span>
                    <div className="font-bold text-slate-900">{patientGender}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Contact Mobile:</span>
                    <div className="font-bold text-slate-900">
                      {patientPhone || 'Not Provided'}
                    </div>
                  </div>
                  {patientEmail && (
                    <div>
                      <span className="text-slate-500">Email:</span>
                      <div className="font-bold text-slate-900">{patientEmail}</div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-xs">
                  <span className="text-slate-500">Reason for Visit: </span>
                  <span className="font-bold text-slate-900">{reasonForVisit}</span>
                  {notes && (
                    <div className="mt-1 text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                      Note: &ldquo;{notes}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Consultation Fee to pay at clinic */}
              <div className={`p-4 sm:p-5 flex items-center justify-between ${
                isEmergencyMode ? 'bg-rose-50/60' : 'bg-teal-50/60'
              }`}>
                <div>
                  <div className={`text-[11px] font-bold uppercase tracking-wider ${
                    isEmergencyMode ? 'text-rose-800' : 'text-teal-800'
                  }`}>
                    {isEmergencyMode ? 'Emergency Consultation Fee' : 'Payment Method'}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Pay directly at the clinic reception desk
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Total Consultation Fee</div>
                  <div className="text-xl font-black text-slate-900">
                    ₹{activeConsultationFee}
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep('patient')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Edit Details
              </button>

              <button
                type="button"
                onClick={handleConfirmBooking}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  isEmergencyMode ? 'bg-rose-700 hover:bg-rose-800' : 'bg-teal-700 hover:bg-teal-800'
                }`}
              >
                {isEmergencyMode ? (
                  <>
                    <Flame className="w-5 h-5 text-rose-200" />
                    Confirm Emergency Appointment
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-teal-200" />
                    Confirm Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: APPOINTMENT CONFIRMED
           ======================================================== */}
        {currentStep === 'confirmed' && confirmedAppt && (
          <div className={`bg-white p-6 sm:p-10 rounded-3xl border shadow-sm text-center space-y-6 ${
            confirmedAppt.appointmentType === 'EMERGENCY' ? 'border-rose-300 ring-1 ring-rose-100' : 'border-teal-200'
          }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner ${
              confirmedAppt.appointmentType === 'EMERGENCY' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {confirmedAppt.appointmentType === 'EMERGENCY' ? (
                <Flame className="w-10 h-10" />
              ) : (
                <CheckCircle2 className="w-10 h-10" />
              )}
            </div>

            <div className="space-y-1">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block ${
                confirmedAppt.appointmentType === 'EMERGENCY'
                  ? 'text-rose-800 bg-rose-100 border border-rose-300'
                  : 'text-emerald-800 bg-emerald-50 border border-emerald-200'
              }`}>
                {confirmedAppt.appointmentType === 'EMERGENCY'
                  ? '🚨 Emergency Appointment Confirmed'
                  : 'Appointment Confirmed'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {confirmedAppt.appointmentType === 'EMERGENCY' ? 'Emergency Request Logged!' : "You're All Set!"}
              </h1>
              <p className="text-xs text-slate-500">
                Appointment ID:{' '}
                <strong className="font-mono text-teal-700 text-sm">{confirmedAppt.id}</strong>
              </p>
            </div>

            {/* Arrival Instructions Callout for Emergency */}
            {confirmedAppt.appointmentType === 'EMERGENCY' && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left max-w-lg mx-auto space-y-1">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Clinic Arrival Instructions:
                </div>
                <p>
                  {doctor.emergencyInstructions ||
                    'Please reach the clinic immediately or contact the clinic reception desk directly.'}
                </p>
              </div>
            )}

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3 text-xs sm:text-sm max-w-lg mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-900">{confirmedAppt.doctorName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Clinic Address:</span>
                <span className="font-semibold text-slate-800">{confirmedAppt.clinicAddress}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Date & Slot:</span>
                <span className={`font-bold ${confirmedAppt.appointmentType === 'EMERGENCY' ? 'text-rose-700' : 'text-teal-800'}`}>
                  {confirmedAppt.date} at {confirmedAppt.timeSlot}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{confirmedAppt.patientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">
                  {confirmedAppt.appointmentType === 'EMERGENCY' ? 'Emergency Fee to Pay at Clinic:' : 'Fee to Pay at Clinic:'}
                </span>
                <span className="font-black text-slate-900">
                  ₹{confirmedAppt.consultationFee}
                </span>
              </div>
            </div>

            {/* Disclaimer reminder */}
            {confirmedAppt.appointmentType === 'EMERGENCY' && (
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                * Dr Khojo is not an emergency medical service or ambulance service. For life-threatening situations, dial 108 immediately.
              </p>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/appointments"
                className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors"
              >
                View in My Appointments →
              </Link>
              <Link
                href="/doctors"
                className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Find Another Doctor
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BookDoctorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
          Loading booking...
        </div>
      }
    >
      <BookDoctorContent />
    </Suspense>
  );
}

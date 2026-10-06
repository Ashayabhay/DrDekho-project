'use client';

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function DoctorAvailabilityPage() {
  const [schedule, setSchedule] = useState({
    activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    morningStart: '10:00',
    morningEnd: '13:30',
    eveningStart: '17:00',
    eveningEnd: '20:30',
    slotDurationMinutes: 15,
    maxPatientsPerSlot: 1,
    acceptingNewPatients: true,
  });

  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) => {
    setSchedule((prev) => {
      const exists = prev.activeDays.includes(day);
      return {
        ...prev,
        activeDays: exists
          ? prev.activeDays.filter((d) => d !== day)
          : [...prev.activeDays, day],
      };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Clinic Availability & Consultation Hours</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure working days, time slots, and patient booking capacity
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Availability schedule saved and updated for patient bookings!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        {/* Working Days */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Consultation Days
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const active = schedule.activeDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    active
                      ? 'bg-teal-700 border-teal-700 text-white shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {day.slice(0, 3)}
                  <span className="block text-[10px] font-normal mt-0.5 opacity-90">
                    {active ? 'Open' : 'Closed'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shift Timings */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            Daily Shift Timings
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Morning Shift */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Morning Shift</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500">From</span>
                  <input
                    type="time"
                    value={schedule.morningStart}
                    onChange={(e) => setSchedule({ ...schedule, morningStart: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500">To</span>
                  <input
                    type="time"
                    value={schedule.morningEnd}
                    onChange={(e) => setSchedule({ ...schedule, morningEnd: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Evening Shift */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Evening Shift</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500">From</span>
                  <input
                    type="time"
                    value={schedule.eveningStart}
                    onChange={(e) => setSchedule({ ...schedule, eveningStart: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500">To</span>
                  <input
                    type="time"
                    value={schedule.eveningEnd}
                    onChange={(e) => setSchedule({ ...schedule, eveningEnd: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slot Interval Settings */}
        <div className="border-t border-slate-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Slot Duration</label>
            <select
              value={schedule.slotDurationMinutes}
              onChange={(e) =>
                setSchedule({ ...schedule, slotDurationMinutes: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
            >
              <option value={10}>10 Minutes per patient</option>
              <option value={15}>15 Minutes per patient (Recommended)</option>
              <option value={20}>20 Minutes per patient</option>
              <option value={30}>30 Minutes per patient</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Patient Acceptance</label>
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={schedule.acceptingNewPatients}
                  onChange={(e) =>
                    setSchedule({ ...schedule, acceptingNewPatients: e.target.checked })
                  }
                  className="w-4 h-4 text-teal-600 rounded border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Accepting new online appointments
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Availability Schedule
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Shield,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  role: 'PATIENT' | 'DOCTOR' | 'CLINIC';
  email: string;
  phone: string;
  subject: string;
  date: string;
  status: 'PENDING' | 'RESOLVED';
}

const SAMPLE_INQUIRIES: Inquiry[] = [
  {
    id: 'INQ-101',
    name: 'Dr. Ramesh Kumar',
    role: 'DOCTOR',
    email: 'drramesh@example.com',
    phone: '+91 98290 11223',
    subject: 'Requesting onboarding support for Patna South clinic branch',
    date: '2026-10-05',
    status: 'PENDING',
  },
  {
    id: 'INQ-102',
    name: 'Pooja Agarwal',
    role: 'PATIENT',
    email: 'pooja.a@example.com',
    phone: '+91 94140 55667',
    subject: 'Inquiry regarding Sunday morning availability for pediatrician',
    date: '2026-10-04',
    status: 'RESOLVED',
  },
];

export default function AdminUsersPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(SAMPLE_INQUIRIES);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleStatus = (id: string) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id
          ? { ...inq, status: inq.status === 'PENDING' ? 'RESOLVED' : 'PENDING' }
          : inq
      )
    );
  };

  const filteredInquiries = inquiries.filter(
    (inq) =>
      !searchQuery ||
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Inquiries & Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Support tickets, clinic onboarding inquiries, and feedback
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search inquiries by name, email, or message..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Contact & Role</th>
                <th className="py-3.5 px-5">Subject / Query</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900">{inq.name}</div>
                    <div className="text-[11px] text-slate-500">{inq.email} • {inq.phone}</div>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {inq.role}
                    </span>
                  </td>

                  <td className="py-4 px-5 max-w-xs">
                    <div className="font-semibold text-slate-800">{inq.subject}</div>
                  </td>

                  <td className="py-4 px-5 text-slate-500 font-medium">
                    {inq.date}
                  </td>

                  <td className="py-4 px-5">
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        inq.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => toggleStatus(inq.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      Mark {inq.status === 'PENDING' ? 'Resolved' : 'Pending'}
                    </button>
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

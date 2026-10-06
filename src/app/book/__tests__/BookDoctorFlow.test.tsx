import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookDoctorPage from '../[doctorId]/page';
import { appointmentService } from '@/services/appointmentService';
import { doctorService } from '@/services/doctorService';

let mockDoctorId = 'doc-1';
let mockSearchParams = new URLSearchParams();

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ doctorId: mockDoctorId }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

// Mock Header and Footer to keep test focused
vi.mock('@/components/Header', () => ({
  Header: () => <div data-testid="header-mock">Header</div>,
}));

vi.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="footer-mock">Footer</div>,
}));

describe('Booking Flow & Patient Details', () => {
  beforeEach(() => {
    window.localStorage?.clear();
    window.scrollTo = vi.fn();
    mockDoctorId = 'doc-1';
    mockSearchParams = new URLSearchParams();
  });

  it('renders Step 1 (Date & Time) and navigates to Step 2 (Patient Details)', () => {
    render(<BookDoctorPage />);

    expect(screen.getByText(/Select Date & Time Slot/i)).toBeInTheDocument();
    expect(screen.getByText('Dr. Rajesh Sharma')).toBeInTheDocument();

    // Click continue to patient details
    const continueBtn = screen.getByRole('button', { name: /Continue to Patient Details/i });
    fireEvent.click(continueBtn);

    expect(screen.getByText('Patient Details')).toBeInTheDocument();
    expect(screen.getByText(/Who is this appointment for\?/i)).toBeInTheDocument();
  });

  it('renders continuous time slots from 06:00 AM all the way to 07:30 PM', () => {
    render(<BookDoctorPage />);

    expect(screen.getAllByText('06:00 AM - 07:00 AM').length).toBeGreaterThan(0);
    expect(screen.getByText('07:00 AM - 08:00 AM')).toBeInTheDocument();
    expect(screen.getByText('12:00 PM - 01:00 PM')).toBeInTheDocument();
    expect(screen.getByText('07:00 PM - 07:30 PM')).toBeInTheDocument();

    // Select evening 7:00 PM - 7:30 PM slot
    const lateSlot = screen.getByRole('button', { name: '07:00 PM - 07:30 PM' });
    fireEvent.click(lateSlot);
    expect(screen.getByText(/Selected:/i)).toHaveTextContent('07:00 PM - 07:30 PM');
  });

  it('toggles between Myself and Someone else', () => {
    render(<BookDoctorPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Patient Details/i }));

    const myselfBtn = screen.getByRole('button', { name: /Myself/i });
    const someoneElseBtn = screen.getByRole('button', { name: /Someone else/i });

    expect(myselfBtn).toBeInTheDocument();
    expect(someoneElseBtn).toBeInTheDocument();

    // Switch to Someone else
    fireEvent.click(someoneElseBtn);
    expect(screen.getByText('Patient Full Name *')).toBeInTheDocument();
    expect(screen.getByText(/Patient Mobile Number \(Optional\)/i)).toBeInTheDocument();

    // Switch back to Myself
    fireEvent.click(myselfBtn);
    expect(screen.getByText('Your Full Name *')).toBeInTheDocument();
    expect(screen.getByText(/Mobile Number \(10 Digits\) \*/i)).toBeInTheDocument();
  });

  it('validates required fields before proceeding to review', () => {
    render(<BookDoctorPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Patient Details/i }));

    const reviewBtn = screen.getByRole('button', { name: /Review Appointment/i });
    fireEvent.click(reviewBtn);

    // Should show validation errors
    expect(screen.getByText(/Please enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/Mobile number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter patient age/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select patient gender/i)).toBeInTheDocument();

    // Confirm that NO appointment was created
    expect(appointmentService.getAllAppointments().length).toBe(0);
  });

  it('allows filling patient details, selecting reason, adding note, and advancing to Review screen', () => {
    render(<BookDoctorPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Patient Details/i }));

    const nameInput = screen.getByPlaceholderText(/e\.g\. Rahul Sharma/i);
    fireEvent.change(nameInput, { target: { value: 'Amit Verma' } });

    const phoneInput = screen.getByPlaceholderText(/9876543210/i);
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });

    const ageInput = screen.getByPlaceholderText(/e\.g\. 28/i);
    fireEvent.change(ageInput, { target: { value: '32' } });

    fireEvent.click(screen.getByRole('button', { name: 'Male' }));

    // Select reason for visit
    const feverBtn = screen.getByRole('button', { name: 'Fever / Cold' });
    fireEvent.click(feverBtn);

    // Add optional note
    const notesInput = screen.getByPlaceholderText(/Any specific symptoms or prior context/i);
    fireEvent.change(notesInput, { target: { value: 'High temperature since yesterday' } });

    // Advance to review
    const reviewBtn = screen.getByRole('button', { name: /Review Appointment/i });
    fireEvent.click(reviewBtn);

    // Verify Review step content
    expect(screen.getByText(/Review Appointment Details/i)).toBeInTheDocument();
    expect(screen.getByText('Amit Verma')).toBeInTheDocument();
    expect(screen.getByText('32 Years')).toBeInTheDocument();
    expect(screen.getByText('Fever / Cold')).toBeInTheDocument();
    expect(screen.getByText(/High temperature since yesterday/i)).toBeInTheDocument();

    // Still NO appointment created until confirmation
    expect(appointmentService.getAllAppointments().length).toBe(0);
  });

  it('allows navigating back to edit details without losing entered data', () => {
    render(<BookDoctorPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Patient Details/i }));

    const nameInput = screen.getByPlaceholderText(/e\.g\. Rahul Sharma/i);
    fireEvent.change(nameInput, { target: { value: 'Priya Sen' } });

    const phoneInput = screen.getByPlaceholderText(/9876543210/i);
    fireEvent.change(phoneInput, { target: { value: '9811223344' } });

    const ageInput = screen.getByPlaceholderText(/e\.g\. 28/i);
    fireEvent.change(ageInput, { target: { value: '25' } });

    fireEvent.click(screen.getByRole('button', { name: 'Female' }));

    // Advance to review
    fireEvent.click(screen.getByRole('button', { name: /Review Appointment/i }));
    expect(screen.getByText(/Review Appointment Details/i)).toBeInTheDocument();

    // Click Edit Details to go back
    const editBtn = screen.getByRole('button', { name: /Edit Details/i });
    fireEvent.click(editBtn);

    // Returned to Patient Details and inputs retain values
    expect(screen.getByDisplayValue('Priya Sen')).toBeInTheDocument();
    expect(screen.getByDisplayValue('9811223344')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();

    // Still ZERO appointments
    expect(appointmentService.getAllAppointments().length).toBe(0);
  });

  it('creates exactly 1 appointment only when Confirm Appointment is clicked', () => {
    render(<BookDoctorPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Patient Details/i }));

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Rahul Sharma/i), {
      target: { value: 'Kavita Roy' },
    });
    fireEvent.change(screen.getByPlaceholderText('9876543210'), {
      target: { value: '9123456789' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. 28/i), {
      target: { value: '40' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Female' }));

    // Review
    fireEvent.click(screen.getByRole('button', { name: /Review Appointment/i }));

    // Click Confirm
    const confirmBtn = screen.getByRole('button', { name: /Confirm Appointment/i });
    fireEvent.click(confirmBtn);

    // Confirmed Screen rendered
    expect(screen.getByText(/Appointment Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/You're All Set!/i)).toBeInTheDocument();

    // Now exactly 1 appointment exists
    const appts = appointmentService.getAllAppointments();
    expect(appts.length).toBe(1);
    expect(appts[0].patientName).toBe('Kavita Roy');
    expect(appts[0].patientPhone).toBe('9123456789');
    expect(appts[0].status).toBe('CONFIRMED');
    expect(appts[0].appointmentType).toBe('REGULAR');
    expect(appts[0].doctorName).toBe('Dr. Rajesh Sharma');
  });

  // ========================================================
  // DOCTOR EMERGENCY SERVICE TESTS
  // ========================================================

  it('shows outside hours message when patient attempts emergency booking outside configured window', () => {
    // Current time: 2:00 PM (outside 6 PM - 10 PM)
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 6, 14, 0, 0));

    mockSearchParams = new URLSearchParams('type=emergency');
    render(<BookDoctorPage />);

    expect(screen.getByText(/Emergency Appointments Currently Unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/06:00 PM - 10:00 PM/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Book Regular Appointment/i })).toBeInTheDocument();

    // Click Book Regular Appointment switches to date & time step
    fireEvent.click(screen.getByRole('button', { name: /Book Regular Appointment/i }));
    expect(screen.getByText(/Select Date & Time Slot/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('handles emergency appointment booking flow when within doctor emergency hours', () => {
    // Mock system time to 7:30 PM (inside 6:00 PM - 10:00 PM)
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 6, 19, 30, 0));

    mockSearchParams = new URLSearchParams('type=emergency');
    render(<BookDoctorPage />);

    // Check emergency header and disclaimer
    expect(screen.getByText(/Emergency Consultation Available Now/i)).toBeInTheDocument();
    expect(screen.getByText(/Important Emergency Medical Notice:/i)).toBeInTheDocument();

    // Proceed to emergency patient details
    const continueBtn = screen.getByRole('button', { name: /Continue to Emergency Patient Details/i });
    fireEvent.click(continueBtn);

    expect(screen.getByText(/🚨 Emergency Priority Consultation/i)).toBeInTheDocument();

    // Fill emergency patient details
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Rahul Sharma/i), {
      target: { value: 'Emergency Patient' },
    });
    fireEvent.change(screen.getByPlaceholderText(/9876543210/i), {
      target: { value: '9888877777' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. 28/i), {
      target: { value: '45' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Male' }));

    // Select emergency reason chip
    const severePainBtn = screen.getByRole('button', { name: 'Severe pain' });
    fireEvent.click(severePainBtn);

    // Proceed to review
    const reviewBtn = screen.getByRole('button', { name: /Review Emergency Appointment/i });
    fireEvent.click(reviewBtn);

    // Verify Emergency Review Step
    expect(screen.getByText(/Review Emergency Appointment Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Today • Immediate \/ Emergency Priority Slot/i)).toBeInTheDocument();
    expect(screen.getByText('Severe pain')).toBeInTheDocument();

    // Confirm Emergency Appointment
    const confirmBtn = screen.getByRole('button', { name: /Confirm Emergency Appointment/i });
    fireEvent.click(confirmBtn);

    // Confirmation Screen
    expect(screen.getByText(/🚨 Emergency Appointment Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Request Logged!/i)).toBeInTheDocument();

    // Check saved appointment in unified store
    const appts = appointmentService.getAllAppointments();
    expect(appts.length).toBe(1);
    expect(appts[0].appointmentType).toBe('EMERGENCY');
    expect(appts[0].patientName).toBe('Emergency Patient');
    expect(appts[0].date).toBe('Today');
    expect(appts[0].timeSlot).toBe('Immediate / Emergency Priority Slot');

    vi.useRealTimers();
  });

  it('disables emergency booking if doctor does not provide emergency appointments', () => {
    // doc-2 is Dr. Ananya Verma who has providesEmergency: false
    mockDoctorId = 'doc-2';
    mockSearchParams = new URLSearchParams('type=emergency');
    render(<BookDoctorPage />);

    expect(screen.getByText(/Emergency Appointments Not Provided/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Book Regular Appointment Instead/i })).toBeInTheDocument();

    // Switch to regular
    fireEvent.click(screen.getByRole('button', { name: /Book Regular Appointment Instead/i }));
    expect(screen.getByText(/Select Date & Time Slot/i)).toBeInTheDocument();
  });
});

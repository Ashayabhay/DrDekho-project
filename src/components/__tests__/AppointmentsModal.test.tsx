import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppointmentsModal, BookedAppointment } from '../AppointmentsModal';

const mockAppointments: BookedAppointment[] = [
  {
    id: 'appt-test',
    doctorName: 'Dr. Test Doctor',
    speciality: 'Cardiologist',
    clinicName: 'Heart Care Center',
    clinicAddress: '45 Health Ave',
    date: 'Today',
    timeSlot: '10:00 AM',
    patientName: 'Test Patient',
    patientPhone: '9876543210',
    status: 'CONFIRMED',
    consultationFee: 500,
  },
];

describe('AppointmentsModal Component', () => {
  it('renders modal with booked appointment details', () => {
    const handleClose = vi.fn();
    render(
      <AppointmentsModal
        isOpen={true}
        onClose={handleClose}
        appointments={mockAppointments}
      />
    );

    expect(screen.getByText('Your Appointments')).toBeInTheDocument();
    expect(screen.getByText('Dr. Test Doctor')).toBeInTheDocument();
    expect(screen.getByText('Heart Care Center')).toBeInTheDocument();
    expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
  });

  it('renders empty state when no appointments exist', () => {
    const handleClose = vi.fn();
    render(
      <AppointmentsModal
        isOpen={true}
        onClose={handleClose}
        appointments={[]}
      />
    );

    expect(screen.getByText('No appointments booked yet')).toBeInTheDocument();
  });
});

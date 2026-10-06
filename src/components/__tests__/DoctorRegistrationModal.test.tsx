import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DoctorRegistrationModal } from '../DoctorRegistrationModal';

describe('DoctorRegistrationModal Component', () => {
  it('renders modal when isOpen is true', () => {
    const handleClose = vi.fn();
    const handleRegister = vi.fn();

    render(
      <DoctorRegistrationModal
        isOpen={true}
        onClose={handleClose}
        onDoctorRegistered={handleRegister}
      />
    );

    expect(screen.getByText('Doctor & Clinic Registration')).toBeInTheDocument();
    expect(screen.getByLabelText(/Doctor Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Clinic \/ Hospital Name/i)).toBeInTheDocument();
  });

  it('submits doctor registration successfully', () => {
    const handleClose = vi.fn();
    const handleRegister = vi.fn();

    render(
      <DoctorRegistrationModal
        isOpen={true}
        onClose={handleClose}
        onDoctorRegistered={handleRegister}
      />
    );

    fireEvent.change(screen.getByLabelText(/Doctor Name/i), {
      target: { value: 'Dr. Neha Kapoor' },
    });
    fireEvent.change(screen.getByLabelText(/Qualifications/i), {
      target: { value: 'MBBS, MD' },
    });
    fireEvent.change(screen.getByLabelText(/Clinic \/ Hospital Name/i), {
      target: { value: 'Kapoor Care Clinic' },
    });
    fireEvent.change(screen.getByLabelText(/WhatsApp \/ Phone Number/i), {
      target: { value: '9876543210' },
    });
    fireEvent.change(screen.getByLabelText(/Clinic Address/i), {
      target: { value: '12 Medical Square' },
    });

    const submitBtn = screen.getByRole('button', { name: /Complete Registration/i });
    fireEvent.click(submitBtn);

    expect(handleRegister).toHaveBeenCalled();
    expect(screen.getByText('Registration Successful!')).toBeInTheDocument();
  });
});

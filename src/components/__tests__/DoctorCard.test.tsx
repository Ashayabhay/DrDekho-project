import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DoctorCard, Doctor } from '../DoctorCard';

const mockDoctor: Doctor = {
  id: 'doc-test',
  name: 'Dr. Test Doctor',
  speciality: 'General Physician',
  qualification: 'MBBS, MD',
  experienceYears: 10,
  clinicName: 'Test Healthcare Center',
  address: '123 Main Street',
  city: 'jaipur',
  availabilityToday: '9:00 AM - 1:00 PM',
  consultationFee: 500,
};

describe('DoctorCard Component', () => {
  it('renders doctor details correctly', () => {
    render(<DoctorCard doctor={mockDoctor} />);

    expect(screen.getByText('Dr. Test Doctor')).toBeInTheDocument();
    expect(screen.getByText('General Physician')).toBeInTheDocument();
    expect(screen.getByText('Test Healthcare Center')).toBeInTheDocument();
    expect(screen.getByText('₹500')).toBeInTheDocument();
  });

  it('triggers book click callback when Book appointment is clicked', () => {
    const handleBookClick = vi.fn();
    render(<DoctorCard doctor={mockDoctor} onBookClick={handleBookClick} />);

    const bookButton = screen.getByRole('button', { name: /Book appointment/i });
    fireEvent.click(bookButton);

    expect(handleBookClick).toHaveBeenCalledWith('doc-test');
  });
});

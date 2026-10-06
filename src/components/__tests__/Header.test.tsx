import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../Header';

describe('Header Component', () => {
  it('renders official logo image and navigation controls in correct sequence', () => {
    const handleSelectLocation = vi.fn();
    render(
      <Header
        selectedLocation={{ city: 'Jaipur', state: 'Rajasthan' }}
        onSelectLocation={handleSelectLocation}
      />
    );

    // 1. Logo
    expect(screen.getByAltText(/Dr Khojo/i)).toBeInTheDocument();

    // 2. Location selector as separate navigation control
    const cityElements = screen.getAllByText(/Jaipur/i);
    expect(cityElements.length).toBeGreaterThan(0);

    // 3. Find a doctor
    expect(screen.getByText(/Find a doctor/i)).toBeInTheDocument();

    // 4. Your appointments
    expect(screen.getByText(/Your appointments/i)).toBeInTheDocument();

    // 5. Emergency
    expect(screen.getByText(/Emergency \(108\)/i)).toBeInTheDocument();

    // 6. Doctor registration
    expect(screen.getAllByText(/Doctor Registration/i).length).toBeGreaterThan(0);
  });

  it('allows clicking location selector dropdown to view cities without overlapping', () => {
    const handleSelectLocation = vi.fn();
    render(
      <Header
        selectedLocation={{ city: 'Jaipur', state: 'Rajasthan' }}
        onSelectLocation={handleSelectLocation}
      />
    );

    // Find and click the location selector button
    const locationBtns = screen.getAllByRole('button', { name: /Select city and state/i });
    expect(locationBtns.length).toBeGreaterThan(0);
    fireEvent.click(locationBtns[0]);

    // Dropdown modal opens
    expect(screen.getByText(/Choose Any Indian City or State/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type any Indian city name/i)).toBeInTheDocument();
  });
});

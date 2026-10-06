import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer Component', () => {
  it('renders the transparent Dr Khojo logo directly without a white container card', () => {
    const { container } = render(<Footer />);

    // Check that inverse logo image is rendered for dark navy background
    const logoImg = screen.getByAltText(/Dr Khojo - Find\. Compare\. Book\./i);
    expect(logoImg).toBeInTheDocument();
    expect(logoImg.getAttribute('src')).toMatch(/logo-inverse\.png/);

    // Verify there is no white container wrapping the logo
    const whiteCards = container.querySelectorAll('.bg-white');
    expect(whiteCards.length).toBe(0);

    // Verify footer has dark background
    const footerElement = container.querySelector('footer');
    expect(footerElement).toHaveClass('bg-slate-900');
  });

  it('renders patient guarantees and founding pilot information', () => {
    render(<Footer />);
    expect(screen.getByText(/Patient Guarantees/i)).toBeInTheDocument();
    expect(screen.getByText(/Founding Pilot Program/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Free search & booking for patients/i)).toBeInTheDocument();
  });
});

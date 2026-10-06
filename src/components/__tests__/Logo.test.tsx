import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo } from '../Logo';

describe('Logo Component', () => {
  it('renders complete original logo on light backgrounds as a single coherent brand element', () => {
    const { container } = render(<Logo variant="default" size="header" />);
    const img = screen.getByAltText(/Dr Khojo - Find\. Compare\. Book\./i);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toMatch(/logo\.png/);
    expect(img.className).toContain('w-auto');
    expect(img.className).toContain('object-contain');

    // Asserts no extra separated text elements were created
    const textNodes = container.querySelectorAll('span, p, h1, h2, h3, h4, h5, h6');
    expect(textNodes.length).toBe(0);
  });

  it('renders complete inverse logo on dark backgrounds with prominent footer scaling', () => {
    const { container } = render(<Logo variant="inverse" size="footer" />);
    const img = screen.getByAltText(/Dr Khojo - Find\. Compare\. Book\./i);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toMatch(/logo-inverse\.png/);
    expect(img.className).toContain('w-auto');
    expect(img.className).toContain('object-contain');

    // Asserts no extra separated text elements were created
    const textNodes = container.querySelectorAll('span, p, h1, h2, h3, h4, h5, h6');
    expect(textNodes.length).toBe(0);
  });
});

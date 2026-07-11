import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import CsvInstructionsModal from '../../../components/Dashboard/CsvInstructionsModal';

describe('CsvInstructionsModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(<CsvInstructionsModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when isOpen is true', () => {
    render(<CsvInstructionsModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('CSV Format Guide')).toBeInTheDocument();
    expect(screen.getByText('Format A')).toBeInTheDocument();
    expect(screen.getByText('One ingredient per row')).toBeInTheDocument();
    expect(screen.getByText('Format B')).toBeInTheDocument();
    expect(screen.getByText('All ingredients in one cell')).toBeInTheDocument();
  });
});

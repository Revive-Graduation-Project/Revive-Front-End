import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import ModalWrapper from '../ModalWrapper';

afterEach(() => {
  cleanup();
});
import { FiTag } from 'react-icons/fi';

describe('ModalWrapper', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ModalWrapper isOpen={false} onClose={() => {}} title="Test Modal">
        <div>Content</div>
      </ModalWrapper>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when isOpen is true', () => {
    render(
      <ModalWrapper isOpen={true} onClose={() => {}} title="Test Modal" icon={FiTag}>
        <div data-testid="modal-content">Content</div>
      </ModalWrapper>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = vi.fn();
    render(
      <ModalWrapper isOpen={true} onClose={onCloseMock} title="Test Modal">
        <div>Content</div>
      </ModalWrapper>
    );
    
    const closeBtn = screen.getByRole('button');
    fireEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('disables close button when isPending is true', () => {
    render(
      <ModalWrapper isOpen={true} onClose={() => {}} title="Test Modal" isPending={true}>
        <div>Content</div>
      </ModalWrapper>
    );
    
    const closeBtn = screen.getByRole('button');
    expect(closeBtn).toBeDisabled();
  });
});

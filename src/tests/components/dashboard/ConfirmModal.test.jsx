import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../../../components/Dashboard/shared/ConfirmModal';

describe('ConfirmModal', () => {
  test('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmModal isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Item"
        message="Are you sure?"
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  test('displays default title and message when none provided', () => {
    render(
      <ConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone. Do you wish to proceed?')).toBeInTheDocument();
  });

  test('displays default confirm button label "Delete"', () => {
    render(
      <ConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  test('displays custom confirmLabel when provided', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        confirmLabel="Remove"
      />
    );
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });

  test('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ConfirmModal isOpen={true} onClose={onClose} onConfirm={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm and onClose when confirm button is clicked', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />
    );
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('confirm button calls onConfirm before onClose (order matters)', () => {
    const callOrder = [];
    const onClose = vi.fn(() => callOrder.push('close'));
    const onConfirm = vi.fn(() => callOrder.push('confirm'));
    render(
      <ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />
    );
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(callOrder).toEqual(['confirm', 'close']);
  });

  test('has correct aria attributes for accessibility', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Test title"
        message="Test message"
      />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'confirm-modal-message');
  });

  test('transitions from closed to open state', () => {
    const { rerender } = render(
      <ConfirmModal isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} title="Test" />
    );
    expect(screen.queryByText('Test')).toBeNull();

    rerender(
      <ConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} title="Test" />
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  test('Cancel button does not call onConfirm', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={onConfirm} />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
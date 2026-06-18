import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { useToast, ToastContainer } from '../../../components/Dashboard/shared/useToast';

// Test helper component that uses the useToast hook
function ToastTester({ action, label = 'trigger' }) {
  const toast = useToast();
  return (
    <div>
      <button onClick={() => action(toast)}>{label}</button>
    </div>
  );
}

// Wrapper that renders both the trigger and a fresh ToastContainer
function ToastTestWrapper({ action, label = 'trigger' }) {
  return (
    <div>
      <ToastTester action={action} label={label} />
      <ToastContainer />
    </div>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  // Dismiss all existing toasts by advancing past any duration so store is emptied
  act(() => { vi.advanceTimersByTime(10000); });
  vi.useRealTimers();
});

describe('useToast hook', () => {
  test('addToast(msg, "success") adds a success toast to ToastContainer', () => {
    const { getByText } = render(<ToastTestWrapper action={(t) => t.addToast('Saved!', 'success')} />);
    fireEvent.click(getByText('trigger'));
    expect(getByText('Saved!')).toBeInTheDocument();
  });

  test('addToast(msg, "error") adds an error toast', () => {
    const { getByText } = render(<ToastTestWrapper action={(t) => t.addToast('Failed!', 'error')} />);
    fireEvent.click(getByText('trigger'));
    expect(getByText('Failed!')).toBeInTheDocument();
  });

  test('addToast(msg, "info") adds an info toast', () => {
    const { getByText } = render(<ToastTestWrapper action={(t) => t.addToast('Note!', 'info')} />);
    fireEvent.click(getByText('trigger'));
    expect(getByText('Note!')).toBeInTheDocument();
  });

  test('success() helper adds a success toast', () => {
    const { getByText } = render(<ToastTestWrapper action={(t) => t.success('Item saved')} />);
    fireEvent.click(getByText('trigger'));
    expect(getByText('Item saved')).toBeInTheDocument();
  });

  test('error() helper adds an error toast', () => {
    const { getByText } = render(<ToastTestWrapper action={(t) => t.error('Upload failed')} />);
    fireEvent.click(getByText('trigger'));
    expect(getByText('Upload failed')).toBeInTheDocument();
  });

  test('info() helper adds an info toast', () => {
    const { getByText } = render(<ToastTestWrapper action={(t) => t.info('Processing...')} />);
    fireEvent.click(getByText('trigger'));
    expect(getByText('Processing...')).toBeInTheDocument();
  });

  test('toast is auto-dismissed after default duration', () => {
    const { getByText, queryByText } = render(
      <ToastTestWrapper action={(t) => t.addToast('Quick message', 'info')} />
    );
    fireEvent.click(getByText('trigger'));
    expect(getByText('Quick message')).toBeInTheDocument();

    // Advance time past 3500ms default duration
    act(() => { vi.advanceTimersByTime(4000); });
    expect(queryByText('Quick message')).toBeNull();
  });

  test('close button (X) removes a specific toast', () => {
    const { getByText, queryByText } = render(
      <ToastTestWrapper action={(t) => t.addToast('Dismissable toast', 'success')} />
    );
    fireEvent.click(getByText('trigger'));
    expect(getByText('Dismissable toast')).toBeInTheDocument();

    // Find the close button within the toast that contains 'Dismissable toast'
    const toastText = getByText('Dismissable toast');
    const toastContainer = toastText.closest('div[class*="animate-slide-in"]');
    expect(toastContainer).not.toBeNull();

    const closeBtn = within(toastContainer).getByRole('button');
    fireEvent.click(closeBtn);
    expect(queryByText('Dismissable toast')).toBeNull();
  });

  test('multiple toasts are rendered simultaneously', () => {
    const { getByText } = render(
      <ToastTestWrapper
        action={(t) => { t.addToast('Toast A', 'success'); t.addToast('Toast B', 'error'); }}
      />
    );
    fireEvent.click(getByText('trigger'));
    expect(getByText('Toast A')).toBeInTheDocument();
    expect(getByText('Toast B')).toBeInTheDocument();
  });
});

describe('ToastContainer', () => {
  test('renders its fixed-position container element', () => {
    const { container } = render(<ToastContainer />);
    // The outer fixed div should always be present
    expect(container.firstChild).toBeInTheDocument();
    const fixedDiv = container.querySelector('.fixed');
    expect(fixedDiv).toBeInTheDocument();
  });

  test('renders toast items when store has toasts', () => {
    // Trigger a toast through the hook, then verify ToastContainer renders it
    const { getByText } = render(
      <div>
        <ToastTester action={(t) => t.addToast('Container test toast', 'info')} />
        <ToastContainer />
      </div>
    );
    fireEvent.click(getByText('trigger'));
    expect(getByText('Container test toast')).toBeInTheDocument();
  });
});
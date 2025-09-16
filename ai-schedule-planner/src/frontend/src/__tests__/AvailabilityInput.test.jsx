import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AvailabilityInput from '../components/AvailabilityInput';

describe('AvailabilityInput Component', () => {
  const mockOnChange = jest.fn();
  const mockOnLoadExample = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders textarea with initial value', () => {
    const initialValue = { Alice: [['09:00', '17:00']] };
    render(
      <AvailabilityInput
        value={initialValue}
        onChange={mockOnChange}
        onLoadExample={mockOnLoadExample}
      />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea.value).toContain('Alice');
    expect(textarea.value).toContain('09:00');
    expect(textarea.value).toContain('17:00');
  });

  test('calls onChange when textarea content changes', async () => {
    const user = userEvent.setup();
    const initialValue = { Alice: [['09:00', '17:00']] };
    
    render(
      <AvailabilityInput
        value={initialValue}
        onChange={mockOnChange}
        onLoadExample={mockOnLoadExample}
      />
    );

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, '{"Bob": [["10:00", "18:00"]]}');

    expect(mockOnChange).toHaveBeenCalledWith({ Bob: [['10:00', '18:00']] });
  });

  test('shows error for invalid JSON', async () => {
    const user = userEvent.setup();
    const initialValue = { Alice: [['09:00', '17:00']] };
    
    render(
      <AvailabilityInput
        value={initialValue}
        onChange={mockOnChange}
        onLoadExample={mockOnLoadExample}
      />
    );

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'invalid json');

    expect(screen.getByText('Invalid JSON format')).toBeInTheDocument();
  });

  test('calls onLoadExample when load example button is clicked', async () => {
    const user = userEvent.setup();
    const initialValue = { Alice: [['09:00', '17:00']] };
    
    render(
      <AvailabilityInput
        value={initialValue}
        onChange={mockOnChange}
        onLoadExample={mockOnLoadExample}
      />
    );

    const loadExampleButton = screen.getByText('Load Example');
    await user.click(loadExampleButton);

    expect(mockOnLoadExample).toHaveBeenCalled();
  });

  test('shows format guide', () => {
    const initialValue = { Alice: [['09:00', '17:00']] };
    
    render(
      <AvailabilityInput
        value={initialValue}
        onChange={mockOnChange}
        onLoadExample={mockOnLoadExample}
      />
    );

    expect(screen.getByText('Format Guide:')).toBeInTheDocument();
    expect(screen.getByText(/Use 24-hour format/)).toBeInTheDocument();
    expect(screen.getByText(/Each person can have multiple time ranges/)).toBeInTheDocument();
    expect(screen.getByText(/Times should be in UTC/)).toBeInTheDocument();
    expect(screen.getByText(/Start time must be before end time/)).toBeInTheDocument();
  });

  test('shows format example', () => {
    const initialValue = { Alice: [['09:00', '17:00']] };
    
    render(
      <AvailabilityInput
        value={initialValue}
        onChange={mockOnChange}
        onLoadExample={mockOnLoadExample}
      />
    );

    expect(screen.getByText(/Format: \{ "Name": \[\["start", "end"\]\] \}/)).toBeInTheDocument();
  });

  test('clears error when valid JSON is entered', async () => {
    const user = userEvent.setup();
    const initialValue = { Alice: [['09:00', '17:00']] };
    
    render(
      <AvailabilityInput
        value={initialValue}
        onChange={mockOnChange}
        onLoadExample={mockOnLoadExample}
      />
    );

    const textarea = screen.getByRole('textbox');
    
    // Enter invalid JSON
    await user.clear(textarea);
    await user.type(textarea, 'invalid json');
    expect(screen.getByText('Invalid JSON format')).toBeInTheDocument();
    
    // Enter valid JSON
    await user.clear(textarea);
    await user.type(textarea, '{"Bob": [["10:00", "18:00"]]}');
    expect(screen.queryByText('Invalid JSON format')).not.toBeInTheDocument();
  });

  test('applies error styling when JSON is invalid', async () => {
    const user = userEvent.setup();
    const initialValue = { Alice: [['09:00', '17:00']] };
    
    render(
      <AvailabilityInput
        value={initialValue}
        onChange={mockOnChange}
        onLoadExample={mockOnLoadExample}
      />
    );

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'invalid json');

    expect(textarea).toHaveClass('border-red-300', 'bg-red-50');
  });

  test('applies normal styling when JSON is valid', () => {
    const initialValue = { Alice: [['09:00', '17:00']] };
    
    render(
      <AvailabilityInput
        value={initialValue}
        onChange={mockOnChange}
        onLoadExample={mockOnLoadExample}
      />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-gray-300');
    expect(textarea).not.toHaveClass('border-red-300', 'bg-red-50');
  });
});

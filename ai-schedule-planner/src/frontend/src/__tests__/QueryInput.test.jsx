import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QueryInput from '../components/QueryInput';

describe('QueryInput Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input field with label', () => {
    render(<QueryInput value="" onChange={mockOnChange} placeholder="Test placeholder" />);
    
    expect(screen.getByText('Natural Language Query (Optional):')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('displays initial value', () => {
    render(<QueryInput value="morning meeting" onChange={mockOnChange} placeholder="Test placeholder" />);
    
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('morning meeting');
  });

  test('calls onChange when input value changes', async () => {
    const user = userEvent.setup();
    render(<QueryInput value="" onChange={mockOnChange} placeholder="Test placeholder" />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'urgent meeting');
    
    expect(mockOnChange).toHaveBeenCalledWith('urgent meeting');
  });

  test('displays placeholder text', () => {
    render(<QueryInput value="" onChange={mockOnChange} placeholder="e.g., morning meeting" />);
    
    const input = screen.getByRole('textbox');
    expect(input.placeholder).toBe('e.g., morning meeting');
  });

  test('shows help text', () => {
    render(<QueryInput value="" onChange={mockOnChange} placeholder="Test placeholder" />);
    
    expect(screen.getByText(/Describe your meeting preferences/)).toBeInTheDocument();
  });

  test('handles empty value', async () => {
    const user = userEvent.setup();
    render(<QueryInput value="initial" onChange={mockOnChange} placeholder="Test placeholder" />);
    
    const input = screen.getByRole('textbox');
    await user.clear(input);
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  test('handles special characters in input', async () => {
    const user = userEvent.setup();
    render(<QueryInput value="" onChange={mockOnChange} placeholder="Test placeholder" />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'meeting @ 2pm!');
    
    expect(mockOnChange).toHaveBeenCalledWith('meeting @ 2pm!');
  });
});

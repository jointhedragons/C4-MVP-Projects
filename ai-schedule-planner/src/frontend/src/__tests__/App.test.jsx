import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as api from '../api';

// Mock the API module
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  findMeetingTimes: jest.fn(),
  validateAvailability: jest.fn(),
  getExampleAvailability: jest.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up default mock implementations
    api.validateAvailability.mockReturnValue({ valid: true, errors: [] });
    api.getExampleAvailability.mockReturnValue({
      Alice: [['09:00', '17:00']],
      Bob: [['12:00', '20:00']],
      Charlie: [['08:00', '12:00'], ['14:00', '18:00']]
    });
  });

  test('renders the main heading', () => {
    render(<App />);
    expect(screen.getByText('AI Schedule Planner')).toBeInTheDocument();
  });

  test('renders the description', () => {
    render(<App />);
    expect(screen.getByText(/Find the perfect meeting time for your team/)).toBeInTheDocument();
  });

  test('renders availability input section', () => {
    render(<App />);
    expect(screen.getByText('Team Availability')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter team availability in JSON format:')).toBeInTheDocument();
  });

  test('renders query input section', () => {
    render(<App />);
    expect(screen.getByText('Optional Query')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/morning meeting/)).toBeInTheDocument();
  });

  test('renders find meeting time button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /find meeting time/i })).toBeInTheDocument();
  });

  test('loads example data when load example button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const loadExampleButton = screen.getByText('Load Example');
    await user.click(loadExampleButton);
    
    const textarea = screen.getByLabelText('Enter team availability in JSON format:');
    expect(textarea.value).toContain('Alice');
    expect(textarea.value).toContain('Bob');
    expect(textarea.value).toContain('Charlie');
  });

  test('shows error when API call fails', async () => {
    const user = userEvent.setup();
    api.findMeetingTimes.mockRejectedValue(new Error('API Error'));
    
    render(<App />);
    
    const findButton = screen.getByRole('button', { name: /find meeting time/i });
    await user.click(findButton);
    
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  test('shows loading state when finding meeting times', async () => {
    const user = userEvent.setup();
    api.findMeetingTimes.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<App />);
    
    const findButton = screen.getByRole('button', { name: /find meeting time/i });
    await user.click(findButton);
    
    expect(screen.getByText(/Finding Meeting Times/)).toBeInTheDocument();
    expect(findButton).toBeDisabled();
  });

  test('displays results when API call succeeds', async () => {
    const user = userEvent.setup();
    const mockResults = {
      slots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        }
      ],
      explanation: '12:00 UTC works for all members.',
      aiRefined: true
    };
    
    api.findMeetingTimes.mockResolvedValue(mockResults);
    
    render(<App />);
    
    const findButton = screen.getByRole('button', { name: /find meeting time/i });
    await user.click(findButton);
    
    await waitFor(() => {
      expect(screen.getByText('Meeting Time Results')).toBeInTheDocument();
      expect(screen.getByText('12:00 UTC')).toBeInTheDocument();
      expect(screen.getByText('13:00 UTC')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('12:00 UTC works for all members.')).toBeInTheDocument();
    });
  });

  test('calls API with correct parameters', async () => {
    const user = userEvent.setup();
    api.findMeetingTimes.mockResolvedValue({ slots: [], explanation: 'No slots found' });
    
    render(<App />);
    
    // Load example data
    const loadExampleButton = screen.getByText('Load Example');
    await user.click(loadExampleButton);
    
    // Add a query
    const queryInput = screen.getByPlaceholderText(/morning meeting/);
    await user.type(queryInput, 'morning meeting');
    
    // Click find button
    const findButton = screen.getByRole('button', { name: /find meeting time/i });
    await user.click(findButton);
    
    await waitFor(() => {
      expect(api.findMeetingTimes).toHaveBeenCalledWith(
        {
          Alice: [['09:00', '17:00']],
          Bob: [['12:00', '20:00']],
          Charlie: [['08:00', '12:00'], ['14:00', '18:00']]
        },
        'morning meeting'
      );
    });
  });

  test('shows AI enhanced indicator when AI is used', async () => {
    const user = userEvent.setup();
    const mockResults = {
      slots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        }
      ],
      explanation: '12:00 UTC works for all members.',
      aiRefined: true
    };
    
    api.findMeetingTimes.mockResolvedValue(mockResults);
    
    render(<App />);
    
    const findButton = screen.getByRole('button', { name: /find meeting time/i });
    await user.click(findButton);
    
    await waitFor(() => {
      expect(screen.getByText('✨ AI Enhanced')).toBeInTheDocument();
    });
  });

  test('clears previous results when new search is made', async () => {
    const user = userEvent.setup();
    const mockResults = {
      slots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        }
      ],
      explanation: '12:00 UTC works for all members.',
      aiRefined: true
    };
    
    api.findMeetingTimes.mockResolvedValue(mockResults);
    
    render(<App />);
    
    // First search
    const findButton = screen.getByRole('button', { name: /find meeting time/i });
    await user.click(findButton);
    
    await waitFor(() => {
      expect(screen.getByText('Meeting Time Results')).toBeInTheDocument();
    });
    
    // Clear results by changing availability
    const textarea = screen.getByLabelText('Enter team availability in JSON format:');
    await user.clear(textarea);
    await user.type(textarea, '{"Alice": [["10:00", "11:00"]]}');
    
    // Results should be cleared
    expect(screen.queryByText('Meeting Time Results')).not.toBeInTheDocument();
  });
});

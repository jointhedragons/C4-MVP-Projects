import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiMeetingDashboard from '../components/MultiMeetingDashboard';

// Mock the API functions
jest.mock('../api', () => ({
  scheduleMultipleMeetings: jest.fn(),
  analyzeConflicts: jest.fn(),
  getOptimizationSuggestions: jest.fn(),
  getExampleMeetings: jest.fn(() => [
    {
      id: 'meeting-1',
      title: 'Product Planning',
      participants: ['Alice', 'Bob', 'Charlie'],
      duration: 60,
      importance: 4,
      urgency: 'high',
    },
  ]),
  getExampleAvailability: jest.fn(() => ({
    Alice: [['09:00', '17:00']],
    Bob: [['12:00', '20:00']],
    Charlie: [['08:00', '12:00'], ['14:00', '18:00']],
  })),
}));

import {
  scheduleMultipleMeetings,
  analyzeConflicts,
  getOptimizationSuggestions,
} from '../api';

describe('MultiMeetingDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with initial step', () => {
    render(<MultiMeetingDashboard />);
    
    expect(screen.getByText('Multi-Meeting Optimization Dashboard')).toBeInTheDocument();
    expect(screen.getByText('1. Meetings')).toBeInTheDocument();
    expect(screen.getByText('2. Availability')).toBeInTheDocument();
    expect(screen.getByText('3. Optimize')).toBeInTheDocument();
  });

  test('displays example meetings on load', () => {
    render(<MultiMeetingDashboard />);
    
    expect(screen.getByText('Product Planning')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('⭐ 4/5')).toBeInTheDocument();
  });

  test('adds new meeting when add button is clicked', () => {
    render(<MultiMeetingDashboard />);
    
    const addButton = screen.getByText('+ Add Meeting');
    fireEvent.click(addButton);
    
    // Should have two meetings now (original + new)
    const meetingCards = screen.getAllByText(/Untitled Meeting|Product Planning/);
    expect(meetingCards.length).toBeGreaterThan(1);
  });

  test('navigates to availability step', () => {
    render(<MultiMeetingDashboard />);
    
    const nextButton = screen.getByText('Next: Set Availability');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Team Availability')).toBeInTheDocument();
    expect(screen.getByText('Back: Meetings')).toBeInTheDocument();
  });

  test('navigates to optimization step', () => {
    render(<MultiMeetingDashboard />);
    
    // Go to availability step first
    const nextButton = screen.getByText('Next: Set Availability');
    fireEvent.click(nextButton);
    
    // Then go to optimization step
    const optimizeButton = screen.getByText('Next: Optimize');
    fireEvent.click(optimizeButton);
    
    expect(screen.getByText('Optimization Settings')).toBeInTheDocument();
    expect(screen.getByText('Optimization Method')).toBeInTheDocument();
  });

  test('changes optimization method', () => {
    render(<MultiMeetingDashboard />);
    
    // Navigate to optimization step
    fireEvent.click(screen.getByText('Next: Set Availability'));
    fireEvent.click(screen.getByText('Next: Optimize'));
    
    const methodSelect = screen.getByDisplayValue('Greedy Algorithm (Fast)');
    fireEvent.change(methodSelect, { target: { value: 'genetic' } });
    
    expect(methodSelect.value).toBe('genetic');
  });

  test('updates AI query', () => {
    render(<MultiMeetingDashboard />);
    
    // Navigate to optimization step
    fireEvent.click(screen.getByText('Next: Set Availability'));
    fireEvent.click(screen.getByText('Next: Optimize'));
    
    const queryTextarea = screen.getByPlaceholderText(/e.g., 'Prioritize high-importance meetings'/);
    fireEvent.change(queryTextarea, { target: { value: 'Test query' } });
    
    expect(queryTextarea.value).toBe('Test query');
  });

  test('calls scheduleMultipleMeetings API on optimize', async () => {
    const mockResult = {
      success: true,
      optimization: {
        totalMeetings: 1,
        scheduledCount: 1,
        successRate: 100,
        totalPriorityScore: 13.5,
      },
      scheduledMeetings: [
        {
          id: 'meeting-1',
          title: 'Product Planning',
          participants: ['Alice', 'Bob', 'Charlie'],
          duration: 60,
          importance: 4,
          urgency: 'high',
          priority: 13.5,
          start: '14:00 UTC',
          end: '15:00 UTC',
          scheduled: true,
        },
      ],
      unscheduledMeetings: [],
      conflicts: [],
      explanation: 'Successfully scheduled 1 out of 1 meetings (100% success rate).',
    };

    scheduleMultipleMeetings.mockResolvedValue(mockResult);

    render(<MultiMeetingDashboard />);
    
    // Navigate to optimization step
    fireEvent.click(screen.getByText('Next: Set Availability'));
    fireEvent.click(screen.getByText('Next: Optimize'));
    
    const optimizeButton = screen.getByText('Optimize Schedule');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(scheduleMultipleMeetings).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Object),
        '',
        'greedy',
        {}
      );
    });
  });

  test('calls analyzeConflicts API on conflict analysis', async () => {
    const mockConflictResult = {
      totalMeetings: 1,
      meetingsWithSlots: 1,
      totalPossibleSlots: 5,
      potentialConflicts: [],
      recommendations: ['No conflicts detected'],
    };

    analyzeConflicts.mockResolvedValue(mockConflictResult);
    window.alert = jest.fn(); // Mock alert

    render(<MultiMeetingDashboard />);
    
    // Navigate to optimization step
    fireEvent.click(screen.getByText('Next: Set Availability'));
    fireEvent.click(screen.getByText('Next: Optimize'));
    
    const analyzeButton = screen.getByText('Analyze Conflicts');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(analyzeConflicts).toHaveBeenCalled();
    });
  });

  test('calls getOptimizationSuggestions API on suggestions', async () => {
    const mockSuggestionsResult = {
      meetingOptimizations: [],
      scheduleOptimizations: [
        {
          type: 'participant_overload',
          message: 'Some participants are in multiple meetings',
          impact: 'high',
        },
      ],
      resourceOptimizations: [],
    };

    getOptimizationSuggestions.mockResolvedValue(mockSuggestionsResult);
    window.alert = jest.fn(); // Mock alert

    render(<MultiMeetingDashboard />);
    
    // Navigate to optimization step
    fireEvent.click(screen.getByText('Next: Set Availability'));
    fireEvent.click(screen.getByText('Next: Optimize'));
    
    const suggestionsButton = screen.getByText('Get Suggestions');
    fireEvent.click(suggestionsButton);
    
    await waitFor(() => {
      expect(getOptimizationSuggestions).toHaveBeenCalled();
    });
  });

  test('displays results after successful optimization', async () => {
    const mockResult = {
      success: true,
      optimization: {
        totalMeetings: 1,
        scheduledCount: 1,
        successRate: 100,
        totalPriorityScore: 13.5,
      },
      scheduledMeetings: [
        {
          id: 'meeting-1',
          title: 'Product Planning',
          participants: ['Alice', 'Bob', 'Charlie'],
          duration: 60,
          importance: 4,
          urgency: 'high',
          priority: 13.5,
          start: '14:00 UTC',
          end: '15:00 UTC',
          scheduled: true,
        },
      ],
      unscheduledMeetings: [],
      conflicts: [],
      explanation: 'Successfully scheduled 1 out of 1 meetings (100% success rate).',
    };

    scheduleMultipleMeetings.mockResolvedValue(mockResult);

    render(<MultiMeetingDashboard />);
    
    // Navigate to optimization step and optimize
    fireEvent.click(screen.getByText('Next: Set Availability'));
    fireEvent.click(screen.getByText('Next: Optimize'));
    fireEvent.click(screen.getByText('Optimize Schedule'));
    
    await waitFor(() => {
      expect(screen.getByText('Optimization Results')).toBeInTheDocument();
      expect(screen.getByText('Product Planning')).toBeInTheDocument();
    });
  });

  test('displays error message on API failure', async () => {
    scheduleMultipleMeetings.mockRejectedValue(new Error('API Error'));

    render(<MultiMeetingDashboard />);
    
    // Navigate to optimization step and optimize
    fireEvent.click(screen.getByText('Next: Set Availability'));
    fireEvent.click(screen.getByText('Next: Optimize'));
    fireEvent.click(screen.getByText('Optimize Schedule'));
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to schedule multiple meetings/)).toBeInTheDocument();
    });
  });

  test('validates meetings before optimization', async () => {
    render(<MultiMeetingDashboard />);
    
    // Remove all meetings
    const deleteButtons = screen.getAllByText('🗑️');
    deleteButtons.forEach(button => fireEvent.click(button));
    
    // Navigate to optimization step
    fireEvent.click(screen.getByText('Next: Set Availability'));
    fireEvent.click(screen.getByText('Next: Optimize'));
    
    const optimizeButton = screen.getByText('Optimize Schedule');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please add at least one valid meeting/)).toBeInTheDocument();
    });
  });

  test('navigates back between steps', () => {
    render(<MultiMeetingDashboard />);
    
    // Go to availability step
    fireEvent.click(screen.getByText('Next: Set Availability'));
    expect(screen.getByText('Team Availability')).toBeInTheDocument();
    
    // Go back to meetings step
    fireEvent.click(screen.getByText('Back: Meetings'));
    expect(screen.getByText('Meeting Configuration')).toBeInTheDocument();
  });

  test('displays summary information', () => {
    render(<MultiMeetingDashboard />);
    
    // Navigate to optimization step
    fireEvent.click(screen.getByText('Next: Set Availability'));
    fireEvent.click(screen.getByText('Next: Optimize'));
    
    expect(screen.getByText('Meetings: 1')).toBeInTheDocument();
    expect(screen.getByText('Participants: 3')).toBeInTheDocument();
    expect(screen.getByText('Method: greedy')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiMeetingResults from '../components/MultiMeetingResults';

describe('MultiMeetingResults Component', () => {
  const mockResults = {
    optimization: {
      totalMeetings: 3,
      scheduledCount: 2,
      successRate: 67,
      totalPriorityScore: 25.5,
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
      {
        id: 'meeting-2',
        title: 'Design Review',
        participants: ['Alice', 'David'],
        duration: 45,
        importance: 3,
        urgency: 'medium',
        priority: 9.0,
        start: '10:00 UTC',
        end: '10:45 UTC',
        scheduled: true,
      },
    ],
    unscheduledMeetings: [
      {
        id: 'meeting-3',
        title: 'Team Standup',
        participants: ['Bob', 'Charlie', 'Eve'],
        duration: 30,
        importance: 2,
        urgency: 'low',
        priority: 3.0,
      },
    ],
    conflicts: [
      {
        type: 'participant_conflict',
        meetings: ['meeting-1', 'meeting-2'],
        participants: ['Alice'],
        timeOverlap: {
          start: '14:00',
          end: '15:00',
          duration: 60,
        },
        severity: 'high',
      },
    ],
    aiSuggestions: [
      'Consider rescheduling the Design Review to avoid conflicts',
      'Team Standup could be moved to a different time slot',
    ],
    explanation: 'Successfully scheduled 2 out of 3 meetings (67% success rate). 1 high-priority meetings were prioritized.',
  };

  const defaultProps = {
    results: mockResults,
    onReschedule: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders optimization summary', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    expect(screen.getByText('Multi-Meeting Optimization Results')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Total meetings
    expect(screen.getByText('2')).toBeInTheDocument(); // Scheduled
    expect(screen.getByText('67%')).toBeInTheDocument(); // Success rate
    expect(screen.getByText('25.5')).toBeInTheDocument(); // Priority score
  });

  test('renders explanation text', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    expect(screen.getByText(mockResults.explanation)).toBeInTheDocument();
  });

  test('renders tab navigation', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    expect(screen.getByText('Scheduled (2)')).toBeInTheDocument();
    expect(screen.getByText('Unscheduled (1)')).toBeInTheDocument();
    expect(screen.getByText('Conflicts (1)')).toBeInTheDocument();
    expect(screen.getByText('AI Suggestions')).toBeInTheDocument();
  });

  test('displays scheduled meetings by default', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    expect(screen.getByText('Product Planning')).toBeInTheDocument();
    expect(screen.getByText('Design Review')).toBeInTheDocument();
    expect(screen.getByText('14:00 - 15:00')).toBeInTheDocument();
    expect(screen.getByText('10:00 - 10:45')).toBeInTheDocument();
  });

  test('switches to unscheduled meetings tab', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    const unscheduledTab = screen.getByText('Unscheduled (1)');
    fireEvent.click(unscheduledTab);
    
    expect(screen.getByText('Team Standup')).toBeInTheDocument();
    expect(screen.getByText('Could not be scheduled')).toBeInTheDocument();
  });

  test('switches to conflicts tab', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    const conflictsTab = screen.getByText('Conflicts (1)');
    fireEvent.click(conflictsTab);
    
    expect(screen.getByText('Participant Conflict')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('Affected Meetings: meeting-1, meeting-2')).toBeInTheDocument();
  });

  test('switches to AI suggestions tab', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    const suggestionsTab = screen.getByText('AI Suggestions');
    fireEvent.click(suggestionsTab);
    
    expect(screen.getByText('AI Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Consider rescheduling the Design Review to avoid conflicts')).toBeInTheDocument();
  });

  test('displays meeting details correctly', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    // Check for meeting details
    expect(screen.getByText('Product Planning')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('Priority: 13.5')).toBeInTheDocument();
    expect(screen.getByText('60m')).toBeInTheDocument(); // Duration
    
    // Check for participants
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('displays urgency color coding', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    const highUrgencyBadge = screen.getByText('HIGH');
    expect(highUrgencyBadge).toHaveClass('text-red-600', 'bg-red-50', 'border-red-200');
  });

  test('handles empty results gracefully', () => {
    const emptyResults = {
      optimization: {
        totalMeetings: 0,
        scheduledCount: 0,
        successRate: 0,
        totalPriorityScore: 0,
      },
      scheduledMeetings: [],
      unscheduledMeetings: [],
      conflicts: [],
      explanation: 'No meetings to schedule.',
    };
    
    render(<MultiMeetingResults {...defaultProps} results={emptyResults} />);
    
    expect(screen.getByText('No meetings were successfully scheduled.')).toBeInTheDocument();
  });

  test('displays success message when all meetings scheduled', () => {
    const allScheduledResults = {
      ...mockResults,
      scheduledMeetings: mockResults.scheduledMeetings.concat(mockResults.unscheduledMeetings),
      unscheduledMeetings: [],
      optimization: {
        ...mockResults.optimization,
        scheduledCount: 3,
        successRate: 100,
      },
    };
    
    render(<MultiMeetingResults {...defaultProps} results={allScheduledResults} />);
    
    const unscheduledTab = screen.getByText('Unscheduled (0)');
    fireEvent.click(unscheduledTab);
    
    expect(screen.getByText('🎉 All meetings were successfully scheduled!')).toBeInTheDocument();
  });

  test('displays no conflicts message', () => {
    const noConflictsResults = {
      ...mockResults,
      conflicts: [],
    };
    
    render(<MultiMeetingResults {...defaultProps} results={noConflictsResults} />);
    
    const conflictsTab = screen.getByText('Conflicts (0)');
    fireEvent.click(conflictsTab);
    
    expect(screen.getByText('✅ No conflicts detected!')).toBeInTheDocument();
  });

  test('calls onReschedule when reschedule button is clicked', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    const rescheduleButton = screen.getByText('Reschedule');
    fireEvent.click(rescheduleButton);
    
    expect(defaultProps.onReschedule).toHaveBeenCalled();
  });

  test('handles results without AI suggestions', () => {
    const resultsWithoutAI = {
      ...mockResults,
      aiSuggestions: null,
    };
    
    render(<MultiMeetingResults {...defaultProps} results={resultsWithoutAI} />);
    
    // AI Suggestions tab should not be visible
    expect(screen.queryByText('AI Suggestions')).not.toBeInTheDocument();
  });

  test('formats time correctly', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    expect(screen.getByText('14:00 - 15:00')).toBeInTheDocument();
    expect(screen.getByText('10:00 - 10:45')).toBeInTheDocument();
  });

  test('formats duration correctly', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    expect(screen.getByText('60m')).toBeInTheDocument();
    expect(screen.getByText('45m')).toBeInTheDocument();
  });

  test('displays conflict severity color coding', () => {
    render(<MultiMeetingResults {...defaultProps} />);
    
    const conflictsTab = screen.getByText('Conflicts (1)');
    fireEvent.click(conflictsTab);
    
    const severityBadge = screen.getByText('HIGH');
    expect(severityBadge).toHaveClass('text-red-600', 'bg-red-50', 'border-red-200');
  });
});

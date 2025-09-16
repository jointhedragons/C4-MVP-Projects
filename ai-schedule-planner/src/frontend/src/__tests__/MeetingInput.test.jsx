import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MeetingInput from '../components/MeetingInput';

describe('MeetingInput Component', () => {
  const mockMeeting = {
    id: 'meeting-1',
    title: 'Test Meeting',
    participants: ['Alice', 'Bob'],
    duration: 60,
    importance: 3,
    urgency: 'medium',
    deadline: '2024-12-20',
  };

  const mockAvailableParticipants = ['Alice', 'Bob', 'Charlie', 'David'];

  const defaultProps = {
    meeting: mockMeeting,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    availableParticipants: mockAvailableParticipants,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders meeting title and priority indicators', () => {
    render(<MeetingInput {...defaultProps} />);
    
    expect(screen.getByText('Test Meeting')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('⭐ 3/5')).toBeInTheDocument();
  });

  test('expands and collapses meeting details', () => {
    render(<MeetingInput {...defaultProps} />);
    
    // Initially collapsed
    expect(screen.queryByLabelText('Meeting Title')).not.toBeInTheDocument();
    
    // Click to expand
    const expandButton = screen.getByText('▶');
    fireEvent.click(expandButton);
    
    // Should now show form fields
    expect(screen.getByLabelText('Meeting Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Duration (minutes)')).toBeInTheDocument();
    expect(screen.getByLabelText('Importance (1-5)')).toBeInTheDocument();
    expect(screen.getByLabelText('Urgency')).toBeInTheDocument();
  });

  test('calls onChange when meeting title is updated', () => {
    render(<MeetingInput {...defaultProps} />);
    
    // Expand the meeting
    fireEvent.click(screen.getByText('▶'));
    
    const titleInput = screen.getByLabelText('Meeting Title');
    fireEvent.change(titleInput, { target: { value: 'Updated Meeting' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      ...mockMeeting,
      title: 'Updated Meeting',
    });
  });

  test('calls onChange when duration is updated', () => {
    render(<MeetingInput {...defaultProps} />);
    
    // Expand the meeting
    fireEvent.click(screen.getByText('▶'));
    
    const durationInput = screen.getByLabelText('Duration (minutes)');
    fireEvent.change(durationInput, { target: { value: '90' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      ...mockMeeting,
      duration: 90,
    });
  });

  test('calls onChange when importance is updated', () => {
    render(<MeetingInput {...defaultProps} />);
    
    // Expand the meeting
    fireEvent.click(screen.getByText('▶'));
    
    const importanceSelect = screen.getByLabelText('Importance (1-5)');
    fireEvent.change(importanceSelect, { target: { value: '5' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      ...mockMeeting,
      importance: 5,
    });
  });

  test('calls onChange when urgency is updated', () => {
    render(<MeetingInput {...defaultProps} />);
    
    // Expand the meeting
    fireEvent.click(screen.getByText('▶'));
    
    const urgencySelect = screen.getByLabelText('Urgency');
    fireEvent.change(urgencySelect, { target: { value: 'high' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      ...mockMeeting,
      urgency: 'high',
    });
  });

  test('calls onChange when deadline is updated', () => {
    render(<MeetingInput {...defaultProps} />);
    
    // Expand the meeting
    fireEvent.click(screen.getByText('▶'));
    
    const deadlineInput = screen.getByLabelText('Deadline (optional)');
    fireEvent.change(deadlineInput, { target: { value: '2024-12-25' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      ...mockMeeting,
      deadline: '2024-12-25',
    });
  });

  test('calls onChange when participant is updated', () => {
    render(<MeetingInput {...defaultProps} />);
    
    // Expand the meeting
    fireEvent.click(screen.getByText('▶'));
    
    const participantSelects = screen.getAllByRole('combobox');
    const firstParticipantSelect = participantSelects[0];
    
    fireEvent.change(firstParticipantSelect, { target: { value: 'Charlie' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      ...mockMeeting,
      participants: ['Charlie', 'Bob'],
    });
  });

  test('adds new participant when add button is clicked', () => {
    render(<MeetingInput {...defaultProps} />);
    
    // Expand the meeting
    fireEvent.click(screen.getByText('▶'));
    
    const addButton = screen.getByText('+ Add Participant');
    fireEvent.click(addButton);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      ...mockMeeting,
      participants: ['Alice', 'Bob', ''],
    });
  });

  test('removes participant when remove button is clicked', () => {
    render(<MeetingInput {...defaultProps} />);
    
    // Expand the meeting
    fireEvent.click(screen.getByText('▶'));
    
    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      ...mockMeeting,
      participants: ['Bob'],
    });
  });

  test('calls onDelete when delete button is clicked', () => {
    render(<MeetingInput {...defaultProps} />);
    
    const deleteButton = screen.getByText('🗑️');
    fireEvent.click(deleteButton);
    
    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  test('displays correct urgency color coding', () => {
    const highUrgencyMeeting = { ...mockMeeting, urgency: 'high' };
    render(<MeetingInput {...defaultProps} meeting={highUrgencyMeeting} />);
    
    const urgencyBadge = screen.getByText('HIGH');
    expect(urgencyBadge).toHaveClass('text-red-600', 'bg-red-50', 'border-red-200');
  });

  test('displays correct importance color coding', () => {
    const highImportanceMeeting = { ...mockMeeting, importance: 5 };
    render(<MeetingInput {...defaultProps} meeting={highImportanceMeeting} />);
    
    const importanceBadge = screen.getByText('⭐ 5/5');
    expect(importanceBadge).toHaveClass('text-red-600');
  });

  test('handles meeting without optional fields', () => {
    const minimalMeeting = {
      id: 'meeting-1',
      title: 'Minimal Meeting',
      participants: ['Alice'],
    };
    
    render(<MeetingInput {...defaultProps} meeting={minimalMeeting} />);
    
    expect(screen.getByText('Minimal Meeting')).toBeInTheDocument();
    expect(screen.getByText('⭐ 1/5')).toBeInTheDocument(); // Default importance
  });

  test('prevents removing last participant', () => {
    const singleParticipantMeeting = {
      ...mockMeeting,
      participants: ['Alice'],
    };
    
    render(<MeetingInput {...defaultProps} meeting={singleParticipantMeeting} />);
    
    // Expand the meeting
    fireEvent.click(screen.getByText('▶'));
    
    // Should not show remove button for single participant
    expect(screen.queryByText('✕')).not.toBeInTheDocument();
  });
});

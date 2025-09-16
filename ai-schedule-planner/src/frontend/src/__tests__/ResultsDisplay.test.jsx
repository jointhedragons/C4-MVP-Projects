import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultsDisplay from '../components/ResultsDisplay';

describe('ResultsDisplay Component', () => {
  test('renders results with slots', () => {
    const results = {
      slots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        },
        {
          start: '14:00 UTC',
          end: '15:00 UTC',
          members: ['Alice', 'Charlie'],
          type: 'partial'
        }
      ],
      explanation: 'Found optimal meeting times.',
      aiRefined: true
    };

    render(<ResultsDisplay results={results} />);

    expect(screen.getByText('Meeting Time Results')).toBeInTheDocument();
    expect(screen.getByText('Found optimal meeting times.')).toBeInTheDocument();
    expect(screen.getByText('✨ AI Enhanced')).toBeInTheDocument();
  });

  test('displays AI enhanced indicator when AI was used', () => {
    const results = {
      slots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        }
      ],
      explanation: 'Found optimal meeting times.',
      aiRefined: true
    };

    render(<ResultsDisplay results={results} />);

    expect(screen.getByText('✨ AI Enhanced')).toBeInTheDocument();
  });

  test('does not display AI enhanced indicator when AI was not used', () => {
    const results = {
      slots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        }
      ],
      explanation: 'Found optimal meeting times.',
      aiRefined: false
    };

    render(<ResultsDisplay results={results} />);

    expect(screen.queryByText('✨ AI Enhanced')).not.toBeInTheDocument();
  });

  test('displays slots in table format', () => {
    const results = {
      slots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        }
      ],
      explanation: 'Found optimal meeting times.',
      aiRefined: false
    };

    render(<ResultsDisplay results={results} />);

    // Check table headers
    expect(screen.getByText('Start Time')).toBeInTheDocument();
    expect(screen.getByText('End Time')).toBeInTheDocument();
    expect(screen.getByText('Available Members')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();

    // Check slot data
    expect(screen.getByText('12:00 UTC')).toBeInTheDocument();
    expect(screen.getByText('13:00 UTC')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Perfect')).toBeInTheDocument();
  });

  test('displays member badges for each slot', () => {
    const results = {
      slots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob', 'Charlie'],
          type: 'perfect'
        }
      ],
      explanation: 'Found optimal meeting times.',
      aiRefined: false
    };

    render(<ResultsDisplay results={results} />);

    // Check that members are displayed as badges
    const aliceBadge = screen.getByText('Alice');
    const bobBadge = screen.getByText('Bob');
    const charlieBadge = screen.getByText('Charlie');

    expect(aliceBadge).toHaveClass('bg-blue-100', 'text-blue-800');
    expect(bobBadge).toHaveClass('bg-blue-100', 'text-blue-800');
    expect(charlieBadge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  test('displays slot type badges correctly', () => {
    const results = {
      slots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        },
        {
          start: '14:00 UTC',
          end: '15:00 UTC',
          members: ['Alice', 'Charlie'],
          type: 'partial'
        }
      ],
      explanation: 'Found optimal meeting times.',
      aiRefined: false
    };

    render(<ResultsDisplay results={results} />);

    const perfectBadge = screen.getByText('Perfect');
    const partialBadge = screen.getByText('Partial');

    expect(perfectBadge).toHaveClass('bg-green-100', 'text-green-800');
    expect(partialBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  test('displays no slots message when no slots available', () => {
    const results = {
      slots: [],
      explanation: 'No overlapping time slots found.',
      aiRefined: false
    };

    render(<ResultsDisplay results={results} />);

    expect(screen.getByText('No Available Slots')).toBeInTheDocument();
    expect(screen.getByText(/No overlapping time slots found/)).toBeInTheDocument();
    expect(screen.getByText(/Try adjusting the time ranges/)).toBeInTheDocument();
  });

  test('displays rule-based comparison when AI was used', () => {
    const results = {
      slots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        }
      ],
      explanation: 'Found optimal meeting times.',
      ruleBasedSlots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        },
        {
          start: '14:00 UTC',
          end: '15:00 UTC',
          members: ['Alice', 'Charlie'],
          type: 'partial'
        }
      ],
      aiRefined: true
    };

    render(<ResultsDisplay results={results} />);

    expect(screen.getByText('Rule-based Results (for comparison):')).toBeInTheDocument();
    expect(screen.getByText('Found 2 slot(s) using rule-based algorithm')).toBeInTheDocument();
  });

  test('does not display rule-based comparison when AI was not used', () => {
    const results = {
      slots: [
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        }
      ],
      explanation: 'Found optimal meeting times.',
      aiRefined: false
    };

    render(<ResultsDisplay results={results} />);

    expect(screen.queryByText('Rule-based Results (for comparison):')).not.toBeInTheDocument();
  });

  test('handles multiple slots correctly', () => {
    const results = {
      slots: [
        {
          start: '09:00 UTC',
          end: '10:00 UTC',
          members: ['Alice'],
          type: 'partial'
        },
        {
          start: '12:00 UTC',
          end: '13:00 UTC',
          members: ['Alice', 'Bob'],
          type: 'perfect'
        },
        {
          start: '15:00 UTC',
          end: '16:00 UTC',
          members: ['Bob', 'Charlie'],
          type: 'partial'
        }
      ],
      explanation: 'Found multiple meeting options.',
      aiRefined: false
    };

    render(<ResultsDisplay results={results} />);

    expect(screen.getByText('Available Time Slots (3)')).toBeInTheDocument();
    expect(screen.getAllByText('Partial')).toHaveLength(2);
    expect(screen.getAllByText('Perfect')).toHaveLength(1);
  });
});

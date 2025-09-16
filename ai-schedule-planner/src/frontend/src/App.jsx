import React, { useState } from 'react';
import { findMeetingTimes, validateAvailability, getExampleAvailability } from './api';
import AvailabilityInput from './components/AvailabilityInput';
import QueryInput from './components/QueryInput';
import ResultsDisplay from './components/ResultsDisplay';
import MultiMeetingDashboard from './components/MultiMeetingDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [mode, setMode] = useState('single'); // 'single' or 'multi'
  const [availability, setAvailability] = useState(getExampleAvailability());
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFindMeetingTimes = async () => {
    setError(null);
    setResults(null);

    // Validate availability data
    const validation = validateAvailability(availability);
    if (!validation.valid) {
      setError(`Validation Error: ${validation.errors.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const data = await findMeetingTimes(availability, query);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityChange = (newAvailability) => {
    setAvailability(newAvailability);
    setError(null);
    setResults(null);
  };

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
    setError(null);
    setResults(null);
  };

  const handleLoadExample = () => {
    setAvailability(getExampleAvailability());
    setQuery('');
    setError(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Schedule Planner v2.0
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Intelligent scheduling with single-team and multi-meeting optimization
          </p>
          
          {/* Mode Selector */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setMode('single')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  mode === 'single'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Single Team
              </button>
              <button
                onClick={() => setMode('multi')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  mode === 'multi'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Multi-Meeting
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {mode === 'single' ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              {/* Availability Input */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Team Availability
                </h2>
                <AvailabilityInput
                  value={availability}
                  onChange={handleAvailabilityChange}
                  onLoadExample={handleLoadExample}
                />
              </div>

              {/* Query Input */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Optional Query
                </h2>
                <QueryInput
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="e.g., 'morning meeting', 'urgent', 'flexible time'"
                />
              </div>

              {/* Find Meeting Time Button */}
              <div className="text-center">
                <button
                  onClick={handleFindMeetingTimes}
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Finding Meeting Times...</span>
                    </>
                  ) : (
                    'Find Meeting Time'
                  )}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6">
                <ErrorMessage message={error} />
              </div>
            )}

            {/* Results Display */}
            {results && (
              <div className="mb-6">
                <ResultsDisplay results={results} />
              </div>
            )}
          </div>
        ) : (
          <MultiMeetingDashboard />
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>
            Built with React, TailwindCSS, and Google Gemini AI
          </p>
         
        </div>
      </div>
    </div>
  );
}

export default App;

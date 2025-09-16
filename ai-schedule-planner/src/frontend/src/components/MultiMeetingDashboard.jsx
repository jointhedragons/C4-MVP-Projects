import React, { useState } from 'react';
import { 
  scheduleMultipleMeetings, 
  analyzeConflicts, 
  getOptimizationSuggestions,
  getExampleMeetings,
  getExampleAvailability 
} from '../api';
import MeetingInput from './MeetingInput';
import AvailabilityInput from './AvailabilityInput';
import MultiMeetingResults from './MultiMeetingResults';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

function MultiMeetingDashboard() {
  const [meetings, setMeetings] = useState(() => {
    try {
      return getExampleMeetings() || [];
    } catch (error) {
      return [];
    }
  });
  
  const [availability, setAvailability] = useState(() => {
    try {
      return getExampleAvailability() || {};
    } catch (error) {
      return {};
    }
  });
  
  const [query, setQuery] = useState('');
  const [optimizationMethod, setOptimizationMethod] = useState('greedy');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState('meetings');

  // New state variables
  const [conflictResults, setConflictResults] = useState(null);
  const [suggestionResults, setSuggestionResults] = useState(null);

  const availableParticipants = availability && typeof availability === 'object' 
    ? Object.keys(availability) 
    : [];

  const addMeeting = () => {
    const newMeeting = {
      id: `meeting-${Date.now()}`,
      title: '',
      participants: [''],
      duration: 60,
      importance: 3,
      urgency: 'medium',
    };
    setMeetings((prevMeetings) => [...(prevMeetings || []), newMeeting]);
  };

  const updateMeeting = (index, updatedMeeting) => {
    if (!updatedMeeting || index < 0) return;
    setMeetings((prevMeetings) => {
      const currentMeetings = prevMeetings || [];
      if (index >= currentMeetings.length) return currentMeetings;
      const newMeetings = [...currentMeetings];
      newMeetings[index] = { ...updatedMeeting, id: updatedMeeting.id || `meeting-${Date.now()}` };
      return newMeetings;
    });
  };

  const deleteMeeting = (index) => {
    if (index < 0) return;
    setMeetings((prevMeetings) => {
      const currentMeetings = prevMeetings || [];
      return currentMeetings.filter((_, i) => i !== index);
    });
  };

  const handleOptimize = async () => {
    setError(null);
    setResults(null);

    // Validate meetings
    const validMeetings = (meetings || []).filter(m => 
      m && m.title && 
      Array.isArray(m.participants) &&
      m.participants.length > 0 && 
      m.participants.every(p => p && p.trim() !== '')
    );

    if (validMeetings.length === 0) {
      setError('Please add at least one valid meeting with a title and participants.');
      return;
    }

    setLoading(true);

    try {
      const data = await scheduleMultipleMeetings(
        validMeetings,
        availability,
        query,
        optimizationMethod
      );
      setResults(data);
      setActiveStep('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeConflicts = async () => {
    setError(null);
    setLoading(true);
    setConflictResults(null);

    try {
      const validMeetings = (meetings || []).filter(m => 
        m && m.title && 
        Array.isArray(m.participants) &&
        m.participants.length > 0 && 
        m.participants.every(p => p && p.trim() !== '')
      );

      const conflictData = await analyzeConflicts(validMeetings, availability);
      setConflictResults(conflictData);
      setActiveStep('conflicts');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestions = async () => {
    setError(null);
    setLoading(true);
    setSuggestionResults(null);

    try {
      const validMeetings = (meetings || []).filter(m => 
        m && m.title && 
        Array.isArray(m.participants) &&
        m.participants.length > 0 && 
        m.participants.every(p => p && p.trim() !== '')
      );

      const suggestions = await getOptimizationSuggestions(validMeetings, availability);
      setSuggestionResults(suggestions);
      setActiveStep('suggestions');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetToMeetings = () => {
    setActiveStep('meetings');
    setResults(null);
    setError(null);
    setConflictResults(null);
    setSuggestionResults(null);
  };

  // Step navigation order
  const steps = [
    { key: 'meetings', label: '1. Meetings' },
    { key: 'availability', label: '2. Availability' },
    { key: 'optimize', label: '3. Optimize' },
    { key: 'conflicts', label: '4. Conflicts', show: !!conflictResults },
    { key: 'suggestions', label: '5. Suggestions', show: !!suggestionResults },
    { key: 'results', label: '6. Results', show: !!results },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Multi-Meeting Optimization Dashboard
        </h1>
        <p className="text-gray-600">
          Schedule multiple meetings simultaneously with intelligent conflict resolution and priority-based optimization.
        </p>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.filter(s => s.show === undefined || s.show).map((step, idx, arr) => (
            <React.Fragment key={step.key}>
              <button
                onClick={() => setActiveStep(step.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeStep === step.key
                    ? (step.key === 'results'
                        ? 'bg-green-600 text-white'
                        : step.key === 'conflicts'
                        ? 'bg-yellow-600 text-white'
                        : step.key === 'suggestions'
                        ? 'bg-purple-600 text-white'
                        : 'bg-blue-600 text-white')
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {step.label}
              </button>
              {idx < arr.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && <ErrorMessage message={error} />}

      {/* Step Content */}
      {activeStep === 'meetings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Meeting Configuration</h2>
            <button
              onClick={addMeeting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Meeting
            </button>
          </div>

          <div className="space-y-4">
            {(meetings || []).map((meeting, index) => (
              <MeetingInput
                key={meeting?.id || `meeting-${index}`}
                meeting={meeting || {}}
                onChange={(updatedMeeting) => updateMeeting(index, updatedMeeting)}
                onDelete={() => deleteMeeting(index)}
                availableParticipants={availableParticipants}
              />
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveStep('availability')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next: Set Availability
            </button>
          </div>
        </div>
      )}

      {activeStep === 'availability' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Team Availability</h2>
            <button
              onClick={() => setAvailability(getExampleAvailability())}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Load Example
            </button>
          </div>

          <AvailabilityInput
            availability={availability}
            onChange={setAvailability}
          />

          <div className="flex justify-between">
            <button
              onClick={() => setActiveStep('meetings')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back: Meetings
            </button>
            <button
              onClick={() => setActiveStep('optimize')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next: Optimize
            </button>
          </div>
        </div>
      )}

      {activeStep === 'optimize' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Optimization Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optimization Method
                </label>
                <select
                  value={optimizationMethod}
                  onChange={(e) => setOptimizationMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="greedy">Greedy Algorithm (Fast)</option>
                  <option value="genetic">Genetic Algorithm (Advanced)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Query (Optional)
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="e.g., 'Prioritize high-importance meetings and avoid conflicts'"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleAnalyzeConflicts}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                  >
                    Analyze Conflicts
                  </button>
                  <button
                    onClick={handleGetSuggestions}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    Get Suggestions
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Summary</h3>
                <div className="text-sm text-blue-700">
                  <div>Meetings: {(meetings || []).length}</div>
                  <div>Participants: {availableParticipants.length}</div>
                  <div>Method: {optimizationMethod || 'greedy'}</div>
                </div>
              </div>
            </div>
          </div>

          {loading && <LoadingSpinner />}

          <div className="flex justify-between">
            <button
              onClick={() => setActiveStep('availability')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back: Availability
            </button>
            <button
              onClick={handleOptimize}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Optimizing...' : 'Optimize Schedule'}
            </button>
          </div>
        </div>
      )}

      {activeStep === 'conflicts' && conflictResults && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-yellow-700">Conflict Analysis</h2>
            <button
              onClick={() => setActiveStep('optimize')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Back to Optimize
            </button>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow">
            <div className="mb-4">
              <span className="font-semibold">Total Meetings:</span> {conflictResults.totalMeetings}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Meetings with Slots:</span> {conflictResults.meetingsWithSlots}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Potential Conflicts:</span> {conflictResults.potentialConflicts.length}
              <ul className="list-disc ml-6 mt-2 text-sm text-yellow-800">
                {conflictResults.potentialConflicts.map((conflict, idx) => (
                  <li key={idx}>{conflict}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold">Recommendations:</span>
              <ul className="list-disc ml-6 mt-2 text-sm text-yellow-800">
                {conflictResults.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeStep === 'suggestions' && suggestionResults && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-purple-700">AI Suggestions</h2>
            <button
              onClick={() => setActiveStep('optimize')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Optimize
            </button>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow">
            <div className="mb-4">
              <h3 className="font-semibold text-purple-800 mb-2">Meeting Optimizations</h3>
              <ul className="list-disc ml-6 text-sm text-purple-900">
                {suggestionResults.meetingOptimizations.map((m, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{m.meetingTitle}:</span>{" "}
                    {m.suggestions.map((s, i) => (
                      <span key={i}>
                        {s.message}
                        {i < m.suggestions.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-purple-800 mb-2">Schedule Optimizations</h3>
              <ul className="list-disc ml-6 text-sm text-purple-900">
                {suggestionResults.scheduleOptimizations.map((s, idx) => (
                  <li key={idx}>{s.message}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Resource Optimizations</h3>
              <ul className="list-disc ml-6 text-sm text-purple-900">
                {suggestionResults.resourceOptimizations.map((s, idx) => (
                  <li key={idx}>{s.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeStep === 'results' && results && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Optimization Results</h2>
            <button
              onClick={resetToMeetings}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Schedule New Meetings
            </button>
          </div>

          <MultiMeetingResults 
            results={results} 
            onReschedule={resetToMeetings}
          />
        </div>
      )}
    </div>
  );
}

export default MultiMeetingDashboard;

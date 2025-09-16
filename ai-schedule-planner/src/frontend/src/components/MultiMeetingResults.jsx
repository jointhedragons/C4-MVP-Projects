import React, { useState } from 'react';

function MultiMeetingResults({ results, onReschedule }) {
  const [activeTab, setActiveTab] = useState('scheduled');

  if (!results) return null;

  const { 
    optimization, 
    scheduledMeetings, 
    unscheduledMeetings, 
    conflicts, 
    aiSuggestions,
    explanation 
  } = results;

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConflictSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (timeStr) => {
    return timeStr.replace(' UTC', '');
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with Optimization Summary */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Multi-Meeting Optimization Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Meetings</div>
            <div className="text-2xl font-bold text-blue-800">{optimization.totalMeetings}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Scheduled</div>
            <div className="text-2xl font-bold text-green-800">{optimization.scheduledCount}</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-sm text-yellow-600 font-medium">Success Rate</div>
            <div className="text-2xl font-bold text-yellow-800">{optimization.successRate}%</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Priority Score</div>
            <div className="text-2xl font-bold text-purple-800">{optimization.totalPriorityScore?.toFixed(1) || 'N/A'}</div>
          </div>
        </div>
        
        {explanation && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{explanation}</p>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'scheduled'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Scheduled ({scheduledMeetings.length})
        </button>
        <button
          onClick={() => setActiveTab('unscheduled')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'unscheduled'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Unscheduled ({unscheduledMeetings.length})
        </button>
        <button
          onClick={() => setActiveTab('conflicts')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'conflicts'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Conflicts ({conflicts.length})
        </button>
        {aiSuggestions && (
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'suggestions'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            AI Suggestions
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'scheduled' && (
          <div className="space-y-4">
            {scheduledMeetings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No meetings were successfully scheduled.
              </div>
            ) : (
              scheduledMeetings.map((meeting) => (
                <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {meeting.title}
                      </h3>
                      {meeting.urgency && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(meeting.urgency)}`}>
                          {meeting.urgency.toUpperCase()}
                        </span>
                      )}
                      {meeting.priority && (
                        <span className="text-sm font-medium text-purple-600">
                          Priority: {meeting.priority.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">
                        {formatTime(meeting.start)} - {formatTime(meeting.end)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDuration(meeting.duration)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Participants</div>
                      <div className="flex flex-wrap gap-1">
                        {meeting.participants.map((participant) => (
                          <span
                            key={participant}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {participant}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Details</div>
                      <div className="text-sm text-gray-600">
                        <div>Importance: {meeting.importance}/5</div>
                        {meeting.deadline && <div>Deadline: {meeting.deadline}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'unscheduled' && (
          <div className="space-y-4">
            {unscheduledMeetings.length === 0 ? (
              <div className="text-center py-8 text-green-600">
                🎉 All meetings were successfully scheduled!
              </div>
            ) : (
              unscheduledMeetings.map((meeting) => (
                <div key={meeting.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {meeting.title}
                      </h3>
                      {meeting.urgency && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(meeting.urgency)}`}>
                          {meeting.urgency.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="text-red-600 font-medium">
                      Could not be scheduled
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <div>Participants: {meeting.participants.join(', ')}</div>
                    <div>Duration: {formatDuration(meeting.duration)}</div>
                    <div>Priority: {meeting.priority?.toFixed(1) || 'N/A'}</div>
                  </div>
                  
                  <div className="text-sm text-red-600">
                    Reason: No available time slots found for all participants
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'conflicts' && (
          <div className="space-y-4">
            {conflicts.length === 0 ? (
              <div className="text-center py-8 text-green-600">
                ✅ No conflicts detected!
              </div>
            ) : (
              conflicts.map((conflict, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {conflict.type === 'participant_conflict' ? 'Participant Conflict' : 'Time Conflict'}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getConflictSeverityColor(conflict.severity)}`}>
                        {conflict.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div className="mb-2">
                      <strong>Affected Meetings:</strong> {conflict.meetings?.join(', ') || 'Unknown'}
                    </div>
                    {conflict.participants && (
                      <div className="mb-2">
                        <strong>Conflicting Participants:</strong> {conflict.participants.join(', ')}
                      </div>
                    )}
                    {conflict.timeOverlap && (
                      <div className="mb-2">
                        <strong>Time Overlap:</strong> {formatTime(conflict.timeOverlap.start)} - {formatTime(conflict.timeOverlap.end)}
                      </div>
                    )}
                    {conflict.reason && (
                      <div>
                        <strong>Reason:</strong> {conflict.reason}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'suggestions' && aiSuggestions && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">AI Suggestions</h3>
              <div className="text-blue-700">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="mb-2">
                    • {suggestion}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Print Results
        </button>
        {onReschedule && (
          <button
            onClick={onReschedule}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reschedule
          </button>
        )}
      </div>
    </div>
  );
}

export default MultiMeetingResults;

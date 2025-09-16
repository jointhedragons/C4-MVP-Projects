import React, { useState } from 'react';

function MeetingInput({ meeting, onChange, onDelete, availableParticipants }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFieldChange = (field, value) => {
    onChange({
      ...meeting,
      [field]: value,
    });
  };

  const handleParticipantChange = (index, value) => {
    const newParticipants = [...meeting.participants];
    newParticipants[index] = value;
    handleFieldChange('participants', newParticipants);
  };

  const addParticipant = () => {
    handleFieldChange('participants', [...meeting.participants, '']);
  };

  const removeParticipant = (index) => {
    const newParticipants = meeting.participants.filter((_, i) => i !== index);
    handleFieldChange('participants', newParticipants);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImportanceColor = (importance) => {
    if (importance >= 4) return 'text-red-600';
    if (importance >= 3) return 'text-yellow-600';
    if (importance >= 2) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-800">
            {meeting.title || 'Untitled Meeting'}
          </h3>
          {meeting.urgency && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(meeting.urgency)}`}>
              {meeting.urgency.toUpperCase()}
            </span>
          )}
          {meeting.importance && (
            <span className={`text-sm font-medium ${getImportanceColor(meeting.importance)}`}>
              ⭐ {meeting.importance}/5
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Title
              </label>
              <input
                type="text"
                value={meeting.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter meeting title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={meeting.duration || 60}
                onChange={(e) => handleFieldChange('duration', parseInt(e.target.value) || 60)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="15"
                max="480"
              />
            </div>
          </div>

          {/* Priority Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Importance (1-5)
              </label>
              <select
                value={meeting.importance || 1}
                onChange={(e) => handleFieldChange('importance', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 - Low</option>
                <option value={2}>2 - Below Average</option>
                <option value={3}>3 - Average</option>
                <option value={4}>4 - High</option>
                <option value={5}>5 - Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency
              </label>
              <select
                value={meeting.urgency || 'low'}
                onChange={(e) => handleFieldChange('urgency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline (optional)
              </label>
              <input
                type="date"
                value={meeting.deadline || ''}
                onChange={(e) => handleFieldChange('deadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants
            </label>
            <div className="space-y-2">
              {meeting.participants.map((participant, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={participant}
                    onChange={(e) => handleParticipantChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select participant</option>
                    {availableParticipants.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {meeting.participants.length > 1 && (
                    <button
                      onClick={() => removeParticipant(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addParticipant}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                + Add Participant
              </button>
            </div>
          </div>

          {/* Meeting Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={meeting.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Brief description of the meeting"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingInput;

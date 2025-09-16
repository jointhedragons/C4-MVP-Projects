import React, { useState } from 'react';

function AvailabilityInput({ value, onChange, onLoadExample }) {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(value, null, 2));
  const [jsonError, setJsonError] = useState(null);

  const handleJsonChange = (newJson) => {
    setJsonInput(newJson);
    setJsonError(null);

    try {
      const parsed = JSON.parse(newJson);
      onChange(parsed);
    } catch (error) {
      setJsonError('Invalid JSON format');
    }
  };

  const handleLoadExample = () => {
    const example = {
      "Alice": [["09:00", "17:00"]],
      "Bob": [["12:00", "20:00"]],
      "Charlie": [["08:00", "12:00"], ["14:00", "18:00"]]
    };
    setJsonInput(JSON.stringify(example, null, 2));
    onChange(example);
    setJsonError(null);
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
          Enter team availability in JSON format:
        </label>
        <textarea
          id="availability"
          value={jsonInput}
          onChange={(e) => handleJsonChange(e.target.value)}
          className={`w-full h-48 p-3 border rounded-lg font-mono text-sm ${
            jsonError ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-primary-500'
          } focus:outline-none focus:ring-1 focus:ring-primary-500`}
          placeholder='{
  "Alice": [["09:00", "17:00"]],
  "Bob": [["12:00", "20:00"]],
  "Charlie": [["08:00", "12:00"], ["14:00", "18:00"]]
}'
        />
        {jsonError && (
          <p className="mt-1 text-sm text-red-600">{jsonError}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleLoadExample}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
        >
          Load Example
        </button>
        <span className="text-xs text-gray-500 self-center">
          Format: {"{"} "Name": [["start", "end"], ["start", "end"]] {"}"}
        </span>
      </div>

      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-1">Format Guide:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Use 24-hour format (e.g., "09:00", "17:30")</li>
          <li>• Each person can have multiple time ranges</li>
          <li>• Times should be in UTC</li>
          <li>• Start time must be before end time</li>
        </ul>
      </div>
    </div>
  );
}

export default AvailabilityInput;

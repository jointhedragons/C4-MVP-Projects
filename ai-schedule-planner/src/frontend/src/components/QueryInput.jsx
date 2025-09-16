import React from 'react';

function QueryInput({ value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
        Natural Language Query (Optional):
      </label>
      <input
        type="text"
        id="query"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
      <p className="mt-1 text-xs text-gray-500">
        Describe your meeting preferences (e.g., "morning meeting", "urgent", "flexible time")
      </p>
    </div>
  );
}

export default QueryInput;

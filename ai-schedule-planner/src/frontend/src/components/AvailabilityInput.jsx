import React, { useState } from 'react';

function AvailabilityInput({ value, onChange, onLoadExample }) {
  const [availability, setAvailability] = useState(value || {});

  const handleAddPerson = () => {
    const name = prompt("Enter person's name:");
    if (name && !availability[name]) {
      const updated = { ...availability, [name]: [] };
      setAvailability(updated);
      onChange(updated);
    }
  };

  const handleAddTime = (person) => {
    const start = prompt(`Enter start time for ${person} (HH:MM):`);
    const end = prompt(`Enter end time for ${person} (HH:MM):`);
    if (start && end) {
      const updated = {
        ...availability,
        [person]: [...availability[person], [start, end]]
      };
      setAvailability(updated);
      onChange(updated);
    }
  };

  const handleRemoveTime = (person, index) => {
    const updated = {
      ...availability,
      [person]: availability[person].filter((_, i) => i !== index)
    };
    setAvailability(updated);
    onChange(updated);
  };

  const handleRemovePerson = (person) => {
    const updated = { ...availability };
    delete updated[person];
    setAvailability(updated);
    onChange(updated);
  };

  const handleLoadExample = () => {
    const example = {
      "Alice": [["09:00", "17:00"]],
      "Bob": [["12:00", "20:00"]],
      "Charlie": [["08:00", "12:00"], ["14:00", "18:00"]]
    };
    setAvailability(example);
    onChange(example);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handleAddPerson}
          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          ➕ Add Person
        </button>
        <button
          onClick={handleLoadExample}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
        >
          📄 Load Example
        </button>
      </div>

      <div className="space-y-3">
        {Object.keys(availability).map((person) => (
          <div key={person} className="p-3 border rounded-lg bg-white shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">{person}</h3>
              <button
                onClick={() => handleRemovePerson(person)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove Person
              </button>
            </div>

            <div className="space-y-2">
              {availability[person].map(([start, end], index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span className="text-sm">{start} → {end}</span>
                  <button
                    onClick={() => handleRemoveTime(person, index)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleAddTime(person)}
              className="mt-2 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              ➕ Add Time
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailabilityInput;

import React from 'react';

function ResultsDisplay({ results }) {
  const { slots, explanation, ruleBasedSlots, aiRefined } = results;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Meeting Time Results
        </h2>
        {aiRefined && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3">
            ✨ AI Enhanced
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Explanation:</h3>
        <p className="text-gray-600">{explanation}</p>
      </div>

      {/* Slots Table */}
      {slots && slots.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Available Time Slots ({slots.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Members
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {slots.map((slot, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {slot.start}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {slot.end}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {slot.members.map((member, memberIndex) => (
                          <span
                            key={memberIndex}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        slot.type === 'perfect' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {slot.type === 'perfect' ? 'Perfect' : 'Partial'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">No Available Slots</h3>
          <p className="text-yellow-700">
            No overlapping time slots found for the given team availability. 
            Try adjusting the time ranges or adding more flexible schedules.
          </p>
        </div>
      )}

      {/* Rule-based vs AI comparison */}
      {aiRefined && ruleBasedSlots && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Rule-based Results (for comparison):
          </h3>
          <div className="text-xs text-gray-500">
            Found {ruleBasedSlots.length} slot(s) using rule-based algorithm
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;

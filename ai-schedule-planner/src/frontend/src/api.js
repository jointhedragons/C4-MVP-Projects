/**
 * API client for communicating with the backend
 * Supports both single-team and multi-meeting optimization
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Find meeting times using the scheduling API
 * @param {Object} availability - Team availability data
 * @param {string} query - Optional natural language query
 * @returns {Promise<Object>} Scheduling results
 */
export async function findMeetingTimes(availability, query = "") {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        availability,
        query: query.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to find meeting times: ${error.message}`);
  }
}

/**
 * Check if the backend API is healthy
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Health check error:", error);
    throw new Error(`Backend is not available: ${error.message}`);
  }
}

/**
 * Validate availability data format
 * @param {Object} availability - Team availability data
 * @returns {Object} Validation result
 */
export function validateAvailability(availability) {
  const errors = [];

  if (!availability || typeof availability !== "object") {
    errors.push("Availability must be a JSON object");
    return { valid: false, errors };
  }

  const members = Object.keys(availability);
  if (members.length === 0) {
    errors.push("At least one team member must be specified");
  }

  if (members.length > 10) {
    errors.push("Maximum 10 team members allowed for MVP");
  }

  for (const [member, ranges] of Object.entries(availability)) {
    if (!member.trim()) {
      errors.push("Member names cannot be empty");
      continue;
    }

    if (!Array.isArray(ranges)) {
      errors.push(`${member}: availability must be an array of time ranges`);
      continue;
    }

    if (ranges.length === 0) {
      errors.push(`${member}: at least one time range must be specified`);
      continue;
    }

    for (const range of ranges) {
      if (!Array.isArray(range) || range.length !== 2) {
        errors.push(`${member}: each range must be [start, end] format`);
        continue;
      }

      const [start, end] = range;
      if (typeof start !== "string" || typeof end !== "string") {
        errors.push(`${member}: start and end times must be strings`);
        continue;
      }

      // Validate time format
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(start) || !timeRegex.test(end)) {
        errors.push(`${member}: times must be in HH:mm format (e.g., "09:00")`);
        continue;
      }

      // Validate start < end
      const startMinutes = timeToMinutes(start);
      const endMinutes = timeToMinutes(end);
      if (startMinutes >= endMinutes) {
        errors.push(`${member}: start time must be before end time`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Convert time string to minutes since midnight
 * @param {string} timeStr - Time in format "HH:mm"
 * @returns {number} Minutes since midnight
 */
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Schedule multiple meetings with optimization
 * @param {Array} meetings - Array of meeting objects
 * @param {Object} availability - Team availability data
 * @param {string} query - Optional natural language query
 * @param {string} optimizationMethod - 'greedy' or 'genetic'
 * @param {Object} options - Additional optimization options
 * @returns {Promise<Object>} Multi-meeting optimization results
 */
export async function scheduleMultipleMeetings(
  meetings,
  availability,
  query = "",
  optimizationMethod = "greedy",
  options = {}
) {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule/multi-meeting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meetings,
        availability,
        query: query.trim(),
        optimizationMethod,
        options,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Multi-meeting API Error:", error);
    throw new Error(`Failed to schedule multiple meetings: ${error.message}`);
  }
}

/**
 * Analyze conflicts in meeting schedule
 * @param {Array} meetings - Array of meeting objects
 * @param {Object} availability - Team availability data
 * @returns {Promise<Object>} Conflict analysis results
 */
export async function analyzeConflicts(meetings, availability) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze/conflicts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meetings,
        availability,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Conflict Analysis API Error:", error);
    throw new Error(`Failed to analyze conflicts: ${error.message}`);
  }
}

/**
 * Get optimization suggestions
 * @param {Array} meetings - Array of meeting objects
 * @param {Object} availability - Team availability data
 * @param {Object} constraints - Resource constraints
 * @returns {Promise<Object>} Optimization suggestions
 */
export async function getOptimizationSuggestions(
  meetings,
  availability,
  constraints = {}
) {
  try {
    const response = await fetch(`${API_BASE_URL}/optimize/suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meetings,
        availability,
        constraints,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Optimization Suggestions API Error:", error);
    throw new Error(`Failed to get optimization suggestions: ${error.message}`);
  }
}

/**
 * Get example availability data
 * @returns {Object} Example team availability
 */
export function getExampleAvailability() {
  return {
    Alice: [["09:00", "17:00"]],
    Bob: [["12:00", "20:00"]],
    Charlie: [
      ["08:00", "12:00"],
      ["14:00", "18:00"],
    ],
    David: [["10:00", "16:00"]],
    Eve: [["09:00", "15:00"]],
  };
}

/**
 * Get example meetings data for multi-meeting testing
 * @returns {Array} Example meetings array
 */
export function getExampleMeetings() {
  return [
    {
      id: "meeting-1",
      title: "Product Planning",
      participants: ["Alice", "Bob", "Charlie"],
      duration: 60,
      importance: 4,
      urgency: "high",
      deadline: "2024-12-20",
    },
    {
      id: "meeting-2",
      title: "Design Review",
      participants: ["Alice", "David"],
      duration: 45,
      importance: 3,
      urgency: "medium",
    },
    {
      id: "meeting-3",
      title: "Team Standup",
      participants: ["Bob", "Charlie", "Eve"],
      duration: 30,
      importance: 2,
      urgency: "low",
    },
  ];
}

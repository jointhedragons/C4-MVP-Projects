/**
 * Multi-Meeting API Endpoints
 * Handles complex multi-meeting scheduling and optimization
 */

const {
  optimizeMeetingSchedule,
  optimizeWithGeneticAlgorithm,
} = require("./optimization");
const { refineWithGemini } = require("./gemini");

/**
 * Schedule multiple meetings with optimization
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function scheduleMultipleMeetings(req, res) {
  try {
    const {
      meetings,
      availability,
      query,
      optimizationMethod = "greedy",
      options = {},
    } = req.body;

    // Validate input
    if (!meetings || !Array.isArray(meetings) || meetings.length === 0) {
      return res.status(400).json({
        error: "Invalid meetings data. Expected array of meeting objects.",
        example: {
          meetings: [
            {
              id: "meeting-1",
              title: "Product Planning",
              participants: ["Alice", "Bob", "Charlie"],
              duration: 60,
              importance: 3,
              urgency: "high",
              deadline: "2024-12-20",
            },
          ],
        },
      });
    }

    if (!availability || typeof availability !== "object") {
      return res.status(400).json({
        error:
          "Invalid availability data. Expected JSON object with team member names and time ranges.",
      });
    }

    // Validate each meeting
    const validationErrors = validateMeetings(meetings);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Meeting validation failed",
        details: validationErrors,
      });
    }

    // Step 1: Run optimization algorithm
    let optimizationResult;
    if (optimizationMethod === "genetic") {
      optimizationResult = optimizeWithGeneticAlgorithm(
        meetings,
        availability,
        options
      );
    } else {
      optimizationResult = optimizeMeetingSchedule(meetings, availability);
    }

    // Step 2: AI refinement (if query provided)
    let finalResult = optimizationResult;
    let aiExplanation = null;

    if (query && query.trim()) {
      try {
        const aiResult = await refineMultiMeetingWithGemini(
          query,
          meetings,
          availability,
          optimizationResult
        );

        if (aiResult && aiResult.suggestions) {
          finalResult = {
            ...optimizationResult,
            aiSuggestions: aiResult.suggestions,
            aiExplanation: aiResult.explanation,
          };
          aiExplanation = aiResult.explanation;
        }
      } catch (aiError) {
        console.warn(
          "AI refinement failed, using optimization result:",
          aiError.message
        );
        // Continue with optimization result if AI fails
      }
    }

    // Step 3: Generate comprehensive response
    const response = {
      success: true,
      optimization: finalResult.optimization,
      scheduledMeetings: finalResult.scheduledMeetings,
      unscheduledMeetings: finalResult.unscheduledMeetings,
      conflicts: finalResult.conflicts,
      aiSuggestions: finalResult.aiSuggestions || null,
      explanation:
        aiExplanation || generateOptimizationExplanation(finalResult),
      metadata: {
        totalMeetings: meetings.length,
        scheduledCount: finalResult.scheduledMeetings.length,
        successRate: finalResult.optimization.successRate,
        optimizationMethod: optimizationMethod,
        timestamp: new Date().toISOString(),
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Multi-meeting scheduling error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to optimize meeting schedule",
      details: error.message,
    });
  }
}

/**
 * Get meeting conflicts analysis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function analyzeConflicts(req, res) {
  try {
    const { meetings, availability } = req.body;

    if (!meetings || !Array.isArray(meetings)) {
      return res.status(400).json({
        error: "Invalid meetings data. Expected array of meeting objects.",
      });
    }

    // Find all possible slots for each meeting
    const { findMeetingSlots, detectConflicts } = require("./optimization");
    const meetingSlots = {};

    for (const meeting of meetings) {
      meetingSlots[meeting.id] = findMeetingSlots(meeting, availability);
    }

    // Analyze potential conflicts
    const conflictAnalysis = {
      totalMeetings: meetings.length,
      meetingsWithSlots: Object.keys(meetingSlots).length,
      totalPossibleSlots: Object.values(meetingSlots).reduce(
        (sum, slots) => sum + slots.length,
        0
      ),
      potentialConflicts: [],
      recommendations: [],
    };

    // Check for meetings with no available slots
    for (const [meetingId, slots] of Object.entries(meetingSlots)) {
      if (slots.length === 0) {
        const meeting = meetings.find((m) => m.id === meetingId);
        conflictAnalysis.potentialConflicts.push({
          type: "no_available_slots",
          meetingId,
          meetingTitle: meeting.title,
          participants: meeting.participants,
          severity: "high",
        });
      }
    }

    // Generate recommendations
    if (conflictAnalysis.potentialConflicts.length > 0) {
      conflictAnalysis.recommendations.push(
        "Consider adjusting meeting times or reducing participant requirements"
      );
    }

    if (conflictAnalysis.totalPossibleSlots < meetings.length * 2) {
      conflictAnalysis.recommendations.push(
        "Limited availability detected. Consider extending time ranges or reducing meeting duration"
      );
    }

    res.json(conflictAnalysis);
  } catch (error) {
    console.error("Conflict analysis error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to analyze conflicts",
      details: error.message,
    });
  }
}

/**
 * Get optimization suggestions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getOptimizationSuggestions(req, res) {
  try {
    const { meetings, availability, constraints = {} } = req.body;

    if (!meetings || !Array.isArray(meetings)) {
      return res.status(400).json({
        error: "Invalid meetings data. Expected array of meeting objects.",
      });
    }

    const suggestions = {
      meetingOptimizations: [],
      scheduleOptimizations: [],
      resourceOptimizations: [],
    };

    // Analyze each meeting for optimization opportunities
    for (const meeting of meetings) {
      const meetingSuggestions = analyzeMeetingOptimization(
        meeting,
        availability
      );
      if (meetingSuggestions.length > 0) {
        suggestions.meetingOptimizations.push({
          meetingId: meeting.id,
          meetingTitle: meeting.title,
          suggestions: meetingSuggestions,
        });
      }
    }

    // Generate schedule-level suggestions
    suggestions.scheduleOptimizations = generateScheduleSuggestions(
      meetings,
      availability
    );

    // Generate resource optimization suggestions
    suggestions.resourceOptimizations = generateResourceSuggestions(
      meetings,
      constraints
    );

    res.json(suggestions);
  } catch (error) {
    console.error("Optimization suggestions error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to generate optimization suggestions",
      details: error.message,
    });
  }
}

/**
 * Validate meeting objects
 * @param {Array} meetings - Array of meeting objects
 * @returns {Array} Array of validation errors
 */
function validateMeetings(meetings) {
  const errors = [];

  for (let i = 0; i < meetings.length; i++) {
    const meeting = meetings[i];
    const prefix = `Meeting ${i + 1}`;

    if (!meeting.id) {
      errors.push(`${prefix}: Missing required field 'id'`);
    }

    if (
      !meeting.participants ||
      !Array.isArray(meeting.participants) ||
      meeting.participants.length === 0
    ) {
      errors.push(`${prefix}: Missing or invalid 'participants' array`);
    }

    if (
      meeting.duration &&
      (typeof meeting.duration !== "number" || meeting.duration <= 0)
    ) {
      errors.push(`${prefix}: 'duration' must be a positive number (minutes)`);
    }

    if (
      meeting.importance &&
      (typeof meeting.importance !== "number" ||
        meeting.importance < 1 ||
        meeting.importance > 5)
    ) {
      errors.push(`${prefix}: 'importance' must be a number between 1 and 5`);
    }

    if (
      meeting.urgency &&
      !["low", "medium", "high"].includes(meeting.urgency)
    ) {
      errors.push(`${prefix}: 'urgency' must be 'low', 'medium', or 'high'`);
    }

    if (meeting.deadline && isNaN(Date.parse(meeting.deadline))) {
      errors.push(`${prefix}: 'deadline' must be a valid date string`);
    }
  }

  return errors;
}

/**
 * Analyze individual meeting for optimization opportunities
 * @param {Object} meeting - Meeting object
 * @param {Object} availability - Team availability
 * @returns {Array} Array of optimization suggestions
 */
function analyzeMeetingOptimization(meeting, availability) {
  const suggestions = [];

  // Check if meeting has too many participants
  if (meeting.participants.length > 8) {
    suggestions.push({
      type: "reduce_participants",
      message:
        "Consider reducing participants to improve scheduling flexibility",
      impact: "high",
    });
  }

  // Check if meeting duration is too long
  if (meeting.duration > 120) {
    suggestions.push({
      type: "reduce_duration",
      message:
        "Consider reducing meeting duration to increase scheduling options",
      impact: "medium",
    });
  }

  // Check if meeting lacks priority information
  if (!meeting.importance && !meeting.urgency) {
    suggestions.push({
      type: "add_priority",
      message: "Add importance and urgency to help with optimization",
      impact: "medium",
    });
  }

  return suggestions;
}

/**
 * Generate schedule-level optimization suggestions
 * @param {Array} meetings - Array of meetings
 * @param {Object} availability - Team availability
 * @returns {Array} Array of suggestions
 */
function generateScheduleSuggestions(meetings, availability) {
  const suggestions = [];

  // Analyze participant overlap
  const participantCounts = {};
  for (const meeting of meetings) {
    for (const participant of meeting.participants) {
      participantCounts[participant] =
        (participantCounts[participant] || 0) + 1;
    }
  }

  const overbookedParticipants = Object.entries(participantCounts)
    .filter(([_, count]) => count > 3)
    .map(([participant, count]) => ({ participant, count }));

  if (overbookedParticipants.length > 0) {
    suggestions.push({
      type: "participant_overload",
      message: `Some participants are in ${overbookedParticipants.length} meetings. Consider redistributing.`,
      details: overbookedParticipants,
      impact: "high",
    });
  }

  // Suggest time range optimization
  const allTimes = Object.values(availability).flat().flat();
  const timeRange = {
    earliest: Math.min(...allTimes.map(timeToMinutes)),
    latest: Math.max(...allTimes.map(timeToMinutes)),
  };

  if (timeRange.latest - timeRange.earliest < 480) {
    // Less than 8 hours
    suggestions.push({
      type: "extend_time_range",
      message:
        "Consider extending availability time range to increase scheduling options",
      impact: "medium",
    });
  }

  return suggestions;
}

/**
 * Generate resource optimization suggestions
 * @param {Array} meetings - Array of meetings
 * @param {Object} constraints - Resource constraints
 * @returns {Array} Array of suggestions
 */
function generateResourceSuggestions(meetings, constraints) {
  const suggestions = [];

  // Room constraints
  if (constraints.rooms && constraints.rooms.length < meetings.length) {
    suggestions.push({
      type: "room_shortage",
      message: `Need ${meetings.length - constraints.rooms.length} more rooms`,
      impact: "high",
    });
  }

  // Equipment constraints
  if (constraints.equipment) {
    const equipmentNeeds = meetings.filter((m) => m.requiresEquipment).length;
    if (equipmentNeeds > constraints.equipment.length) {
      suggestions.push({
        type: "equipment_shortage",
        message: `Need ${
          equipmentNeeds - constraints.equipment.length
        } more equipment items`,
        impact: "medium",
      });
    }
  }

  return suggestions;
}

/**
 * Generate optimization explanation
 * @param {Object} result - Optimization result
 * @returns {string} Human-readable explanation
 */
function generateOptimizationExplanation(result) {
  const { optimization, scheduledMeetings, unscheduledMeetings, conflicts } =
    result;

  let explanation = `Successfully scheduled ${optimization.scheduledCount} out of ${optimization.totalMeetings} meetings `;
  explanation += `(${optimization.successRate}% success rate). `;

  if (scheduledMeetings.length > 0) {
    const highPriorityScheduled = scheduledMeetings.filter(
      (m) => m.priority > 3
    ).length;
    if (highPriorityScheduled > 0) {
      explanation += `${highPriorityScheduled} high-priority meetings were prioritized. `;
    }
  }

  if (conflicts.length > 0) {
    explanation += `Detected ${conflicts.length} conflicts that may need manual resolution. `;
  }

  if (unscheduledMeetings.length > 0) {
    explanation += `${unscheduledMeetings.length} meetings could not be scheduled due to availability constraints.`;
  }

  return explanation;
}

/**
 * Refine multi-meeting results with AI
 * @param {string} query - User query
 * @param {Array} meetings - Original meetings
 * @param {Object} availability - Team availability
 * @param {Object} optimizationResult - Optimization result
 * @returns {Object} AI-refined suggestions
 */
async function refineMultiMeetingWithGemini(
  query,
  meetings,
  availability,
  optimizationResult
) {
  try {
    const prompt = buildMultiMeetingPrompt(
      query,
      meetings,
      availability,
      optimizationResult
    );

    // Use existing Gemini integration with enhanced prompt
    const aiResult = await refineWithGemini(
      query,
      availability,
      optimizationResult.scheduledMeetings
    );

    return {
      suggestions: aiResult.slots || [],
      explanation: aiResult.explanation || "AI analysis completed",
    };
  } catch (error) {
    console.error("Multi-meeting AI refinement error:", error);
    throw error;
  }
}

/**
 * Build prompt for multi-meeting AI analysis
 * @param {string} query - User query
 * @param {Array} meetings - Meetings array
 * @param {Object} availability - Team availability
 * @param {Object} optimizationResult - Optimization result
 * @returns {string} Formatted prompt
 */
function buildMultiMeetingPrompt(
  query,
  meetings,
  availability,
  optimizationResult
) {
  return `You are an AI meeting optimization assistant. Analyze the following multi-meeting scheduling scenario:

USER QUERY: ${query}

MEETINGS TO SCHEDULE:
${JSON.stringify(meetings, null, 2)}

TEAM AVAILABILITY:
${JSON.stringify(availability, null, 2)}

OPTIMIZATION RESULT:
- Scheduled: ${optimizationResult.scheduledMeetings.length} meetings
- Unscheduled: ${optimizationResult.unscheduledMeetings.length} meetings
- Conflicts: ${optimizationResult.conflicts.length}
- Success Rate: ${optimizationResult.optimization.successRate}%

TASK: Provide intelligent suggestions to improve the meeting schedule based on the user's query. Consider:
1. Meeting priorities and importance
2. Participant availability and conflicts
3. Time optimization opportunities
4. Alternative scheduling strategies

OUTPUT: Return ONLY a valid JSON object:
{
  "suggestions": [
    {
      "type": "reschedule",
      "meetingId": "meeting-1",
      "newTime": "14:00 UTC",
      "reason": "Better participant availability"
    }
  ],
  "explanation": "Brief explanation of suggestions"
}`;
}

// Helper function
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

module.exports = {
  scheduleMultipleMeetings,
  analyzeConflicts,
  getOptimizationSuggestions,
};

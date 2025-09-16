/**
 * Gemini AI integration for schedule refinement
 * Uses Google Gemini API to refine rule-based scheduling results
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Refine scheduling results using Gemini AI
 * @param {string} query - User's natural language query
 * @param {Object} availability - Team availability data
 * @param {Array} ruleSlots - Rule-based scheduling results
 * @returns {Object} AI-refined slots and explanation
 */
async function refineWithGemini(query, availability, ruleSlots) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found, falling back to rule-based results");
      return {
        slots: ruleSlots,
        explanation: "AI refinement not available - using rule-based scheduling results",
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = buildPrompt(query, availability, ruleSlots);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const aiResult = parseGeminiResponse(text);

    // Validate the AI result against original availability
    const validatedResult = validateAIResult(aiResult, availability, ruleSlots);

    return validatedResult;
  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Handle specific API errors gracefully
    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      console.warn("API rate limit exceeded, falling back to rule-based results");
      return {
        slots: ruleSlots,
        explanation: `API rate limit exceeded - showing rule-based scheduling results. Original query: "${query}"`,
      };
    }
    
    if (error.message.includes('parse') || error.message.includes('JSON')) {
      console.warn("Failed to parse AI response, falling back to rule-based results");
      return {
        slots: ruleSlots,
        explanation: `AI response parsing failed - showing rule-based scheduling results. Original query: "${query}"`,
      };
    }
    
    // For any other error, still fall back gracefully
    console.warn("AI refinement failed, falling back to rule-based results");
    return {
      slots: ruleSlots,
      explanation: `AI refinement failed (${error.message}) - showing rule-based scheduling results. Original query: "${query}"`,
    };
  }
}

/**
 * Build the prompt for Gemini AI
 * @param {string} query - User query
 * @param {Object} availability - Team availability
 * @param {Array} ruleSlots - Rule-based slots
 * @returns {string} Formatted prompt
 */
function buildPrompt(query, availability, ruleSlots) {
  return `You are an AI scheduling assistant. Your job is to analyze team availability and propose the best meeting times.

INPUT:
- User query: "${query}"
- Team availability: ${JSON.stringify(availability, null, 2)}
- Rule-based suggested slots: ${JSON.stringify(ruleSlots, null, 2)}

TASK:
1. Refine the suggested slots using the user query if provided.
2. If there are perfect overlaps, prioritize them.
3. If no perfect overlap exists, propose the closest possible slots and list which members can attend.
4. Do not invent fake times outside the given availability.
5. Consider the user's query context (e.g., "morning meeting", "urgent", "flexible time").

OUTPUT:
Return ONLY a valid JSON object in the following format:

{
  "slots": [
    { "start": "HH:mm UTC", "end": "HH:mm UTC", "members": ["Alice","Bob"] }
  ],
  "explanation": "Explain briefly why these slots are chosen"
}

IMPORTANT:
- Return ONLY the JSON object, no additional text
- All times must be in "HH:mm UTC" format
- Members array must contain actual member names from the availability data
- Do not create slots outside the provided availability ranges
- If no suitable slots exist, return empty slots array with explanation`;
}

/**
 * Parse Gemini's response and extract JSON
 * @param {string} text - Raw response from Gemini
 * @returns {Object} Parsed JSON object
 */
function parseGeminiResponse(text) {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error("Response text is empty or invalid");
    }

    // Clean the response text
    let cleanText = text.trim();

    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\n?/gi, "").replace(/```\n?/g, "");
    
    // Remove any leading/trailing non-JSON text
    cleanText = cleanText.replace(/^[^{]*/, "").replace(/[^}]*$/, "");

    // Find JSON object boundaries
    const jsonStart = cleanText.indexOf("{");
    const jsonEnd = cleanText.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0 || jsonEnd <= jsonStart) {
      throw new Error("No valid JSON found in response");
    }

    const jsonText = cleanText.substring(jsonStart, jsonEnd);
    
    // Try to parse JSON
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      // Try to fix common JSON issues
      let fixedJson = jsonText
        .replace(/'/g, '"')  // Replace single quotes with double quotes
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')  // Quote unquoted keys
        .replace(/,\s*}/g, '}')  // Remove trailing commas
        .replace(/,\s*]/g, ']');  // Remove trailing commas in arrays
      
      try {
        parsed = JSON.parse(fixedJson);
      } catch (secondParseError) {
        throw new Error(`JSON parsing failed: ${parseError.message}`);
      }
    }

    // Validate required fields
    if (!parsed.slots || !Array.isArray(parsed.slots)) {
      throw new Error("Invalid response format: slots array missing");
    }

    if (!parsed.explanation || typeof parsed.explanation !== "string") {
      throw new Error("Invalid response format: explanation missing");
    }

    return parsed;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error.message);
    console.error("Raw response (first 200 chars):", text?.substring(0, 200));
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

/**
 * Validate AI result against original availability data
 * @param {Object} aiResult - AI-generated result
 * @param {Object} availability - Original availability data
 * @param {Array} ruleSlots - Rule-based slots for fallback
 * @returns {Object} Validated result
 */
function validateAIResult(aiResult, availability, ruleSlots) {
  const validatedSlots = [];
  const memberNames = Object.keys(availability);

  for (const slot of aiResult.slots) {
    // Validate slot structure
    if (
      !slot.start ||
      !slot.end ||
      !slot.members ||
      !Array.isArray(slot.members)
    ) {
      console.warn("Invalid slot structure, skipping:", slot);
      continue;
    }

    // Validate member names
    const validMembers = slot.members.filter((member) =>
      memberNames.includes(member)
    );
    if (validMembers.length === 0) {
      console.warn("No valid members in slot, skipping:", slot);
      continue;
    }

    // Validate time format
    const timeRegex = /^\d{2}:\d{2} UTC$/;
    if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
      console.warn("Invalid time format, skipping:", slot);
      continue;
    }

    // Check if slot is within availability ranges
    const isValidSlot = validateSlotAgainstAvailability(
      slot,
      availability,
      validMembers
    );
    if (isValidSlot) {
      validatedSlots.push({
        ...slot,
        members: validMembers,
      });
    } else {
      console.warn("Slot outside availability ranges, skipping:", slot);
    }
  }

  // If no valid slots from AI, fall back to rule-based results
  if (validatedSlots.length === 0) {
    console.warn("No valid AI slots, falling back to rule-based results");
    return {
      slots: ruleSlots,
      explanation:
        aiResult.explanation +
        " (Note: AI suggestions were invalid, showing rule-based results)",
    };
  }

  return {
    slots: validatedSlots,
    explanation: aiResult.explanation,
  };
}

/**
 * Validate if a slot is within team availability
 * @param {Object} slot - Slot to validate
 * @param {Object} availability - Team availability
 * @param {Array} members - Members to check
 * @returns {boolean} Whether slot is valid
 */
function validateSlotAgainstAvailability(slot, availability, members) {
  const slotStart = slot.start.replace(" UTC", "");
  const slotEnd = slot.end.replace(" UTC", "");

  for (const member of members) {
    const memberRanges = availability[member];
    let memberAvailable = false;

    for (const range of memberRanges) {
      const [rangeStart, rangeEnd] = range;

      // Check if slot is within this range
      if (slotStart >= rangeStart && slotEnd <= rangeEnd) {
        memberAvailable = true;
        break;
      }
    }

    if (!memberAvailable) {
      return false;
    }
  }

  return true;
}

module.exports = {
  refineWithGemini,
};

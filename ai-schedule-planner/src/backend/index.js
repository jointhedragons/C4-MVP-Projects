require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { findOverlappingSlots } = require("./rules");
const { refineWithGemini } = require("./gemini");
const {
  scheduleMultipleMeetings,
  analyzeConflicts,
  getOptimizationSuggestions,
} = require("./multi-meeting-api");

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "AI Schedule Planner API is running",
    version: "2.0.0",
    features: [
      "single-team-scheduling",
      "multi-meeting-optimization",
      "ai-enhancement",
    ],
  });
});

// Main scheduling endpoint
app.post("/schedule", async (req, res) => {
  try {
    const { availability, query } = req.body;

    // Validate input
    if (!availability || typeof availability !== "object") {
      return res.status(400).json({
        error:
          "Invalid availability data. Expected JSON object with team member names and time ranges.",
      });
    }

    // Step 1: Rule-based scheduling
    const ruleBasedSlots = findOverlappingSlots(availability);

    // Step 2: AI refinement (if query provided)
    let finalSlots = ruleBasedSlots;
    let explanation =
      "Found overlapping time slots based on team availability.";

    if (query && query.trim()) {
      try {
        const aiResult = await refineWithGemini(
          query,
          availability,
          ruleBasedSlots
        );
        if (aiResult && aiResult.slots) {
          finalSlots = aiResult.slots;
          explanation = aiResult.explanation || explanation;
        }
      } catch (aiError) {
        console.warn(
          "AI refinement failed, using rule-based results:",
          aiError.message
        );
        // Continue with rule-based results as fallback
      }
    }

    res.json({
      slots: finalSlots,
      explanation: explanation,
      ruleBasedSlots: ruleBasedSlots,
      aiRefined: query && query.trim() ? true : false,
    });
  } catch (error) {
    console.error("Scheduling error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  // Handle JSON parsing errors
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid JSON format",
    });
  }

  res.status(500).json({
    error: "Internal server error",
    message: "An unexpected error occurred",
  });
});

// Multi-meeting optimization endpoints
app.post("/schedule/multi-meeting", scheduleMultipleMeetings);
app.post("/analyze/conflicts", analyzeConflicts);
app.post("/optimize/suggestions", getOptimizationSuggestions);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested endpoint does not exist",
    availableEndpoints: [
      "GET /health",
      "POST /schedule",
      "POST /schedule/multi-meeting",
      "POST /analyze/conflicts",
      "POST /optimize/suggestions",
    ],
  });
});

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 AI Schedule Planner API v2.0 running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📅 Single team: POST http://localhost:${PORT}/schedule`);
    console.log(
      `🎯 Multi-meeting: POST http://localhost:${PORT}/schedule/multi-meeting`
    );
    console.log(
      `🔍 Conflict analysis: POST http://localhost:${PORT}/analyze/conflicts`
    );
    console.log(
      `💡 Optimization: POST http://localhost:${PORT}/optimize/suggestions`
    );
  });
}

module.exports = app;

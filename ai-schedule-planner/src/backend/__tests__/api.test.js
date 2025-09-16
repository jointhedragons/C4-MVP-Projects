const request = require("supertest");
const app = require("../index");

// Mock the rules module
jest.mock("../rules", () => ({
  findOverlappingSlots: jest.fn(),
}));

// Mock the gemini module
jest.mock("../gemini", () => ({
  refineWithGemini: jest.fn(),
}));

const { findOverlappingSlots } = require("../rules");
const { refineWithGemini } = require("../gemini");

describe("API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /health", () => {
    test("returns health status with v2.0 features", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
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
  });

  describe("POST /schedule", () => {
    test("successfully schedules meeting with rule-based results only", async () => {
      const mockSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice", "Bob"],
          type: "perfect",
        },
      ];

      findOverlappingSlots.mockReturnValue(mockSlots);

      const requestBody = {
        availability: {
          Alice: [["09:00", "17:00"]],
          Bob: [["12:00", "20:00"]],
        },
        query: "",
      };

      const response = await request(app).post("/schedule").send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        slots: mockSlots,
        explanation: "Found overlapping time slots based on team availability.",
        ruleBasedSlots: mockSlots,
        aiRefined: false,
      });

      expect(findOverlappingSlots).toHaveBeenCalledWith(
        requestBody.availability
      );
      expect(refineWithGemini).not.toHaveBeenCalled();
    });

    test("successfully schedules meeting with AI refinement", async () => {
      const mockRuleSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice", "Bob"],
          type: "perfect",
        },
      ];

      const mockAISlots = [
        {
          start: "09:00 UTC",
          end: "10:00 UTC",
          members: ["Alice"],
        },
      ];

      const mockAIResult = {
        slots: mockAISlots,
        explanation: "9:00 AM works best for Alice in the morning.",
      };

      findOverlappingSlots.mockReturnValue(mockRuleSlots);
      refineWithGemini.mockResolvedValue(mockAIResult);

      const requestBody = {
        availability: {
          Alice: [["09:00", "17:00"]],
          Bob: [["12:00", "20:00"]],
        },
        query: "morning meeting",
      };

      const response = await request(app).post("/schedule").send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        slots: mockAISlots,
        explanation: "9:00 AM works best for Alice in the morning.",
        ruleBasedSlots: mockRuleSlots,
        aiRefined: true,
      });

      expect(findOverlappingSlots).toHaveBeenCalledWith(
        requestBody.availability
      );
      expect(refineWithGemini).toHaveBeenCalledWith(
        "morning meeting",
        requestBody.availability,
        mockRuleSlots
      );
    });

    test("falls back to rule-based results when AI fails", async () => {
      const mockSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice", "Bob"],
          type: "perfect",
        },
      ];

      findOverlappingSlots.mockReturnValue(mockSlots);
      refineWithGemini.mockRejectedValue(new Error("AI service unavailable"));

      const requestBody = {
        availability: {
          Alice: [["09:00", "17:00"]],
          Bob: [["12:00", "20:00"]],
        },
        query: "morning meeting",
      };

      const response = await request(app).post("/schedule").send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        slots: mockSlots,
        explanation: "Found overlapping time slots based on team availability.",
        ruleBasedSlots: mockSlots,
        aiRefined: true,
      });

      expect(findOverlappingSlots).toHaveBeenCalledWith(
        requestBody.availability
      );
      expect(refineWithGemini).toHaveBeenCalledWith(
        "morning meeting",
        requestBody.availability,
        mockSlots
      );
    });

    test("handles missing availability data", async () => {
      const requestBody = {
        query: "morning meeting",
      };

      const response = await request(app).post("/schedule").send(requestBody);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error:
          "Invalid availability data. Expected JSON object with team member names and time ranges.",
      });

      expect(findOverlappingSlots).not.toHaveBeenCalled();
      expect(refineWithGemini).not.toHaveBeenCalled();
    });

    test("handles invalid availability data type", async () => {
      const requestBody = {
        availability: "invalid",
        query: "morning meeting",
      };

      const response = await request(app).post("/schedule").send(requestBody);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error:
          "Invalid availability data. Expected JSON object with team member names and time ranges.",
      });
    });

    test("handles empty query string", async () => {
      const mockSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice", "Bob"],
          type: "perfect",
        },
      ];

      findOverlappingSlots.mockReturnValue(mockSlots);

      const requestBody = {
        availability: {
          Alice: [["09:00", "17:00"]],
          Bob: [["12:00", "20:00"]],
        },
        query: "   ", // Whitespace only
      };

      const response = await request(app).post("/schedule").send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body.aiRefined).toBe(false);
      expect(refineWithGemini).not.toHaveBeenCalled();
    });

    test("handles internal server errors", async () => {
      findOverlappingSlots.mockImplementation(() => {
        throw new Error("Internal processing error");
      });

      const requestBody = {
        availability: {
          Alice: [["09:00", "17:00"]],
        },
      };

      const response = await request(app).post("/schedule").send(requestBody);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: "Internal server error",
        message: "Internal processing error",
      });
    });

    test("handles malformed JSON request", async () => {
      const response = await request(app)
        .post("/schedule")
        .set("Content-Type", "application/json")
        .send("invalid json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Bad Request",
        message: "Invalid JSON format",
      });
    });
  });

  describe("404 handler", () => {
    test("returns 404 for non-existent endpoints", async () => {
      const response = await request(app).get("/non-existent");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
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
  });

  describe("Error handling middleware", () => {
    test("handles unhandled errors gracefully", async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      // Test with a route that doesn't exist to trigger 404
      const response = await request(app).get("/nonexistent-route");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
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

      consoleSpy.mockRestore();
    });
  });
});

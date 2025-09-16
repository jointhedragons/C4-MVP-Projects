/**
 * Tests for multi-meeting-api.js - Multi-meeting API endpoints
 */

const request = require("supertest");
const app = require("../index");

// Mock the optimization module
jest.mock("../optimization", () => ({
  optimizeMeetingSchedule: jest.fn(),
  optimizeWithGeneticAlgorithm: jest.fn(),
  findMeetingSlots: jest.fn(() => []),
  detectConflicts: jest.fn(() => []),
}));

// Mock the gemini module
jest.mock("../gemini", () => ({
  refineWithGemini: jest.fn(),
}));

const {
  optimizeMeetingSchedule,
  optimizeWithGeneticAlgorithm,
} = require("../optimization");
const { refineWithGemini } = require("../gemini");

describe("Multi-Meeting API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /schedule/multi-meeting", () => {
    const validRequest = {
      meetings: [
        {
          id: "meeting-1",
          title: "Product Planning",
          participants: ["Alice", "Bob", "Charlie"],
          duration: 60,
          importance: 4,
          urgency: "high",
        },
        {
          id: "meeting-2",
          title: "Design Review",
          participants: ["Alice", "David"],
          duration: 45,
          importance: 3,
          urgency: "medium",
        },
      ],
      availability: {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
        Charlie: [
          ["08:00", "12:00"],
          ["14:00", "18:00"],
        ],
        David: [["10:00", "16:00"]],
      },
    };

    test("successfully schedules multiple meetings with greedy algorithm", async () => {
      const mockResult = {
        scheduledMeetings: [
          {
            id: "meeting-1",
            title: "Product Planning",
            participants: ["Alice", "Bob", "Charlie"],
            duration: 60,
            importance: 4,
            urgency: "high",
            priority: 13.5,
            start: "14:00 UTC",
            end: "15:00 UTC",
            scheduled: true,
          },
        ],
        unscheduledMeetings: [],
        conflicts: [],
        optimization: {
          totalMeetings: 2,
          scheduledCount: 1,
          successRate: 50,
          totalPriorityScore: 13.5,
        },
      };

      optimizeMeetingSchedule.mockReturnValue(mockResult);

      const response = await request(app)
        .post("/schedule/multi-meeting")
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.optimization.totalMeetings).toBe(2);
      expect(response.body.scheduledMeetings).toHaveLength(1);
      expect(optimizeMeetingSchedule).toHaveBeenCalledWith(
        validRequest.meetings,
        validRequest.availability
      );
    });

    test("successfully schedules multiple meetings with genetic algorithm", async () => {
      const mockResult = {
        scheduledMeetings: [
          {
            id: "meeting-1",
            title: "Product Planning",
            participants: ["Alice", "Bob", "Charlie"],
            duration: 60,
            importance: 4,
            urgency: "high",
            priority: 13.5,
            start: "14:00 UTC",
            end: "15:00 UTC",
            scheduled: true,
          },
        ],
        unscheduledMeetings: [],
        conflicts: [],
        optimization: {
          algorithm: "genetic",
          fitness: 150,
          generations: 100,
        },
      };

      optimizeWithGeneticAlgorithm.mockReturnValue(mockResult);

      const requestWithGenetic = {
        ...validRequest,
        optimizationMethod: "genetic",
        options: { populationSize: 50, generations: 100 },
      };

      const response = await request(app)
        .post("/schedule/multi-meeting")
        .send(requestWithGenetic);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(optimizeWithGeneticAlgorithm).toHaveBeenCalledWith(
        validRequest.meetings,
        validRequest.availability,
        { populationSize: 50, generations: 100 }
      );
    });

    test("handles AI refinement when query is provided", async () => {
      const mockOptimizationResult = {
        scheduledMeetings: [],
        unscheduledMeetings: [],
        conflicts: [],
        optimization: { totalMeetings: 0, scheduledCount: 0, successRate: 0 },
      };

      const mockAIResult = {
        slots: [], // Gemini returns slots, not suggestions
        explanation:
          "AI analysis suggests rescheduling for better optimization",
      };

      optimizeMeetingSchedule.mockReturnValue(mockOptimizationResult);
      refineWithGemini.mockResolvedValue(mockAIResult);

      const requestWithQuery = {
        ...validRequest,
        query: "optimize for maximum meetings with high priority first",
      };

      const response = await request(app)
        .post("/schedule/multi-meeting")
        .send(requestWithQuery);

      expect(response.status).toBe(200);
      expect(response.body.aiSuggestions).toEqual([]); // Should be empty array based on slots
      expect(response.body.explanation).toBe(mockAIResult.explanation);
    });

    test("validates meetings input", async () => {
      const invalidRequest = {
        meetings: "invalid",
        availability: validRequest.availability,
      };

      const response = await request(app)
        .post("/schedule/multi-meeting")
        .send(invalidRequest);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid meetings data");
    });

    test("validates availability input", async () => {
      const invalidRequest = {
        meetings: validRequest.meetings,
        availability: "invalid",
      };

      const response = await request(app)
        .post("/schedule/multi-meeting")
        .send(invalidRequest);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid availability data");
    });

    test("validates individual meeting objects", async () => {
      const invalidRequest = {
        meetings: [
          {
            id: "meeting-1",
            // Missing required fields
          },
        ],
        availability: validRequest.availability,
      };

      const response = await request(app)
        .post("/schedule/multi-meeting")
        .send(invalidRequest);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Meeting validation failed");
    });

    test("handles optimization errors gracefully", async () => {
      optimizeMeetingSchedule.mockImplementation(() => {
        throw new Error("Optimization failed");
      });

      const response = await request(app)
        .post("/schedule/multi-meeting")
        .send(validRequest);

      expect(response.status).toBe(500);
      expect(response.body.error).toContain("Internal server error");
    });
  });

  describe("POST /analyze/conflicts", () => {
    const validRequest = {
      meetings: [
        {
          id: "meeting-1",
          title: "Product Planning",
          participants: ["Alice", "Bob"],
          duration: 60,
        },
        {
          id: "meeting-2",
          title: "Design Review",
          participants: ["Alice", "Charlie"],
          duration: 45,
        },
      ],
      availability: {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
        Charlie: [
          ["08:00", "12:00"],
          ["14:00", "18:00"],
        ],
      },
    };

    test("analyzes conflicts successfully", async () => {
      const response = await request(app)
        .post("/analyze/conflicts")
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("totalMeetings");
      expect(response.body).toHaveProperty("meetingsWithSlots");
      expect(response.body).toHaveProperty("totalPossibleSlots");
      expect(response.body).toHaveProperty("potentialConflicts");
      expect(response.body).toHaveProperty("recommendations");
    });

    test("validates meetings input for conflict analysis", async () => {
      const invalidRequest = {
        meetings: "invalid",
        availability: validRequest.availability,
      };

      const response = await request(app)
        .post("/analyze/conflicts")
        .send(invalidRequest);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid meetings data");
    });

    test("handles conflict analysis errors", async () => {
      // Mock the optimization module to throw an error
      const { findMeetingSlots } = require("../optimization");
      findMeetingSlots.mockImplementation(() => {
        throw new Error("Conflict analysis failed");
      });

      const response = await request(app)
        .post("/analyze/conflicts")
        .send(validRequest);

      expect(response.status).toBe(500);
      expect(response.body.error).toContain("Internal server error");
    });
  });

  describe("POST /optimize/suggestions", () => {
    const validRequest = {
      meetings: [
        {
          id: "meeting-1",
          title: "Product Planning",
          participants: ["Alice", "Bob", "Charlie"],
          duration: 60,
          importance: 4,
          urgency: "high",
        },
      ],
      availability: {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
        Charlie: [
          ["08:00", "12:00"],
          ["14:00", "18:00"],
        ],
      },
      constraints: {
        rooms: ["Room A", "Room B"],
        equipment: ["Projector", "Whiteboard"],
      },
    };

    test("provides optimization suggestions successfully", async () => {
      const response = await request(app)
        .post("/optimize/suggestions")
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("meetingOptimizations");
      expect(response.body).toHaveProperty("scheduleOptimizations");
      expect(response.body).toHaveProperty("resourceOptimizations");
    });

    test("validates meetings input for suggestions", async () => {
      const invalidRequest = {
        meetings: "invalid",
        availability: validRequest.availability,
      };

      const response = await request(app)
        .post("/optimize/suggestions")
        .send(invalidRequest);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid meetings data");
    });

    test("handles suggestions errors", async () => {
      // Test with invalid data that should cause an error
      const invalidRequest = {
        meetings: null, // This should trigger validation error
        availability: validRequest.availability,
      };

      const response = await request(app)
        .post("/optimize/suggestions")
        .send(invalidRequest);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid meetings data");
    });
  });
});

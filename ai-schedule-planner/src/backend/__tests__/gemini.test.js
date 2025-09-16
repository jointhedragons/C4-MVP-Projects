const { refineWithGemini } = require("../gemini");

// Mock the Google Generative AI
jest.mock("@google/generative-ai", () => {
  const mockGenerateContent = jest.fn();
  const mockModel = {
    generateContent: mockGenerateContent,
  };
  const mockGenAI = {
    getGenerativeModel: jest.fn().mockReturnValue(mockModel),
  };

  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => mockGenAI),
  };
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

describe("Gemini AI Integration", () => {
  let mockGenerateContent;
  let mockModel;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up environment variable
    process.env.GEMINI_API_KEY = "test-api-key";

    // Get access to the mock functions
    const mockGenAI = new GoogleGenerativeAI();
    mockModel = mockGenAI.getGenerativeModel();
    mockGenerateContent = mockModel.generateContent;
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  describe("refineWithGemini", () => {
    test("successfully refines slots with valid AI response", async () => {
      const query = "morning meeting";
      const availability = {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
      };
      const ruleSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice", "Bob"],
          type: "perfect",
        },
      ];

      const mockAIResponse = {
        slots: [
          {
            start: "09:00 UTC",
            end: "10:00 UTC",
            members: ["Alice"],
          },
        ],
        explanation: "9:00 AM works best for Alice in the morning.",
      };

      mockGenerateContent.mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue(JSON.stringify(mockAIResponse)),
        },
      });

      const result = await refineWithGemini(query, availability, ruleSlots);

      expect(result).toEqual({
        slots: [
          {
            start: "09:00 UTC",
            end: "10:00 UTC",
            members: ["Alice"],
          },
        ],
        explanation: "9:00 AM works best for Alice in the morning.",
      });

      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    test("falls back to rule-based results when AI response is invalid", async () => {
      const query = "morning meeting";
      const availability = {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
      };
      const ruleSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice", "Bob"],
          type: "perfect",
        },
      ];

      // AI returns invalid slot (outside availability)
      const mockAIResponse = {
        slots: [
          {
            start: "08:00 UTC", // Before Alice's availability
            end: "09:00 UTC",
            members: ["Alice"],
          },
        ],
        explanation: "8:00 AM works for Alice.",
      };

      mockGenerateContent.mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue(JSON.stringify(mockAIResponse)),
        },
      });

      const result = await refineWithGemini(query, availability, ruleSlots);

      // Should fall back to rule-based results
      expect(result.slots).toEqual(ruleSlots);
      expect(result.explanation).toContain("Note: AI suggestions were invalid");
    });

    test("handles AI response with invalid member names", async () => {
      const query = "morning meeting";
      const availability = {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
      };
      const ruleSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice", "Bob"],
          type: "perfect",
        },
      ];

      // AI returns slot with invalid member
      const mockAIResponse = {
        slots: [
          {
            start: "12:00 UTC",
            end: "13:00 UTC",
            members: ["Alice", "Charlie"], // Charlie not in availability
          },
        ],
        explanation: "12:00 PM works for Alice and Charlie.",
      };

      mockGenerateContent.mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue(JSON.stringify(mockAIResponse)),
        },
      });

      const result = await refineWithGemini(query, availability, ruleSlots);

      // Should filter out invalid members but keep valid ones
      expect(result.slots).toHaveLength(1);
      expect(result.slots[0].members).toEqual(["Alice"]); // Only valid members
      expect(result.slots[0].start).toBe("12:00 UTC");
      expect(result.slots[0].end).toBe("13:00 UTC");
      expect(result.explanation).toBe("12:00 PM works for Alice and Charlie.");
    });

    test("handles malformed JSON response", async () => {
      const query = "morning meeting";
      const availability = {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
      };
      const ruleSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice", "Bob"],
          type: "perfect",
        },
      ];

      // AI returns malformed JSON
      mockGenerateContent.mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue("This is not valid JSON"),
        },
      });

      const result = await refineWithGemini(query, availability, ruleSlots);
      
      // Should fall back to rule-based results instead of throwing
      expect(result.slots).toEqual(ruleSlots);
      expect(result.explanation).toContain("AI response parsing failed");
    });

    test("handles missing API key", async () => {
      delete process.env.GEMINI_API_KEY;

      const query = "morning meeting";
      const availability = {
        Alice: [["09:00", "17:00"]],
      };
      const ruleSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice"],
          type: "perfect",
        },
      ];

      const result = await refineWithGemini(query, availability, ruleSlots);
      
      // Should fall back to rule-based results instead of throwing
      expect(result.slots).toEqual(ruleSlots);
      expect(result.explanation).toContain("AI refinement not available");
    });

    test("handles AI API errors", async () => {
      const query = "morning meeting";
      const availability = {
        Alice: [["09:00", "17:00"]],
      };
      const ruleSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice"],
          type: "perfect",
        },
      ];

      mockGenerateContent.mockRejectedValue(
        new Error("API rate limit exceeded")
      );

      const result = await refineWithGemini(query, availability, ruleSlots);
      
      // Should fall back to rule-based results instead of throwing
      expect(result.slots).toEqual(ruleSlots);
      expect(result.explanation).toContain("API rate limit exceeded");
    });

    test("handles response with markdown code blocks", async () => {
      const query = "morning meeting";
      const availability = {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
      };
      const ruleSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice", "Bob"],
          type: "perfect",
        },
      ];

      const mockAIResponse = {
        slots: [
          {
            start: "12:00 UTC",
            end: "13:00 UTC",
            members: ["Alice", "Bob"],
          },
        ],
        explanation: "12:00 PM works for both Alice and Bob.",
      };

      // AI returns response wrapped in markdown
      mockGenerateContent.mockResolvedValue({
        response: {
          text: jest
            .fn()
            .mockReturnValue(
              `\`\`\`json\n${JSON.stringify(mockAIResponse)}\n\`\`\``
            ),
        },
      });

      const result = await refineWithGemini(query, availability, ruleSlots);

      expect(result).toEqual(mockAIResponse);
    });

    test("validates time format in AI response", async () => {
      const query = "morning meeting";
      const availability = {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
      };
      const ruleSlots = [
        {
          start: "12:00 UTC",
          end: "13:00 UTC",
          members: ["Alice", "Bob"],
          type: "perfect",
        },
      ];

      // AI returns invalid time format
      const mockAIResponse = {
        slots: [
          {
            start: "12:00", // Missing UTC
            end: "13:00 UTC",
            members: ["Alice", "Bob"],
          },
        ],
        explanation: "12:00 PM works for both Alice and Bob.",
      };

      mockGenerateContent.mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue(JSON.stringify(mockAIResponse)),
        },
      });

      const result = await refineWithGemini(query, availability, ruleSlots);

      // Should fall back to rule-based results due to invalid time format
      expect(result.slots).toEqual(ruleSlots);
      expect(result.explanation).toContain("Note: AI suggestions were invalid");
    });
  });
});

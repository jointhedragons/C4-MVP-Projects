import {
  findMeetingTimes,
  checkHealth,
  validateAvailability,
  getExampleAvailability,
} from "../api";

// Mock fetch globally
global.fetch = jest.fn();

describe("API Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findMeetingTimes", () => {
    test("successfully finds meeting times", async () => {
      const mockResponse = {
        slots: [
          {
            start: "12:00 UTC",
            end: "13:00 UTC",
            members: ["Alice", "Bob"],
            type: "perfect",
          },
        ],
        explanation: "12:00 UTC works for all members.",
        aiRefined: true,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const availability = {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
      };
      const query = "morning meeting";

      const result = await findMeetingTimes(availability, query);

      expect(fetch).toHaveBeenCalledWith("http://localhost:3001/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availability,
          query: "morning meeting",
        }),
      });

      expect(result).toEqual(mockResponse);
    });

    test("handles API errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: "Invalid availability data" }),
      });

      const availability = { invalid: "data" };
      const query = "";

      await expect(findMeetingTimes(availability, query)).rejects.toThrow(
        "Failed to find meeting times: Invalid availability data"
      );
    });

    test("handles network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const availability = {
        Alice: [["09:00", "17:00"]],
      };

      await expect(findMeetingTimes(availability)).rejects.toThrow(
        "Failed to find meeting times: Network error"
      );
    });

    test("trims query parameter", async () => {
      const mockResponse = { slots: [], explanation: "No slots found" };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const availability = {
        Alice: [["09:00", "17:00"]],
      };
      const query = "  morning meeting  ";

      await findMeetingTimes(availability, query);

      expect(fetch).toHaveBeenCalledWith("http://localhost:3001/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availability,
          query: "morning meeting",
        }),
      });
    });

    test("uses custom API URL from environment", async () => {
      const originalEnv = process.env.REACT_APP_API_URL;
      process.env.REACT_APP_API_URL = "https://custom-api.com";

      const mockResponse = { slots: [], explanation: "No slots found" };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const availability = {
        Alice: [["09:00", "17:00"]],
      };

      await findMeetingTimes(availability);

      expect(fetch).toHaveBeenCalledWith(
        "https://custom-api.com/schedule",
        expect.any(Object)
      );

      process.env.REACT_APP_API_URL = originalEnv;
    });
  });

  describe("checkHealth", () => {
    test("successfully checks health status", async () => {
      const mockResponse = {
        status: "OK",
        message: "AI Schedule Planner API is running",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await checkHealth();

      expect(fetch).toHaveBeenCalledWith("http://localhost:3001/health");
      expect(result).toEqual(mockResponse);
    });

    test("handles health check errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(checkHealth()).rejects.toThrow(
        "Backend is not available: Health check failed: 500"
      );
    });

    test("handles network errors during health check", async () => {
      fetch.mockRejectedValueOnce(new Error("Connection refused"));

      await expect(checkHealth()).rejects.toThrow(
        "Backend is not available: Connection refused"
      );
    });
  });

  describe("validateAvailability", () => {
    test("validates correct availability format", () => {
      const availability = {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
      };

      const result = validateAvailability(availability);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("rejects non-object input", () => {
      const result = validateAvailability("invalid");

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Availability must be a JSON object");
    });

    test("rejects empty availability", () => {
      const result = validateAvailability({});

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "At least one team member must be specified"
      );
    });

    test("rejects too many team members", () => {
      const availability = {};
      for (let i = 1; i <= 11; i++) {
        availability[`Person${i}`] = [["09:00", "17:00"]];
      }

      const result = validateAvailability(availability);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Maximum 10 team members allowed for MVP"
      );
    });

    test("rejects empty member names", () => {
      const availability = {
        "": [["09:00", "17:00"]],
      };

      const result = validateAvailability(availability);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Member names cannot be empty");
    });

    test("rejects non-array ranges", () => {
      const availability = {
        Alice: "09:00-17:00",
      };

      const result = validateAvailability(availability);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes("availability must be an array of time ranges")
        )
      ).toBe(true);
    });

    test("rejects empty ranges array", () => {
      const availability = {
        Alice: [],
      };

      const result = validateAvailability(availability);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes("at least one time range must be specified")
        )
      ).toBe(true);
    });

    test("rejects invalid range format", () => {
      const availability = {
        Alice: [["09:00"]], // Missing end time
      };

      const result = validateAvailability(availability);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes("each range must be [start, end] format")
        )
      ).toBe(true);
    });

    test("rejects non-string times", () => {
      const availability = {
        Alice: [[900, 1700]], // Numbers instead of strings
      };

      const result = validateAvailability(availability);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes("start and end times must be strings")
        )
      ).toBe(true);
    });

    test("rejects invalid time format", () => {
      const availability = {
        Alice: [["9:00", "17:00"]], // Missing leading zero
      };

      const result = validateAvailability(availability);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes("times must be in HH:mm format")
        )
      ).toBe(true);
    });

    test("rejects start time after end time", () => {
      const availability = {
        Alice: [["17:00", "09:00"]], // End before start
      };

      const result = validateAvailability(availability);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes("start time must be before end time")
        )
      ).toBe(true);
    });

    test("validates multiple ranges per person", () => {
      const availability = {
        Alice: [
          ["09:00", "12:00"],
          ["14:00", "17:00"],
        ],
        Bob: [["10:00", "13:00"]],
      };

      const result = validateAvailability(availability);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe("getExampleAvailability", () => {
    test("returns example availability data", () => {
      const example = getExampleAvailability();

      expect(example).toEqual({
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
        Charlie: [
          ["08:00", "12:00"],
          ["14:00", "18:00"],
        ],
      });
    });

    test("returns valid availability format", () => {
      const example = getExampleAvailability();
      const validation = validateAvailability(example);

      expect(validation.valid).toBe(true);
    });
  });
});

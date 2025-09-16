const {
  findOverlappingSlots,
  validateAvailability,
  timeToMinutes,
  minutesToTime,
  findRangeOverlap,
} = require("../rules");

describe("Rule-based Scheduling Engine", () => {
  describe("timeToMinutes", () => {
    test("converts time string to minutes correctly", () => {
      expect(timeToMinutes("00:00")).toBe(0);
      expect(timeToMinutes("01:00")).toBe(60);
      expect(timeToMinutes("12:30")).toBe(750);
      expect(timeToMinutes("23:59")).toBe(1439);
    });
  });

  describe("minutesToTime", () => {
    test("converts minutes to time string correctly", () => {
      expect(minutesToTime(0)).toBe("00:00");
      expect(minutesToTime(60)).toBe("01:00");
      expect(minutesToTime(750)).toBe("12:30");
      expect(minutesToTime(1439)).toBe("23:59");
    });
  });

  describe("findRangeOverlap", () => {
    test("finds overlapping time ranges", () => {
      const range1 = ["09:00", "17:00"];
      const range2 = ["12:00", "20:00"];
      const overlap = findRangeOverlap(range1, range2);
      expect(overlap).toEqual(["12:00", "17:00"]);
    });

    test("returns null for non-overlapping ranges", () => {
      const range1 = ["09:00", "12:00"];
      const range2 = ["13:00", "17:00"];
      const overlap = findRangeOverlap(range1, range2);
      expect(overlap).toBeNull();
    });

    test("handles edge case where ranges touch", () => {
      const range1 = ["09:00", "12:00"];
      const range2 = ["12:00", "17:00"];
      const overlap = findRangeOverlap(range1, range2);
      expect(overlap).toBeNull(); // No overlap if they just touch
    });
  });

  describe("findOverlappingSlots", () => {
    test("finds perfect overlap for all members", () => {
      const availability = {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
        Charlie: [["08:00", "16:00"]],
      };

      const slots = findOverlappingSlots(availability);

      // Should find slots where all three are available
      const perfectSlots = slots.filter((slot) => slot.type === "perfect");
      expect(perfectSlots.length).toBeGreaterThan(0);

      // Check that perfect slots include all members
      perfectSlots.forEach((slot) => {
        expect(slot.members).toContain("Alice");
        expect(slot.members).toContain("Bob");
        expect(slot.members).toContain("Charlie");
      });
    });

    test("finds partial overlaps between pairs", () => {
      const availability = {
        Alice: [["09:00", "12:00"]],
        Bob: [["10:00", "13:00"]],
        Charlie: [["14:00", "17:00"]],
      };

      const slots = findOverlappingSlots(availability);

      // Should find partial overlap between Alice and Bob
      const aliceBobSlots = slots.filter(
        (slot) => slot.members.includes("Alice") && slot.members.includes("Bob")
      );
      expect(aliceBobSlots.length).toBeGreaterThan(0);
      expect(aliceBobSlots[0].type).toBe("partial");
    });

    test("handles multiple time ranges per person", () => {
      const availability = {
        Alice: [
          ["09:00", "12:00"],
          ["14:00", "17:00"],
        ],
        Bob: [
          ["10:00", "13:00"],
          ["15:00", "18:00"],
        ],
      };

      const slots = findOverlappingSlots(availability);

      // Should find overlaps in both time ranges
      const morningSlots = slots.filter(
        (slot) => slot.start.includes("10:00") || slot.start.includes("11:00")
      );
      const afternoonSlots = slots.filter(
        (slot) => slot.start.includes("15:00") || slot.start.includes("16:00")
      );

      expect(morningSlots.length).toBeGreaterThan(0);
      expect(afternoonSlots.length).toBeGreaterThan(0);
    });

    test("returns empty array for single person", () => {
      const availability = {
        Alice: [["09:00", "17:00"]],
      };

      const slots = findOverlappingSlots(availability);
      expect(slots).toEqual([]);
    });

    test("returns empty array for no overlaps", () => {
      const availability = {
        Alice: [["09:00", "12:00"]],
        Bob: [["13:00", "17:00"]],
      };

      const slots = findOverlappingSlots(availability);
      expect(slots).toEqual([]);
    });

    test("sorts slots by type (perfect first) then by time", () => {
      const availability = {
        Alice: [["09:00", "17:00"]],
        Bob: [["12:00", "20:00"]],
        Charlie: [
          ["08:00", "12:00"],
          ["14:00", "18:00"],
        ],
      };

      const slots = findOverlappingSlots(availability);

      // Perfect slots should come first
      const perfectSlots = slots.filter((slot) => slot.type === "perfect");
      const partialSlots = slots.filter((slot) => slot.type === "partial");

      if (perfectSlots.length > 0 && partialSlots.length > 0) {
        const firstPerfectIndex = slots.findIndex(
          (slot) => slot.type === "perfect"
        );
        const firstPartialIndex = slots.findIndex(
          (slot) => slot.type === "partial"
        );
        expect(firstPerfectIndex).toBeLessThan(firstPartialIndex);
      }
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
      expect(result.errors).toContain("Availability must be an object");
    });

    test("rejects empty availability", () => {
      const result = validateAvailability({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "At least one team member must be specified"
      );
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

    test("rejects non-array ranges", () => {
      const availability = {
        Alice: "09:00-17:00", // Should be array
      };

      const result = validateAvailability(availability);
      expect(result.valid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes("availability must be an array of time ranges")
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
  });
});

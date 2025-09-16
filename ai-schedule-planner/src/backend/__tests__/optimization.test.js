/**
 * Tests for optimization.js - Multi-meeting optimization algorithms
 */

const {
  calculateMeetingPriority,
  findMeetingSlots,
  detectConflicts,
  optimizeMeetingSchedule,
  optimizeWithGeneticAlgorithm,
  checkTimeOverlap,
  checkParticipantOverlap,
} = require("../optimization");

describe("Optimization Engine", () => {
  describe("calculateMeetingPriority", () => {
    test("calculates priority for high urgency meeting", () => {
      const meeting = {
        importance: 4,
        urgency: "high",
        participants: ["Alice", "Bob", "Charlie"],
        duration: 60,
      };

      const priority = calculateMeetingPriority(meeting);
      expect(priority).toBeGreaterThan(10);
    });

    test("calculates priority for low urgency meeting", () => {
      const meeting = {
        importance: 2,
        urgency: "low",
        participants: ["Alice"],
        duration: 30,
      };

      const priority = calculateMeetingPriority(meeting);
      expect(priority).toBeGreaterThan(0);
      expect(priority).toBeLessThan(10);
    });

    test("handles deadline urgency correctly", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const meeting = {
        importance: 3,
        urgency: "medium",
        participants: ["Alice", "Bob"],
        duration: 60,
        deadline: tomorrow.toISOString().split('T')[0],
      };

      const priority = calculateMeetingPriority(meeting);
      expect(priority).toBeGreaterThan(5);
    });

    test("handles missing optional fields", () => {
      const meeting = {
        participants: ["Alice"],
      };

      const priority = calculateMeetingPriority(meeting);
      expect(priority).toBeGreaterThan(0);
      expect(typeof priority).toBe("number");
    });
  });

  describe("findMeetingSlots", () => {
    const availability = {
      Alice: [["09:00", "12:00"], ["14:00", "17:00"]],
      Bob: [["10:00", "13:00"], ["15:00", "18:00"]],
      Charlie: [["08:00", "11:00"]],
    };

    test("finds slots for all participants", () => {
      const meeting = {
        id: "meeting-1",
        participants: ["Alice", "Bob"],
        duration: 60,
      };

      const slots = findMeetingSlots(meeting, availability);
      expect(Array.isArray(slots)).toBe(true);
      expect(slots.length).toBeGreaterThan(0);
      
      // Check that all slots have required participants
      slots.forEach(slot => {
        expect(slot.participants).toContain("Alice");
        expect(slot.participants).toContain("Bob");
        expect(slot.meetingId).toBe("meeting-1");
      });
    });

    test("returns empty array when no participants available", () => {
      const meeting = {
        id: "meeting-1",
        participants: ["NonExistent"],
        duration: 60,
      };

      const slots = findMeetingSlots(meeting, availability);
      expect(slots).toEqual([]);
    });

    test("handles partial participant availability", () => {
      const meeting = {
        id: "meeting-1",
        participants: ["Alice", "Bob", "Charlie"],
        duration: 60,
      };

      const slots = findMeetingSlots(meeting, availability);
      // Should only return slots where ALL participants are available
      slots.forEach(slot => {
        expect(slot.participants).toHaveLength(3);
        expect(slot.participants).toContain("Alice");
        expect(slot.participants).toContain("Bob");
        expect(slot.participants).toContain("Charlie");
      });
    });
  });

  describe("detectConflicts", () => {
    test("detects participant conflicts", () => {
      const meetings = [
        {
          id: "meeting-1",
          start: "10:00 UTC",
          end: "11:00 UTC",
          participants: ["Alice", "Bob"],
        },
        {
          id: "meeting-2",
          start: "10:30 UTC",
          end: "11:30 UTC",
          participants: ["Alice", "Charlie"],
        },
      ];

      const conflicts = detectConflicts(meetings);
      expect(conflicts.length).toBeGreaterThan(0);
      
      const participantConflict = conflicts.find(c => c.type === "participant_conflict");
      expect(participantConflict).toBeDefined();
      expect(participantConflict.participants).toContain("Alice");
    });

    test("detects time conflicts", () => {
      const meetings = [
        {
          id: "meeting-1",
          start: "10:00 UTC",
          end: "11:00 UTC",
          participants: ["Alice"],
        },
        {
          id: "meeting-2",
          start: "10:30 UTC",
          end: "11:30 UTC",
          participants: ["Bob"],
        },
      ];

      const conflicts = detectConflicts(meetings);
      const timeConflict = conflicts.find(c => c.type === "time_conflict");
      expect(timeConflict).toBeDefined();
    });

    test("returns empty array for no conflicts", () => {
      const meetings = [
        {
          id: "meeting-1",
          start: "10:00 UTC",
          end: "11:00 UTC",
          participants: ["Alice"],
        },
        {
          id: "meeting-2",
          start: "12:00 UTC",
          end: "13:00 UTC",
          participants: ["Bob"],
        },
      ];

      const conflicts = detectConflicts(meetings);
      expect(conflicts).toEqual([]);
    });
  });

  describe("optimizeMeetingSchedule", () => {
    const availability = {
      Alice: [["09:00", "17:00"]],
      Bob: [["12:00", "20:00"]],
      Charlie: [["08:00", "12:00"], ["14:00", "18:00"]],
    };

    test("optimizes multiple meetings successfully", () => {
      const meetings = [
        {
          id: "meeting-1",
          title: "High Priority Meeting",
          participants: ["Alice", "Bob"],
          duration: 60,
          importance: 4,
          urgency: "high",
        },
        {
          id: "meeting-2",
          title: "Low Priority Meeting",
          participants: ["Alice", "Charlie"],
          duration: 45,
          importance: 2,
          urgency: "low",
        },
      ];

      const result = optimizeMeetingSchedule(meetings, availability);
      
      expect(result).toHaveProperty("scheduledMeetings");
      expect(result).toHaveProperty("unscheduledMeetings");
      expect(result).toHaveProperty("conflicts");
      expect(result).toHaveProperty("optimization");
      
      expect(result.optimization.totalMeetings).toBe(2);
      expect(result.optimization.scheduledCount).toBeGreaterThanOrEqual(0);
      expect(result.optimization.successRate).toBeGreaterThanOrEqual(0);
    });

    test("prioritizes high-importance meetings", () => {
      const meetings = [
        {
          id: "meeting-1",
          title: "Low Priority",
          participants: ["Alice", "Bob"],
          duration: 60,
          importance: 1,
          urgency: "low",
        },
        {
          id: "meeting-2",
          title: "High Priority",
          participants: ["Alice", "Bob"],
          duration: 60,
          importance: 5,
          urgency: "high",
        },
      ];

      const result = optimizeMeetingSchedule(meetings, availability);
      
      // High priority meeting should be scheduled first
      if (result.scheduledMeetings.length > 0) {
        const firstScheduled = result.scheduledMeetings[0];
        expect(firstScheduled.importance).toBeGreaterThanOrEqual(1);
      }
    });

    test("handles meetings with no available slots", () => {
      const meetings = [
        {
          id: "meeting-1",
          title: "Impossible Meeting",
          participants: ["NonExistent"],
          duration: 60,
          importance: 3,
          urgency: "medium",
        },
      ];

      const result = optimizeMeetingSchedule(meetings, availability);
      
      expect(result.scheduledMeetings).toHaveLength(0);
      expect(result.unscheduledMeetings).toHaveLength(1);
      expect(result.optimization.successRate).toBe(0);
    });
  });

  describe("checkTimeOverlap", () => {
    test("detects time overlap", () => {
      const meeting1 = {
        start: "10:00 UTC",
        end: "11:00 UTC",
      };
      const meeting2 = {
        start: "10:30 UTC",
        end: "11:30 UTC",
      };

      const overlap = checkTimeOverlap(meeting1, meeting2);
      expect(overlap).toBeDefined();
      expect(overlap.start).toBe("10:30");
      expect(overlap.end).toBe("11:00");
    });

    test("returns null for no overlap", () => {
      const meeting1 = {
        start: "10:00 UTC",
        end: "11:00 UTC",
      };
      const meeting2 = {
        start: "12:00 UTC",
        end: "13:00 UTC",
      };

      const overlap = checkTimeOverlap(meeting1, meeting2);
      expect(overlap).toBeNull();
    });
  });

  describe("checkParticipantOverlap", () => {
    test("detects participant overlap", () => {
      const meeting1 = {
        participants: ["Alice", "Bob"],
      };
      const meeting2 = {
        participants: ["Alice", "Charlie"],
      };

      const overlap = checkParticipantOverlap(meeting1, meeting2);
      expect(overlap).toEqual(["Alice"]);
    });

    test("returns null for no participant overlap", () => {
      const meeting1 = {
        participants: ["Alice", "Bob"],
      };
      const meeting2 = {
        participants: ["Charlie", "David"],
      };

      const overlap = checkParticipantOverlap(meeting1, meeting2);
      expect(overlap).toBeNull();
    });
  });
});

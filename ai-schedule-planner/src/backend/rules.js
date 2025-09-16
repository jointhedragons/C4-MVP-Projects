/**
 * Rule-based scheduling engine
 * Finds overlapping time slots from team availability
 */

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
 * Convert minutes since midnight to time string
 * @param {number} minutes - Minutes since midnight
 * @returns {string} Time in format "HH:mm"
 */
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Check if two time ranges overlap
 * @param {Array} range1 - [start, end] in format ["HH:mm", "HH:mm"]
 * @param {Array} range2 - [start, end] in format ["HH:mm", "HH:mm"]
 * @returns {Array|null} Overlap range or null if no overlap
 */
function findRangeOverlap(range1, range2) {
  const [start1, end1] = range1.map(timeToMinutes);
  const [start2, end2] = range2.map(timeToMinutes);

  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);

  if (overlapStart < overlapEnd) {
    return [minutesToTime(overlapStart), minutesToTime(overlapEnd)];
  }

  return null;
}

/**
 * Find all overlapping time slots for team availability
 * @param {Object} availability - Team availability object
 * @returns {Array} Array of overlapping slots with member information
 */
function findOverlappingSlots(availability) {
  const members = Object.keys(availability);
  const slots = [];

  if (members.length < 2) {
    return slots; // Need at least 2 people for overlap
  }

  // Get all possible member combinations
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const member1 = members[i];
      const member2 = members[j];
      const ranges1 = availability[member1];
      const ranges2 = availability[member2];

      // Check all range combinations between these two members
      for (const range1 of ranges1) {
        for (const range2 of ranges2) {
          const overlap = findRangeOverlap(range1, range2);
          if (overlap) {
            slots.push({
              start: `${overlap[0]} UTC`,
              end: `${overlap[1]} UTC`,
              members: [member1, member2],
              type: "partial",
            });
          }
        }
      }
    }
  }

  // Find slots where all members are available
  const allMemberSlots = [];
  const firstMember = members[0];
  const firstMemberRanges = availability[firstMember];

  for (const range of firstMemberRanges) {
    const [rangeStart, rangeEnd] = range.map(timeToMinutes);

    // Check every 15-minute interval in this range
    for (let time = rangeStart; time < rangeEnd; time += 15) {
      const timeStr = minutesToTime(time);
      const endTimeStr = minutesToTime(time + 60); // 1-hour slots

      // Check if all members are available at this time
      const availableMembers = [];
      for (const member of members) {
        const memberRanges = availability[member];
        const isAvailable = memberRanges.some((memberRange) => {
          const [memberStart, memberEnd] = memberRange.map(timeToMinutes);
          return time >= memberStart && time + 60 <= memberEnd;
        });

        if (isAvailable) {
          availableMembers.push(member);
        }
      }

      if (availableMembers.length === members.length) {
        allMemberSlots.push({
          start: `${timeStr} UTC`,
          end: `${endTimeStr} UTC`,
          members: availableMembers,
          type: "perfect",
        });
      }
    }
  }

  // Combine and deduplicate slots
  const allSlots = [...allMemberSlots, ...slots];
  const uniqueSlots = [];

  for (const slot of allSlots) {
    const isDuplicate = uniqueSlots.some(
      (existing) =>
        existing.start === slot.start &&
        existing.end === slot.end &&
        JSON.stringify(existing.members.sort()) ===
          JSON.stringify(slot.members.sort())
    );

    if (!isDuplicate) {
      uniqueSlots.push(slot);
    }
  }

  // Sort by type (perfect first) then by start time
  return uniqueSlots.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "perfect" ? -1 : 1;
    }
    return a.start.localeCompare(b.start);
  });
}

/**
 * Validate availability data format
 * @param {Object} availability - Team availability object
 * @returns {Object} Validation result
 */
function validateAvailability(availability) {
  const errors = [];

  if (!availability || typeof availability !== "object") {
    errors.push("Availability must be an object");
    return { valid: false, errors };
  }

  const members = Object.keys(availability);
  if (members.length === 0) {
    errors.push("At least one team member must be specified");
  }

  for (const [member, ranges] of Object.entries(availability)) {
    if (!Array.isArray(ranges)) {
      errors.push(`${member}: availability must be an array of time ranges`);
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
      const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(start) || !timeRegex.test(end)) {
        errors.push(`${member}: times must be in HH:mm format (e.g., "09:00")`);
        continue;
      }

      // Validate start < end
      if (timeToMinutes(start) >= timeToMinutes(end)) {
        errors.push(`${member}: start time must be before end time`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  findOverlappingSlots,
  validateAvailability,
  timeToMinutes,
  minutesToTime,
  findRangeOverlap,
};

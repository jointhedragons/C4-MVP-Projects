/**
 * Multi-Meeting Optimization Engine
 * Maximizes the number of meetings that can be scheduled given constraints
 */

/**
 * Calculate meeting priority score
 * @param {Object} meeting - Meeting object with details
 * @returns {number} Priority score (higher = more important)
 */
function calculateMeetingPriority(meeting) {
  let score = 0;

  // Base score from meeting importance
  score += meeting.importance || 1;

  // Urgency multiplier
  if (meeting.urgency === "high") score *= 3;
  else if (meeting.urgency === "medium") score *= 2;
  else if (meeting.urgency === "low") score *= 1;

  // Participant count bonus (more people = higher priority)
  score += meeting.participants.length * 0.5;

  // Duration penalty (longer meetings = lower priority per hour)
  const duration = meeting.duration || 60; // minutes
  score *= 60 / duration; // Normalize to 1-hour meetings

  // Deadline urgency
  if (meeting.deadline) {
    const daysUntilDeadline =
      (new Date(meeting.deadline) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysUntilDeadline < 1) score *= 5; // Very urgent
    else if (daysUntilDeadline < 3) score *= 3; // Urgent
    else if (daysUntilDeadline < 7) score *= 2; // Soon
  }

  return Math.round(score * 100) / 100; // Round to 2 decimal places
}

/**
 * Find all possible time slots for a meeting
 * @param {Object} meeting - Meeting object
 * @param {Object} availability - Team availability data
 * @returns {Array} Array of possible time slots
 */
function findMeetingSlots(meeting, availability) {
  const { participants, duration = 60 } = meeting;
  const slots = [];

  // Get availability for all participants
  const participantAvailability = {};
  for (const participant of participants) {
    if (availability[participant]) {
      participantAvailability[participant] = availability[participant];
    }
  }

  // Find overlapping time ranges for all participants
  const allRanges = Object.values(participantAvailability).flat();

  // Check every 15-minute interval for the required duration
  for (const range of allRanges) {
    const [startTime, endTime] = range.map(timeToMinutes);

    for (let time = startTime; time <= endTime - duration; time += 15) {
      const slotStart = minutesToTime(time);
      const slotEnd = minutesToTime(time + duration);

      // Check if all participants are available for this slot
      const availableParticipants = [];
      for (const participant of participants) {
        const isAvailable = availability[participant]?.some((range) => {
          const [rangeStart, rangeEnd] = range.map(timeToMinutes);
          return time >= rangeStart && time + duration <= rangeEnd;
        });

        if (isAvailable) {
          availableParticipants.push(participant);
        }
      }

      // Only include slots where ALL participants are available
      if (availableParticipants.length === participants.length) {
        slots.push({
          start: `${slotStart} UTC`,
          end: `${slotEnd} UTC`,
          participants: availableParticipants,
          meetingId: meeting.id,
          priority: calculateMeetingPriority(meeting),
        });
      }
    }
  }

  return slots;
}

/**
 * Detect conflicts between meetings
 * @param {Array} meetings - Array of scheduled meetings
 * @returns {Array} Array of conflict objects
 */
function detectConflicts(meetings) {
  const conflicts = [];

  for (let i = 0; i < meetings.length; i++) {
    for (let j = i + 1; j < meetings.length; j++) {
      const meeting1 = meetings[i];
      const meeting2 = meetings[j];

      // Check for time overlap
      const timeConflict = checkTimeOverlap(meeting1, meeting2);

      // Check for participant overlap
      const participantConflict = checkParticipantOverlap(meeting1, meeting2);

      if (timeConflict && participantConflict) {
        conflicts.push({
          type: "participant_conflict",
          meetings: [meeting1.id, meeting2.id],
          participants: participantConflict,
          timeOverlap: timeConflict,
          severity: "high",
        });
      } else if (timeConflict) {
        conflicts.push({
          type: "time_conflict",
          meetings: [meeting1.id, meeting2.id],
          timeOverlap: timeConflict,
          severity: "medium",
        });
      }
    }
  }

  return conflicts;
}

/**
 * Check if two meetings have time overlap
 * @param {Object} meeting1 - First meeting
 * @param {Object} meeting2 - Second meeting
 * @returns {Object|null} Overlap details or null
 */
function checkTimeOverlap(meeting1, meeting2) {
  const start1 = timeToMinutes(meeting1.start.replace(" UTC", ""));
  const end1 = timeToMinutes(meeting1.end.replace(" UTC", ""));
  const start2 = timeToMinutes(meeting2.start.replace(" UTC", ""));
  const end2 = timeToMinutes(meeting2.end.replace(" UTC", ""));

  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);

  if (overlapStart < overlapEnd) {
    return {
      start: minutesToTime(overlapStart),
      end: minutesToTime(overlapEnd),
      duration: overlapEnd - overlapStart,
    };
  }

  return null;
}

/**
 * Check if two meetings have participant overlap
 * @param {Object} meeting1 - First meeting
 * @param {Object} meeting2 - Second meeting
 * @returns {Array|null} Overlapping participants or null
 */
function checkParticipantOverlap(meeting1, meeting2) {
  const participants1 = new Set(meeting1.participants);
  const participants2 = new Set(meeting2.participants);
  const overlap = [...participants1].filter((p) => participants2.has(p));

  return overlap.length > 0 ? overlap : null;
}

/**
 * Optimize meeting schedule to maximize total meetings
 * @param {Array} meetings - Array of meeting requests
 * @param {Object} availability - Team availability data
 * @returns {Object} Optimization result
 */
function optimizeMeetingSchedule(meetings, availability) {
  // Calculate priority scores for all meetings
  const meetingsWithPriority = meetings.map((meeting) => ({
    ...meeting,
    priority: calculateMeetingPriority(meeting),
  }));

  // Sort by priority (highest first)
  meetingsWithPriority.sort((a, b) => b.priority - a.priority);

  // Find all possible slots for each meeting
  const meetingSlots = {};
  for (const meeting of meetingsWithPriority) {
    meetingSlots[meeting.id] = findMeetingSlots(meeting, availability);
  }

  // Greedy optimization: schedule highest priority meetings first
  const scheduledMeetings = [];
  const usedSlots = new Set();
  const conflicts = [];

  for (const meeting of meetingsWithPriority) {
    const slots = meetingSlots[meeting.id];

    // Find the best available slot for this meeting
    let bestSlot = null;
    for (const slot of slots) {
      const slotKey = `${slot.start}-${slot.end}`;

      if (!usedSlots.has(slotKey)) {
        // Check for conflicts with already scheduled meetings
        const hasConflict = scheduledMeetings.some((scheduled) => {
          const timeConflict = checkTimeOverlap(slot, scheduled);
          const participantConflict = checkParticipantOverlap(slot, scheduled);
          return timeConflict && participantConflict;
        });

        if (!hasConflict) {
          bestSlot = slot;
          break;
        }
      }
    }

    if (bestSlot) {
      // Schedule the meeting
      const scheduledMeeting = {
        ...meeting,
        start: bestSlot.start,
        end: bestSlot.end,
        scheduled: true,
      };

      scheduledMeetings.push(scheduledMeeting);
      usedSlots.add(`${bestSlot.start}-${bestSlot.end}`);
    } else {
      // Meeting couldn't be scheduled
      conflicts.push({
        meetingId: meeting.id,
        reason: "no_available_slots",
        priority: meeting.priority,
      });
    }
  }

  // Detect remaining conflicts
  const detectedConflicts = detectConflicts(scheduledMeetings);

  return {
    scheduledMeetings,
    unscheduledMeetings: meetingsWithPriority.filter(
      (m) => !scheduledMeetings.find((s) => s.id === m.id)
    ),
    conflicts: [...conflicts, ...detectedConflicts],
    optimization: {
      totalMeetings: meetings.length,
      scheduledCount: scheduledMeetings.length,
      successRate: Math.round(
        (scheduledMeetings.length / meetings.length) * 100
      ),
      totalPriorityScore: scheduledMeetings.reduce(
        (sum, m) => sum + m.priority,
        0
      ),
    },
  };
}

/**
 * Alternative optimization using genetic algorithm approach
 * @param {Array} meetings - Array of meeting requests
 * @param {Object} availability - Team availability data
 * @param {Object} options - Optimization options
 * @returns {Object} Optimization result
 */
function optimizeWithGeneticAlgorithm(meetings, availability, options = {}) {
  const {
    populationSize = 50,
    generations = 100,
    mutationRate = 0.1,
    crossoverRate = 0.8,
  } = options;

  // Generate initial population of random schedules
  let population = [];
  for (let i = 0; i < populationSize; i++) {
    population.push(generateRandomSchedule(meetings, availability));
  }

  // Evolve the population
  for (let generation = 0; generation < generations; generation++) {
    // Evaluate fitness of each schedule
    population = population.map((schedule) => ({
      ...schedule,
      fitness: evaluateScheduleFitness(schedule),
    }));

    // Sort by fitness (higher is better)
    population.sort((a, b) => b.fitness - a.fitness);

    // Create next generation
    const nextGeneration = [];

    // Keep top 20% (elitism)
    const eliteCount = Math.floor(populationSize * 0.2);
    nextGeneration.push(...population.slice(0, eliteCount));

    // Generate offspring through crossover and mutation
    while (nextGeneration.length < populationSize) {
      const parent1 = selectParent(population);
      const parent2 = selectParent(population);

      if (Math.random() < crossoverRate) {
        const offspring = crossover(parent1, parent2);
        if (Math.random() < mutationRate) {
          mutate(offspring, meetings, availability);
        }
        nextGeneration.push(offspring);
      }
    }

    population = nextGeneration;
  }

  // Return the best schedule
  const bestSchedule = population[0];
  return {
    scheduledMeetings: bestSchedule.meetings.filter((m) => m.scheduled),
    unscheduledMeetings: bestSchedule.meetings.filter((m) => !m.scheduled),
    conflicts: bestSchedule.conflicts,
    optimization: {
      algorithm: "genetic",
      fitness: bestSchedule.fitness,
      generations: generations,
    },
  };
}

/**
 * Generate a random schedule for genetic algorithm
 * @param {Array} meetings - Array of meetings
 * @param {Object} availability - Team availability
 * @returns {Object} Random schedule
 */
function generateRandomSchedule(meetings, availability) {
  const scheduledMeetings = [];
  const conflicts = [];

  // Randomly shuffle meetings
  const shuffledMeetings = [...meetings].sort(() => Math.random() - 0.5);

  for (const meeting of shuffledMeetings) {
    const slots = findMeetingSlots(meeting, availability);

    if (slots.length > 0) {
      // Randomly select a slot
      const randomSlot = slots[Math.floor(Math.random() * slots.length)];

      const scheduledMeeting = {
        ...meeting,
        start: randomSlot.start,
        end: randomSlot.end,
        scheduled: true,
      };

      scheduledMeetings.push(scheduledMeeting);
    }
  }

  // Detect conflicts
  const detectedConflicts = detectConflicts(scheduledMeetings);

  return {
    meetings: scheduledMeetings,
    conflicts: detectedConflicts,
    fitness: 0, // Will be calculated later
  };
}

/**
 * Evaluate fitness of a schedule
 * @param {Object} schedule - Schedule to evaluate
 * @returns {number} Fitness score
 */
function evaluateScheduleFitness(schedule) {
  let fitness = 0;

  // Reward for scheduled meetings
  fitness += schedule.meetings.filter((m) => m.scheduled).length * 100;

  // Reward for high-priority meetings
  fitness += schedule.meetings
    .filter((m) => m.scheduled)
    .reduce((sum, m) => sum + (m.priority || 1) * 50, 0);

  // Penalty for conflicts
  fitness -= schedule.conflicts.length * 200;

  // Penalty for high-severity conflicts
  fitness -=
    schedule.conflicts.filter((c) => c.severity === "high").length * 500;

  return fitness;
}

/**
 * Select parent for genetic algorithm (tournament selection)
 * @param {Array} population - Current population
 * @returns {Object} Selected parent
 */
function selectParent(population) {
  const tournamentSize = 3;
  const tournament = [];

  for (let i = 0; i < tournamentSize; i++) {
    tournament.push(population[Math.floor(Math.random() * population.length)]);
  }

  return tournament.reduce((best, current) =>
    current.fitness > best.fitness ? current : best
  );
}

/**
 * Crossover two schedules to create offspring
 * @param {Object} parent1 - First parent
 * @param {Object} parent2 - Second parent
 * @returns {Object} Offspring schedule
 */
function crossover(parent1, parent2) {
  // Simple one-point crossover
  const meetings1 = parent1.meetings;
  const meetings2 = parent2.meetings;

  const crossoverPoint = Math.floor(meetings1.length / 2);

  const offspringMeetings = [
    ...meetings1.slice(0, crossoverPoint),
    ...meetings2.slice(crossoverPoint),
  ];

  return {
    meetings: offspringMeetings,
    conflicts: [],
    fitness: 0,
  };
}

/**
 * Mutate a schedule
 * @param {Object} schedule - Schedule to mutate
 * @param {Array} meetings - Original meetings
 * @param {Object} availability - Team availability
 */
function mutate(schedule, meetings, availability) {
  // Randomly reschedule some meetings
  const meetingsToMutate = Math.floor(schedule.meetings.length * 0.1);

  for (let i = 0; i < meetingsToMutate; i++) {
    const randomIndex = Math.floor(Math.random() * schedule.meetings.length);
    const meeting = schedule.meetings[randomIndex];

    const slots = findMeetingSlots(meeting, availability);
    if (slots.length > 0) {
      const randomSlot = slots[Math.floor(Math.random() * slots.length)];
      meeting.start = randomSlot.start;
      meeting.end = randomSlot.end;
    }
  }
}

// Helper functions (imported from rules.js)
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

module.exports = {
  calculateMeetingPriority,
  findMeetingSlots,
  detectConflicts,
  optimizeMeetingSchedule,
  optimizeWithGeneticAlgorithm,
  checkTimeOverlap,
  checkParticipantOverlap,
};

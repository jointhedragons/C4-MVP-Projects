# Multi-Meeting Optimization Test Scenarios

This document provides comprehensive test scenarios to demonstrate and validate the AI Schedule Planner's multi-meeting optimization capabilities.

## 🚀 Quick Start Testing

### Prerequisites

1. Backend server running on `http://localhost:3001`
2. Frontend server running on `http://localhost:3000` (optional for API testing)

### Quick Test

```bash
# Run a simple test
node quick-test.js

# Run comprehensive test suite
node test-examples.js
```

## 📋 Test Scenarios

### Scenario 1: Simple Multi-Meeting

**Purpose**: Test basic multi-meeting optimization with minimal complexity

**Input**:

- 2 meetings with overlapping participants
- Simple availability patterns
- Greedy algorithm

**Expected Results**:

- Both meetings scheduled successfully
- 100% success rate
- No conflicts detected

**Test Data**:

```json
{
  "meetings": [
    {
      "id": "meeting-1",
      "title": "Product Planning",
      "participants": ["Alice", "Bob"],
      "duration": 60,
      "importance": 4,
      "urgency": "high"
    },
    {
      "id": "meeting-2",
      "title": "Team Standup",
      "participants": ["Alice", "Charlie"],
      "duration": 30,
      "importance": 3,
      "urgency": "medium"
    }
  ],
  "availability": {
    "Alice": [["09:00", "17:00"]],
    "Bob": [["10:00", "16:00"]],
    "Charlie": [
      ["08:00", "12:00"],
      ["14:00", "18:00"]
    ]
  }
}
```

### Scenario 2: Complex Multi-Meeting with Conflicts

**Purpose**: Test optimization with multiple constraints and potential conflicts

**Input**:

- 4 meetings with complex participant overlap
- Varied availability patterns
- Genetic algorithm for complex optimization

**Expected Results**:

- High success rate (80%+)
- Some meetings may be unscheduled due to conflicts
- Conflict detection working properly

**Test Data**:

```json
{
  "meetings": [
    {
      "id": "meeting-1",
      "title": "Product Planning",
      "participants": ["Alice", "Bob", "Charlie"],
      "duration": 90,
      "importance": 5,
      "urgency": "high"
    },
    {
      "id": "meeting-2",
      "title": "Team Standup",
      "participants": ["Alice", "Bob"],
      "duration": 30,
      "importance": 3,
      "urgency": "medium"
    },
    {
      "id": "meeting-3",
      "title": "Client Review",
      "participants": ["Charlie", "David"],
      "duration": 60,
      "importance": 4,
      "urgency": "high"
    },
    {
      "id": "meeting-4",
      "title": "Sprint Retrospective",
      "participants": ["Alice", "Charlie", "Eve"],
      "duration": 60,
      "importance": 3,
      "urgency": "low"
    }
  ],
  "availability": {
    "Alice": [
      ["09:00", "12:00"],
      ["14:00", "17:00"]
    ],
    "Bob": [["10:00", "16:00"]],
    "Charlie": [
      ["08:00", "11:00"],
      ["13:00", "18:00"]
    ],
    "David": [["13:00", "17:00"]],
    "Eve": [["09:00", "15:00"]]
  }
}
```

### Scenario 3: AI-Enhanced Optimization

**Purpose**: Test AI integration with natural language queries

**Input**:

- 3 meetings with specific scheduling preferences
- Natural language query for optimization
- AI enhancement enabled

**Expected Results**:

- AI provides intelligent suggestions
- Natural language preferences considered
- Enhanced explanations provided

**Test Data**:

```json
{
  "meetings": [
    {
      "id": "meeting-1",
      "title": "Morning Standup",
      "participants": ["Alice", "Bob", "Charlie"],
      "duration": 30,
      "importance": 4,
      "urgency": "high"
    },
    {
      "id": "meeting-2",
      "title": "Client Presentation",
      "participants": ["Alice", "David"],
      "duration": 60,
      "importance": 5,
      "urgency": "high"
    },
    {
      "id": "meeting-3",
      "title": "Code Review",
      "participants": ["Bob", "Charlie"],
      "duration": 45,
      "importance": 3,
      "urgency": "medium"
    }
  ],
  "availability": {
    "Alice": [["09:00", "17:00"]],
    "Bob": [["10:00", "16:00"]],
    "Charlie": [
      ["08:00", "12:00"],
      ["14:00", "18:00"]
    ],
    "David": [["13:00", "17:00"]]
  },
  "query": "morning standup first, then client presentation, flexible for code review"
}
```

### Scenario 4: Algorithm Comparison

**Purpose**: Compare Greedy vs Genetic algorithm performance

**Input**:

- 5 meetings with complex constraints
- Same data for both algorithms
- Performance metrics comparison

**Expected Results**:

- Both algorithms achieve high success rates
- Genetic algorithm may perform better on complex scenarios
- Performance metrics recorded

### Scenario 5: Conflict Analysis

**Purpose**: Test conflict detection and analysis capabilities

**Input**:

- Meetings with known conflicts
- Conflict analysis API endpoint
- Detailed conflict reporting

**Expected Results**:

- All conflicts detected accurately
- Detailed conflict descriptions
- Actionable recommendations provided

### Scenario 6: Optimization Suggestions

**Purpose**: Test AI-powered optimization suggestions

**Input**:

- Suboptimal meeting configuration
- Optimization suggestions API
- AI-generated recommendations

**Expected Results**:

- Specific optimization suggestions
- Meeting-level and schedule-level recommendations
- Actionable improvement strategies

## 🧪 API Testing

### Endpoints to Test

1. **POST /schedule/multi-meeting**

   - Multi-meeting optimization
   - Algorithm selection (greedy/genetic)
   - AI enhancement with queries

2. **POST /analyze/conflicts**

   - Conflict detection and analysis
   - Detailed conflict reporting
   - Recommendations generation

3. **POST /optimize/suggestions**
   - AI-powered optimization suggestions
   - Meeting and schedule improvements
   - Actionable recommendations

### Test Commands

```bash
# Test single endpoint
curl -X POST http://localhost:3001/schedule/multi-meeting \
  -H "Content-Type: application/json" \
  -d @test-data.json

# Test conflict analysis
curl -X POST http://localhost:3001/analyze/conflicts \
  -H "Content-Type: application/json" \
  -d @conflict-test.json

# Test optimization suggestions
curl -X POST http://localhost:3001/optimize/suggestions \
  -H "Content-Type: application/json" \
  -d @suggestions-test.json
```

## 📊 Performance Benchmarks

### Expected Performance Metrics

| Metric                 | Target    | Test Scenarios       |
| ---------------------- | --------- | -------------------- |
| **Response Time**      | <1 second | All scenarios        |
| **Success Rate**       | >90%      | Simple scenarios     |
| **Success Rate**       | >80%      | Complex scenarios    |
| **Conflict Detection** | 100%      | All scenarios        |
| **AI Enhancement**     | >80%      | AI-enabled scenarios |

### Load Testing

```bash
# Test with multiple concurrent requests
for i in {1..10}; do
  node quick-test.js &
done
wait
```

## 🐛 Error Scenarios

### Invalid Input Testing

1. **Missing Required Fields**

   - Empty meetings array
   - Missing participants
   - Invalid time formats

2. **Invalid Data Types**

   - Non-numeric duration
   - Invalid urgency values
   - Malformed availability

3. **Edge Cases**
   - Zero participants
   - Negative duration
   - Overlapping time ranges

### Expected Error Handling

- Graceful error messages
- Input validation
- Fallback to rule-based results
- No application crashes

## 📈 Success Criteria

### Functional Requirements

- ✅ All meetings scheduled when possible
- ✅ Conflicts detected and reported
- ✅ AI suggestions provided when enabled
- ✅ Algorithm selection working correctly

### Performance Requirements

- ✅ Response time <1 second
- ✅ High success rates (>80%)
- ✅ Accurate conflict detection (100%)
- ✅ Reliable AI integration

### Quality Requirements

- ✅ Comprehensive error handling
- ✅ Clear result explanations
- ✅ Actionable recommendations
- ✅ Consistent API responses

## 🔧 Troubleshooting

### Common Issues

1. **Backend Not Running**

   ```bash
   cd src/backend && node index.js
   ```

2. **API Key Missing**

   - Check `.env` file in backend directory
   - Verify GEMINI_API_KEY is set

3. **Port Conflicts**

   - Ensure ports 3000 and 3001 are available
   - Kill existing processes if needed

4. **Test Failures**
   - Check server logs for errors
   - Verify test data format
   - Ensure all dependencies installed

### Debug Mode

```bash
# Enable debug logging
DEBUG=* node test-examples.js

# Verbose API testing
curl -v -X POST http://localhost:3001/schedule/multi-meeting \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

---

_These test scenarios provide comprehensive coverage of the AI Schedule Planner's multi-meeting optimization capabilities and ensure reliable performance across various use cases._

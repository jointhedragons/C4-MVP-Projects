# JSON Test Examples Guide

This guide provides ready-to-use JSON examples for testing the AI Schedule Planner's multi-meeting optimization capabilities.

## 📁 Available Test Files

### 1. **simple-multi-meeting.json**

- **Purpose**: Basic multi-meeting test with 2 meetings
- **Complexity**: Low
- **Expected**: 100% success rate
- **Algorithm**: Greedy

### 2. **complex-multi-meeting.json**

- **Purpose**: Complex scenario with 4 meetings and conflicts
- **Complexity**: High
- **Expected**: 80%+ success rate, some conflicts
- **Algorithm**: Genetic

### 3. **ai-enhanced.json**

- **Purpose**: Test AI integration with natural language
- **Complexity**: Medium
- **Expected**: AI-enhanced suggestions
- **Algorithm**: Greedy

### 4. **algorithm-comparison.json**

- **Purpose**: Compare Greedy vs Genetic algorithms
- **Complexity**: High
- **Expected**: Both algorithms perform well
- **Algorithm**: Configurable

### 5. **conflict-analysis.json**

- **Purpose**: Test conflict detection capabilities
- **Complexity**: Medium
- **Expected**: Detailed conflict analysis
- **Algorithm**: N/A (analysis only)

### 6. **optimization-suggestions.json**

- **Purpose**: Test AI optimization suggestions
- **Complexity**: Medium
- **Expected**: Specific improvement recommendations
- **Algorithm**: N/A (suggestions only)

### 7. **single-team.json**

- **Purpose**: Test single team scheduling
- **Complexity**: Low
- **Expected**: Time slot discovery
- **Algorithm**: Rule-based + AI

### 8. **extreme-scenario.json**

- **Purpose**: Stress test with 6 meetings and 8 participants
- **Complexity**: Extreme
- **Expected**: Challenging optimization scenario
- **Algorithm**: Genetic

## 🚀 How to Use

### Method 1: Using the Test Script

```bash
# Test a specific JSON file
node test-json.js simple-multi-meeting.json

# Test complex scenario
node test-json.js complex-multi-meeting.json

# Test AI enhancement
node test-json.js ai-enhanced.json

# Test extreme scenario
node test-json.js extreme-scenario.json
```

### Method 2: Using curl

```bash
# Multi-meeting optimization
curl -X POST http://localhost:3001/schedule/multi-meeting \
  -H "Content-Type: application/json" \
  -d @test-data/simple-multi-meeting.json

# Single team scheduling
curl -X POST http://localhost:3001/schedule \
  -H "Content-Type: application/json" \
  -d @test-data/single-team.json

# Conflict analysis
curl -X POST http://localhost:3001/analyze/conflicts \
  -H "Content-Type: application/json" \
  -d @test-data/conflict-analysis.json

# Optimization suggestions
curl -X POST http://localhost:3001/optimize/suggestions \
  -H "Content-Type: application/json" \
  -d @test-data/optimization-suggestions.json
```

### Method 3: Using Postman or API Client

1. Set method to `POST`
2. Set URL to `http://localhost:3001/schedule/multi-meeting`
3. Set headers: `Content-Type: application/json`
4. Copy JSON content from any test file
5. Send request

## 📊 Expected Results

### Simple Multi-Meeting

```json
{
  "optimization": {
    "scheduledCount": 2,
    "successRate": 100,
    "totalPriorityScore": 7.0
  },
  "scheduledMeetings": [
    {
      "title": "Product Planning",
      "start": "10:00 UTC",
      "end": "11:00 UTC"
    },
    {
      "title": "Team Standup",
      "start": "14:00 UTC",
      "end": "14:30 UTC"
    }
  ]
}
```

### Complex Multi-Meeting

```json
{
  "optimization": {
    "scheduledCount": 3,
    "unscheduledCount": 1,
    "successRate": 75,
    "totalPriorityScore": 12.0
  },
  "conflicts": [
    {
      "type": "participant_conflict",
      "description": "Alice is scheduled for multiple meetings"
    }
  ]
}
```

## 🧪 Test Scenarios

### Scenario 1: Basic Functionality

```bash
node test-json.js simple-multi-meeting.json
```

**Expected**: Both meetings scheduled, 100% success rate

### Scenario 2: Conflict Handling

```bash
node test-json.js complex-multi-meeting.json
```

**Expected**: Some meetings unscheduled due to conflicts

### Scenario 3: AI Enhancement

```bash
node test-json.js ai-enhanced.json
```

**Expected**: AI provides intelligent suggestions and explanations

### Scenario 4: Algorithm Comparison

```bash
# Test with Greedy
node test-json.js algorithm-comparison.json

# Edit the JSON to use genetic algorithm
# Change "optimizationMethod": "genetic"
node test-json.js algorithm-comparison.json
```

**Expected**: Both algorithms achieve good results

### Scenario 5: Stress Testing

```bash
node test-json.js extreme-scenario.json
```

**Expected**: Challenging optimization with multiple constraints

## 🔧 Customizing Tests

### Modify Meeting Data

```json
{
  "id": "custom-meeting",
  "title": "Your Meeting Title",
  "participants": ["Person1", "Person2"],
  "duration": 60,
  "importance": 4,
  "urgency": "high"
}
```

### Modify Availability

```json
{
  "Person1": [
    ["09:00", "12:00"],
    ["14:00", "17:00"]
  ],
  "Person2": [["10:00", "16:00"]]
}
```

### Modify AI Query

```json
{
  "query": "urgent meetings first, flexible for others"
}
```

### Change Algorithm

```json
{
  "optimizationMethod": "genetic" // or "greedy"
}
```

## 📈 Performance Testing

### Load Testing

```bash
# Run multiple tests in parallel
for i in {1..5}; do
  node test-json.js simple-multi-meeting.json &
done
wait
```

### Benchmarking

```bash
# Time the response
time node test-json.js complex-multi-meeting.json
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend Not Running**

   ```bash
   cd src/backend && node index.js
   ```

2. **Invalid JSON Format**

   - Validate JSON syntax
   - Check required fields

3. **API Key Missing**

   - Ensure GEMINI_API_KEY is set in .env file

4. **Port Conflicts**
   - Make sure port 3001 is available

### Debug Mode

```bash
# Enable verbose output
DEBUG=* node test-json.js simple-multi-meeting.json
```

## 📋 Test Checklist

- [ ] Simple multi-meeting works (100% success)
- [ ] Complex multi-meeting handles conflicts
- [ ] AI enhancement provides suggestions
- [ ] Both algorithms work correctly
- [ ] Conflict analysis detects issues
- [ ] Optimization suggestions are helpful
- [ ] Single team scheduling works
- [ ] Extreme scenario handles complexity
- [ ] Response times are <1 second
- [ ] Error handling works properly

---

_These JSON examples provide comprehensive testing coverage for all AI Schedule Planner features and can be used for demonstrations, development, and validation._

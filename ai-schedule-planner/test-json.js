#!/usr/bin/env node

/**
 * Test JSON Examples for AI Schedule Planner
 *
 * Usage: node test-json.js [filename]
 * Example: node test-json.js simple-multi-meeting.json
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

// Get the JSON file to test
const filename = process.argv[2] || "simple-multi-meeting.json";
const filepath = path.join(__dirname, "test-data", filename);

// Check if file exists
if (!fs.existsSync(filepath)) {
  console.log("❌ File not found:", filepath);
  console.log("\nAvailable test files:");
  const testDir = path.join(__dirname, "test-data");
  if (fs.existsSync(testDir)) {
    const files = fs.readdirSync(testDir).filter((f) => f.endsWith(".json"));
    files.forEach((file) => console.log(`   • ${file}`));
  }
  process.exit(1);
}

// Read and parse the JSON file
let testData;
try {
  const fileContent = fs.readFileSync(filepath, "utf8");
  testData = JSON.parse(fileContent);
  console.log(`🚀 Testing: ${filename}`);
  console.log("=".repeat(50));
} catch (error) {
  console.log("❌ Error reading JSON file:", error.message);
  process.exit(1);
}

// Determine which endpoint to use based on the data structure
let endpoint;
if (testData.meetings) {
  if (testData.meetings.length > 1) {
    endpoint = "/schedule/multi-meeting";
    console.log("📊 Multi-Meeting Optimization Test");
  } else {
    endpoint = "/schedule/multi-meeting";
    console.log("📊 Single Meeting Test (via multi-meeting endpoint)");
  }
} else if (testData.availability && !testData.meetings) {
  endpoint = "/schedule";
  console.log("📊 Single Team Scheduling Test");
} else {
  console.log("❌ Invalid test data format");
  process.exit(1);
}

// Make the API call
const postData = JSON.stringify(testData);

const options = {
  hostname: "localhost",
  port: 3001,
  path: endpoint,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
  },
};

console.log(`📡 Calling: POST ${endpoint}`);
console.log("⏳ Sending request...\n");

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const result = JSON.parse(data);

      console.log("✅ Response received!");
      console.log(`📊 Status: ${res.statusCode}`);
      console.log("=".repeat(50));

      // Display results based on endpoint
      if (endpoint === "/schedule/multi-meeting") {
        console.log("📈 Optimization Results:");
        console.log(
          `   Scheduled: ${result.optimization?.scheduledCount || 0} meetings`
        );
        console.log(
          `   Unscheduled: ${
            result.optimization?.unscheduledCount || 0
          } meetings`
        );
        console.log(
          `   Success Rate: ${result.optimization?.successRate || 0}%`
        );
        console.log(
          `   Total Priority Score: ${
            result.optimization?.totalPriorityScore || 0
          }`
        );
        console.log(`   Conflicts: ${result.conflicts?.length || 0}`);

        if (result.scheduledMeetings?.length > 0) {
          console.log("\n📅 Scheduled Meetings:");
          result.scheduledMeetings.forEach((meeting) => {
            console.log(
              `   • ${meeting.title}: ${meeting.start} - ${meeting.end}`
            );
            console.log(
              `     Participants: ${meeting.participants.join(", ")}`
            );
            console.log(`     Priority: ${meeting.priority || "N/A"}`);
          });
        }

        if (result.unscheduledMeetings?.length > 0) {
          console.log("\n❌ Unscheduled Meetings:");
          result.unscheduledMeetings.forEach((meeting) => {
            console.log(
              `   • ${meeting.title}: ${meeting.reason || "No available slots"}`
            );
          });
        }

        if (result.explanation) {
          console.log("\n💬 Explanation:");
          console.log(`   ${result.explanation}`);
        }
      } else if (endpoint === "/schedule") {
        console.log("📈 Scheduling Results:");
        console.log(`   Slots Found: ${result.slots?.length || 0}`);
        console.log(`   AI Enhanced: ${result.aiRefined ? "Yes" : "No"}`);

        if (result.slots?.length > 0) {
          console.log("\n⏰ Available Time Slots:");
          result.slots.forEach((slot, index) => {
            console.log(`   ${index + 1}. ${slot.start} - ${slot.end}`);
            console.log(`      Members: ${slot.members.join(", ")}`);
            console.log(`      Type: ${slot.type}`);
          });
        }

        if (result.explanation) {
          console.log("\n💬 Explanation:");
          console.log(`   ${result.explanation}`);
        }
      }

      console.log("\n🎉 Test completed successfully!");
    } catch (error) {
      console.log("❌ Error parsing response:", error.message);
      console.log("Raw response:", data.substring(0, 200) + "...");
    }
  });
});

req.on("error", (error) => {
  console.log("❌ Request failed:", error.message);
  console.log(
    "Make sure the backend server is running on http://localhost:3001"
  );
});

req.write(postData);
req.end();

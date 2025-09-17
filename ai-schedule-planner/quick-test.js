#!/usr/bin/env node

/**
 * Quick Test Examples for AI Schedule Planner
 *
 * Simple examples to quickly test multi-meeting optimization
 * Run with: node quick-test.js
 */

const http = require("http");

// Quick test function
async function quickTest() {
  console.log("🚀 Quick Multi-Meeting Test");
  console.log("=".repeat(40));

  const testData = {
    meetings: [
      {
        id: "meeting-1",
        title: "Product Planning",
        participants: ["Alice", "Bob"],
        duration: 60,
        importance: 4,
        urgency: "high",
      },
      {
        id: "meeting-2",
        title: "Team Standup",
        participants: ["Alice", "Charlie"],
        duration: 30,
        importance: 3,
        urgency: "medium",
      },
    ],
    availability: {
      Alice: [["09:00", "17:00"]],
      Bob: [["10:00", "16:00"]],
      Charlie: [
        ["08:00", "12:00"],
        ["14:00", "18:00"],
      ],
    },
    query: "morning meetings preferred",
    optimizationMethod: "greedy",
  };

  const postData = JSON.stringify(testData);

  const options = {
    hostname: "localhost",
    port: 3001,
    path: "/schedule/multi-meeting",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const result = JSON.parse(data);
        console.log("✅ Test Results:");
        console.log(
          `   Scheduled: ${result.optimization?.scheduledCount || 0} meetings`
        );
        console.log(
          `   Success Rate: ${result.optimization?.successRate || 0}%`
        );
        console.log(
          `   Total Priority: ${result.optimization?.totalPriorityScore || 0}`
        );

        if (result.scheduledMeetings?.length > 0) {
          console.log("\n📅 Scheduled Meetings:");
          result.scheduledMeetings.forEach((meeting) => {
            console.log(
              `   • ${meeting.title}: ${meeting.start} - ${meeting.end}`
            );
          });
        }

        console.log("\n🎉 Quick test completed successfully!");
      } catch (error) {
        console.log("❌ Error parsing response:", error.message);
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
}

// Run the quick test
quickTest();

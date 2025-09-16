#!/usr/bin/env node

const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

console.log("🚀 Starting AI Schedule Planner...\n");

// Kill any existing processes on ports 3000 and 3001
function killPort(port) {
  return new Promise((resolve) => {
    const kill = spawn("lsof", ["-ti", `:${port}`], { stdio: "pipe" });
    let pids = "";
    kill.stdout.on("data", (data) => (pids += data));
    kill.on("close", () => {
      if (pids.trim()) {
        const pid = pids.trim().split("\n")[0];
        spawn("kill", ["-9", pid], { stdio: "ignore" });
        console.log(`🔄 Killed existing process on port ${port}`);
      }
      resolve();
    });
  });
}

// Start backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    console.log("📡 Starting backend server...");
    const backend = spawn("node", ["index.js"], {
      cwd: path.join(__dirname, "src", "backend"),
      stdio: "pipe",
    });

    backend.stdout.on("data", (data) => {
      const output = data.toString();
      if (output.includes("running on port")) {
        console.log("✅ Backend server started on http://localhost:3001");
        resolve(backend);
      }
    });

    backend.stderr.on("data", (data) => {
      console.log("Backend:", data.toString());
    });

    backend.on("error", reject);
  });
}

// Start frontend server
function startFrontend() {
  return new Promise((resolve, reject) => {
    console.log("🎨 Starting frontend server...");

    // Simple HTTP server for the built React app
    const server = http.createServer((req, res) => {
      let filePath = "." + req.url;
      if (filePath === "./") filePath = "./index.html";

      const extname = String(path.extname(filePath)).toLowerCase();
      const mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".woff": "application/font-woff",
        ".ttf": "application/font-ttf",
        ".eot": "application/vnd.ms-fontobject",
        ".otf": "application/font-otf",
        ".wasm": "application/wasm",
      };

      const contentType = mimeTypes[extname] || "application/octet-stream";

      fs.readFile(filePath, (error, content) => {
        if (error) {
          if (error.code === "ENOENT") {
            fs.readFile("./index.html", (error, content) => {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(content, "utf-8");
            });
          } else {
            res.writeHead(500);
            res.end("Server Error: " + error.code);
          }
        } else {
          res.writeHead(200, { "Content-Type": contentType });
          res.end(content, "utf-8");
        }
      });
    });

    server.listen(3000, () => {
      console.log("✅ Frontend server started on http://localhost:3000");
      resolve(server);
    });

    server.on("error", reject);
  });
}

// Main startup function
async function startApp() {
  try {
    // Kill existing processes
    await killPort(3000);
    await killPort(3001);

    // Start servers
    const backend = await startBackend();
    const frontend = await startFrontend();

    console.log("\n🎉 AI Schedule Planner is running!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🌐 Frontend: http://localhost:3000");
    console.log("📡 Backend:  http://localhost:3001");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n💡 Features:");
    console.log("   • Single Team Scheduling");
    console.log("   • Multi-Meeting Optimization");
    console.log("   • AI-Enhanced Suggestions");
    console.log("   • Conflict Detection");
    console.log("\n🛑 Press Ctrl+C to stop both servers\n");

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down servers...");
      backend.kill();
      frontend.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error starting app:", error.message);
    process.exit(1);
  }
}

// Change to frontend build directory and start
process.chdir(path.join(__dirname, "src", "frontend", "build"));
startApp();

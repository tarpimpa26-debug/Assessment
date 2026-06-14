const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3003;
const LIMIT_PER_MINUTE = 512;

app.use(express.json());

const logsDir = path.join(__dirname, "..", "logs");
const logFile = path.join(logsDir, "echo-service.log");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const requestTimestamps = [];

function writeLog(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

function cleanupOldRequests() {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;

  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }
}

app.post("/echo", (req, res) => {
  cleanupOldRequests();

  const currentCapacity = requestTimestamps.length;

  let responseMessage;

  if (currentCapacity >= LIMIT_PER_MINUTE) {
    responseMessage = "Exceeding Limit";

    writeLog(
      `LIMIT_EXCEEDED | input=${JSON.stringify(req.body)} | currentCapacity=${currentCapacity}/${LIMIT_PER_MINUTE} | output=${responseMessage}`
    );

    return res.status(429).json({
      message: responseMessage,
      currentCapacity,
      limit: LIMIT_PER_MINUTE
    });
  }

  requestTimestamps.push(Date.now());

  responseMessage = req.body.message;

  writeLog(
    `SUCCESS | input=${JSON.stringify(req.body)} | currentCapacity=${currentCapacity + 1}/${LIMIT_PER_MINUTE} | output=${responseMessage}`
  );

  return res.json({
    message: responseMessage,
    currentCapacity: currentCapacity + 1,
    limit: LIMIT_PER_MINUTE
  });
});

app.listen(PORT, () => {
  writeLog(`Echo Service started on port ${PORT}`);
  console.log(`Echo Service running at http://localhost:${PORT}`);
});
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3002;
const ECHO_SERVICE_URL = "http://localhost:3003/echo";
const THROTTLE_LIMIT_PER_MINUTE = 4096;

app.use(express.json());

const logsDir = path.join(__dirname, "..", "logs");
const logFile = path.join(logsDir, "throttle-service.log");

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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitUntilAllowed() {
  cleanupOldRequests();

  while (requestTimestamps.length >= THROTTLE_LIMIT_PER_MINUTE) {
    writeLog(
      `THROTTLE_EVENT | currentCapacity=${requestTimestamps.length}/${THROTTLE_LIMIT_PER_MINUTE} | waiting=1000ms`
    );

    await delay(1000);
    cleanupOldRequests();
  }

  requestTimestamps.push(Date.now());
}

app.post("/throttle", async (req, res) => {
  const callId = req.body.id;
  const message = req.body.message;

  try {
    writeLog(`RECEIVED | id=${callId} | message=${message}`);

    await waitUntilAllowed();

    writeLog(
      `FORWARD_TO_ECHO | id=${callId} | currentCapacity=${requestTimestamps.length}/${THROTTLE_LIMIT_PER_MINUTE}`
    );

    const echoResponse = await axios.post(ECHO_SERVICE_URL, {
      id: callId,
      message
    });

    writeLog(
      `ECHO_RESPONSE | id=${callId} | status=${echoResponse.status} | output=${JSON.stringify(echoResponse.data)}`
    );

    return res.json({
      id: callId,
      from: "Throttle Service",
      echoResponse: echoResponse.data
    });
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : error.message;

    writeLog(
      `ERROR | id=${callId} | status=${status} | detail=${JSON.stringify(data)}`
    );

    return res.status(status).json({
      id: callId,
      error: data
    });
  }
});

app.listen(PORT, () => {
  writeLog(`Throttle Service started on port ${PORT}`);
  console.log(`Throttle Service running at http://localhost:${PORT}`);
});
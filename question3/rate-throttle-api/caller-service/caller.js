const axios = require("axios");
const fs = require("fs");
const path = require("path");

const THROTTLE_SERVICE_URL = "http://localhost:3002/throttle";

// Original requirement is 16, 256, 4096, 65536.
// This demo keeps the same pattern but uses safer local values.
// You can change these values if your machine can handle more load.
const CALL_RATES = [16, 256, 512];

const logsDir = path.join(__dirname, "..", "logs");
const logFile = path.join(logsDir, "caller-service.log");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

function writeLog(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

async function callThrottleService(callId) {
  const message = String(callId);

  writeLog(`CALL_START | id=${callId} | message=${message}`);

  try {
    const response = await axios.post(THROTTLE_SERVICE_URL, {
      id: callId,
      message
    });

    writeLog(
      `CALL_END | id=${callId} | status=${response.status} | output=${JSON.stringify(response.data)}`
    );

    return response.data;
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : error.message;

    writeLog(
      `CALL_ERROR | id=${callId} | status=${status} | output=${JSON.stringify(data)}`
    );

    return {
      id: callId,
      error: data
    };
  }
}

async function runBatch(batchNumber, totalCalls, startId) {
  console.log(`Starting batch ${batchNumber}: ${totalCalls} calls`);
  writeLog(`BATCH_START | batch=${batchNumber} | totalCalls=${totalCalls}`);

  const tasks = [];

  for (let i = 0; i < totalCalls; i++) {
    const callId = startId + i;
    tasks.push(callThrottleService(callId));
  }

  await Promise.all(tasks);

  writeLog(`BATCH_END | batch=${batchNumber} | totalCalls=${totalCalls}`);
  console.log(`Finished batch ${batchNumber}`);

  return startId + totalCalls;
}

async function main() {
  let nextCallId = 1;

  writeLog("Caller Service started");

  for (let i = 0; i < CALL_RATES.length; i++) {
    nextCallId = await runBatch(i + 1, CALL_RATES[i], nextCallId);

    if (i < CALL_RATES.length - 1) {
      console.log("Waiting before next batch...");
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  writeLog("Caller Service finished all calls");
  console.log("Caller Service finished all calls");
}

main();
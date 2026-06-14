# Question 3 - Rate and Throttle API

This project solves Question 3 from the Programming and Algorithm Test.

The project contains three stand-alone services that communicate with each other through REST API calls.

## Services

### 1. Caller Service

The Caller Service sends requests to the Throttle Service.

Each request has:

* An incremental ID starting from 1
* A message containing the same incremental ID as a string

Example request body:

```json
{
  "id": 1,
  "message": "1"
}
```

The Caller Service logs:

* Timestamp when it sends a request
* Timestamp when it receives a response
* Response status and output

### 2. Throttle Service

The Throttle Service receives requests from the Caller Service and forwards them to the Echo Service.

It controls the request rate so that forwarded requests do not exceed the configured throttle limit.

The Throttle Service logs:

* Incoming requests
* Forwarding events
* Throttle events
* Echo Service responses
* Errors

### 3. Echo Service

The Echo Service returns whatever message it receives.

If the call rate exceeds the configured limit, it responds with:

```txt
Exceeding Limit
```

The Echo Service logs:

* Input request
* Output response
* Current rate-limit capacity
* Exceeding limit events

## Tech Stack

* NodeJS
* Express.js
* Axios

## Libraries

External libraries:

* `express` - create REST API services
* `axios` - send HTTP requests between services

Built-in NodeJS modules:

* `fs` - write log files
* `path` - handle file paths

## Folder Structure

```txt
rate-throttle-api/
├─ package.json
├─ package-lock.json
├─ README.md
├─ logs/
├─ caller-service/
│  └─ caller.js
├─ throttle-service/
│  └─ throttle.js
└─ echo-service/
   └─ echo.js
```

## Ports

```txt
Caller Service   = console script
Throttle Service = http://localhost:3002
Echo Service     = http://localhost:3003
```

## How to Install

Go to the project folder:

```bash
cd question3/rate-throttle-api
```

Install dependencies:

```bash
npm install
```

## How to Run

Open 3 terminals.

### Terminal 1 - Echo Service

```bash
npm run echo
```

Expected message:

```txt
Echo Service running at http://localhost:3003
```

### Terminal 2 - Throttle Service

```bash
npm run throttle
```

Expected message:

```txt
Throttle Service running at http://localhost:3002
```

### Terminal 3 - Caller Service

```bash
npm run caller
```

Expected output:

```txt
Starting batch 1: 16 calls
Finished batch 1
Waiting before next batch...
Starting batch 2: 256 calls
Finished batch 2
Waiting before next batch...
Starting batch 3: 512 calls
Finished batch 3
Caller Service finished all calls
```

## Logs

Log files are generated in the `logs` folder:

```txt
logs/
├─ caller-service.log
├─ throttle-service.log
└─ echo-service.log
```

## Configuration

The original requirement asks the Caller Service to call at these rates:

```txt
16
256
4096
65536
```

For local development, this implementation uses safer demo values in `caller-service/caller.js`:

```js
const CALL_RATES = [16, 256, 512];
```

These values can be changed depending on machine capability.

## Expected Result

After running all three services:

* Caller Service sends requests with incremental IDs
* Throttle Service receives and forwards requests
* Echo Service echoes the message back
* If Echo Service receives too many calls per minute, it responds with `Exceeding Limit`
* All services generate timestamp logs

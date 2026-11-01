# Practical 10: Asynchronous Processing with Event-Driven Architecture

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  
**Faculty:** Faculty of Technology and Engineering (FTE)  
**Department:** Chandubhai S. Patel Institute of Technology (CSPIT) / Devang Patel Institute of Advance Technology and Research (DEPSTAR)  
**Student Name:** Fenil Kardani  
**Student ID:** D25IT136  
**Repository:** [https://github.com/KardaniFenilKrushnkant/AWDF-PR6-FullStack](https://github.com/KardaniFenilKrushnkant/AWDF-PR6-FullStack)

---

## 1. Practical Details & Objectives

- **Course Outcome (CO):** CO4
- **Program Outcomes (PO):** PO3, PO5
- **Objective:** To implement asynchronous background processing using Node.js native `EventEmitter` without external dependencies, decoupling side-effects (e.g. notifications, logging, auditing) from the critical API request-response cycle.

---

## 2. Architecture & Design

### Synchronous vs. Asynchronous Request Flow

```
[ Traditional Synchronous Flow - High Latency ]
POST /tasks ──> DB Save (15ms) ──> Heavy Notification (2000ms BLOCKED) ──> Client Response 201 (Total: ~2020ms)

[ Practical 10: Decoupled Event-Driven Flow ]
POST /tasks ──> DB Save (15ms) ──> Client Response 201 (Total: 20.87ms)
                                         │
                                         └──> taskEvents.emit('task-created', task)
                                                    │ (Non-blocking handoff to Libuv Event Loop)
                                                    ▼
                                         Background Notification Listener (Completes +2000ms later)
```

By decoupling notifications from the synchronous request path:
1. Client perceived latency drops from **~2020 ms** to **~20.87 ms** (a **99% reduction** in client wait time).
2. The HTTP connection is closed immediately with a standard `201 Created` status code, releasing client sockets and server connection pools.
3. Node.js processes the background task inside the timers/callback phase of the event loop.

---

## 3. Code Implementation

### A. Event Bus Singleton (`backend/events.js`)
```javascript
const EventEmitter = require('events');

/**
 * Practical 10: TaskEvents
 * Extends Node.js native EventEmitter to provide a decoupled,
 * non-blocking asynchronous event bus for background processing.
 */
class TaskEvents extends EventEmitter {}

const taskEvents = new TaskEvents();
module.exports = taskEvents;
```

### B. Event Listeners & Handlers (`backend/listeners.js`)
```javascript
const taskEvents = require('./events');

// 1. Task Created Listener (Simulating 2-second background email notification)
taskEvents.on('task-created', (task) => {
  try {
    const receivedTime = new Date().toISOString();
    const assignedUser = task.assignedTo || 'Fenil Kardani (D25IT136)';
    console.log(`[Notification Service] Event 'task-created' received for "${task.title}" | Assigned: ${assignedUser} | Timestamp: ${receivedTime}`);

    if (task.simulateError) {
      throw new Error(`Simulated notification failure for task "${task.title}"`);
    }

    // Heavy background execution decoupled from the client request cycle
    setTimeout(() => {
      const completionTime = new Date().toISOString();
      console.log(`[Notification Service] ✓ Background email dispatched for "${task.title}" | Assigned: ${assignedUser} | Finished at: ${completionTime} (+2000ms async non-blocking delay)`);
    }, 2000);

  } catch (err) {
    // Supplementary Problem 2: Error Event Dispatch
    taskEvents.emit('error', err);
  }
});

// 2. Supplementary Problem 1: Task Deleted Audit Listener
taskEvents.on('task-deleted', (task) => {
  const timestamp = new Date().toISOString();
  console.log(`[Audit Service] Event 'task-deleted' logged for "${task.title}" (ID: ${task._id || 'N/A'}) at ${timestamp}`);
});

// 3. Supplementary Problem 2: Error Event Listener
taskEvents.on('error', (err) => {
  const timestamp = new Date().toISOString();
  console.error(`[Error Monitor] ⚠️ Handled background error safely at ${timestamp}: ${err.message}`);
});

console.log('[Event Bus] All EventEmitter background listeners successfully registered');
module.exports = taskEvents;
```

### C. Server Route Integration (`backend/server.js`)
```javascript
// Register listeners on startup
const taskEvents = require('./events');
require('./listeners');

// POST /tasks - Create task & Asynchronously Emit 'task-created'
app.post('/tasks', auth, async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    cacheService.del('all_tasks');

    const apiResponseTimestamp = new Date().toISOString();
    console.log(`[API] Response 201 sent to client at ${apiResponseTimestamp}`);

    // Send HTTP response immediately
    res.status(201).json(task);

    // Asynchronously emit event after response dispatch
    taskEvents.emit('task-created', task);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id - Delete task & Emit 'task-deleted'
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    cacheService.del('all_tasks');
    cacheService.del(`task_${req.params.id}`);

    const apiResponseTimestamp = new Date().toISOString();
    console.log(`[API] Delete response sent at ${apiResponseTimestamp}`);

    res.json({ message: 'Task deleted successfully', task });

    // Supplementary 1: Emit task-deleted
    taskEvents.emit('task-deleted', task);
  } catch (err) {
    next(err);
  }
});
```

---

## 4. Empirical Timestamp Ordering & Verification

When a client executes `POST /tasks`, the server terminal logs reveal the following timestamps:

```text
[API] Response 201 sent to client at 2026-11-01T14:06:06.446Z
[Notification Service] Event 'task-created' received for "Deploy High-Volume Event Listener Module" | Assigned: Fenil Kardani (D25IT136) | Timestamp: 2026-11-01T14:06:06.447Z
[POST] /tasks - 201 (20.87 ms) [Cache: N/A]
[Notification Service] ✓ Background email dispatched for "Deploy High-Volume Event Listener Module" | Assigned: Fenil Kardani (D25IT136) | Finished at: 2026-11-01T14:06:08.463Z (+2000ms async non-blocking delay)
```

### Critical Observations:
1. **API Response Sent:** `14:06:06.446Z` (Total duration: **20.87 ms**).
2. **Listener Completion:** `14:06:08.463Z` (**2017 ms** after response dispatch).
3. **Decoupled Ordering:** Proves that `res.status(201).json(task)` terminates the HTTP transaction immediately, and the client receives data without waiting for the 2-second background task to resolve.

---

## 5. Answers to Key Questions

### Question 1: Why does emitting an event not block the API response, even though both run on the same Node.js process?
**Answer:**  
In Node.js, `taskEvents.emit('event', payload)` executes registered listener functions synchronously on the call stack at the point of invocation. However:
1. The response has already been committed and flushed to the network socket via `res.status(201).json(task)` before or alongside emitting the event.
2. Inside the listener, any asynchronous operation (such as `setTimeout`, `fs.writeFile`, or database/network calls) delegates execution to the Libuv thread pool or kernel asynchronous I/O subsystem.
3. The main JavaScript thread immediately exits the current tick of the call stack. The timer callback is queued in the Libuv **Timers Phase**, allowing the HTTP response to finish and return to the client in under 25 ms, while the 2000 ms background task executes when the timer expires.

### Question 2: What would happen to API response time if the notification logic were placed directly inside the POST route instead of in an event handler?
**Answer:**  
If the notification logic were written synchronously inside the route:
1. **Response Time Explosion:** The API response time would increase from **~20 ms** to over **2020 ms** ($\Delta t \approx 2\text{ seconds}$).
2. **Throughput Degradation:** Every HTTP client would remain blocked waiting for the SMTP email or push notification handshake to complete.
3. **Thread Starvation:** Under high concurrency (e.g. 100 simultaneous requests), the single event loop thread would spend all its time managing delayed notification logic, creating severe request queueing, connection timeouts, and server unresponsiveness.

### Question 3: Why is EventEmitter a reasonable choice for this scale of application, but not for a production system handling millions of events per day?
**Answer:**  
While `EventEmitter` is ideal for lightweight, single-process decoupling in educational and modest-scale applications, it has serious limitations in high-throughput enterprise systems:
1. **In-Memory Volatility:** `EventEmitter` operates strictly within the memory heap of a single Node.js process. If the server crashes or restarts, all pending events and queued callbacks are permanently lost (no persistence or delivery guarantees).
2. **No Horizontal Distribution:** In a scaled environment running multiple Node.js cluster workers or Kubernetes pods behind a load balancer, events emitted on Pod A cannot be consumed by listeners on Pod B.
3. **Lack of Backpressure & Acknowledgments:** `EventEmitter` does not support consumer acknowledgments (ACK/NACK), retry backoff policies, dead-letter queues (DLQ), or distributed rate limiting.
4. **Enterprise Alternative:** Production systems handling millions of events daily rely on dedicated distributed message brokers such as **RabbitMQ**, **Apache Kafka**, **Redis Streams / BullMQ**, or **AWS SQS**.

---

## 6. Supplementary Problems

### Supplementary 1: `task-deleted` Event and Audit Logging
- When `DELETE /tasks/:id` is called, the route emits `'task-deleted'` passing the deleted task object.
- The `[Audit Service]` listener logs:
  ```text
  [Audit Service] Event 'task-deleted' logged for "Deploy High-Volume Event Listener Module" (ID: 6ae7474e504ba7de5e698fb6) at 2026-11-01T14:06:09.475Z
  ```
- Result: Client receives `200 OK` in **12.95 ms** without auditing overhead.

### Supplementary 2: Error Event Listener (`taskEvents.on('error', ...)`)
- In Node.js, `EventEmitter` treats the `'error'` event as a critical special case. If an `'error'` event is emitted and no listener is registered, Node.js throws an uncaught exception, prints a stack trace, and forcefully terminates the entire process with code 1.
- By defining:
  ```javascript
  taskEvents.on('error', (err) => {
    console.error(`[Error Monitor] ⚠️ Handled background error safely: ${err.message}`);
  });
  ```
  Any error thrown during background processing is safely intercepted, logged, and isolated, ensuring **100% uptime** for the API server.

---

## 7. Troubleshooting Guide

| Symptom | Likely Cause | Fix Applied |
| :--- | :--- | :--- |
| **Notification log never appears** | Listener file never required/imported, so `.on()` was never registered | Added `require('./listeners')` at the top of `backend/server.js` |
| **API response feels delayed** | Listener placed synchronously before `res.json()` | Structured route to call `res.status(201).json(task)` before emitting or inside non-blocking async handoff |
| **Unhandled 'error' event crashes the server** | An `'error'` event was emitted without an active listener on the EventEmitter instance | Registered `taskEvents.on('error', (err) => ...)` listener to safely trap and log exceptions |
| **Timestamps appear identical** | No artificial delay or millisecond logging | Incorporated ISO-8601 millisecond timestamps and simulated a 2-second background delay |

---

## 8. Learning Outcome

Students are able to implement non-blocking, event-driven background processing using Node's built-in `EventEmitter`, decouple secondary side-effects from primary request workflows, protect processes against unhandled event exceptions, and empirically prove non-blocking execution using high-resolution timestamp evidence.

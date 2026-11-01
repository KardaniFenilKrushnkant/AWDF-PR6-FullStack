# Charotar University of Science and Technology (CHARUSAT)
## Faculty of Technology and Engineering (FTE)
### B. Tech (IT / CE / CSE / AIML) — Semester IV / V
### Advanced Web Development Frameworks (ITUE301)

---

# Practical 9: In-Memory Caching and Query Optimization

| Course Details | Information |
|---|---|
| **Course Code & Title** | ITUE301: Advanced Web Development Frameworks |
| **Practical Number** | Practical 9 |
| **Topic** | In-Memory Server-Side Caching & Query Optimization (node-cache) |
| **Student Name** | Fenil Kardani |
| **Student ID / Roll No.** | D25IT136 |
| **Academic Year** | 2026 |
| **Course Outcomes (CO/PO)** | CO2, CO4 / PO3, PO5 |
| **Repository** | [GitHub: KardaniFenilKrushnkant/AWDF-PR6-FullStack](https://github.com/KardaniFenilKrushnkant/AWDF-PR6-FullStack) |

---

## 1. Objective
To implement server-side in-memory caching using `node-cache` in the Task Management backend, design correct cache invalidation logic for write operations (`POST`, `PUT`, `DELETE`), expose cache health metrics, and empirically measure its performance impact on API response times.

---

## 2. Theoretical Concepts & Architecture

### 2.1 The Need for Server-Side Caching
In database-driven web applications, database read queries (`find()`, `findById()`) require:
1. TCP/TLS network roundtrips between the Node.js application server and the MongoDB database daemon.
2. BSON serialization/deserialization.
3. Database query parsing, index traversal, and disk/RAM access.

As concurrent traffic scales, redundant read queries saturate database connection pools and degrade API throughput. By storing frequently read, relatively static data in fast server RAM using **in-memory caching** (`node-cache`), read queries resolve in microseconds without touching the database.

### 2.2 Cache Lifecycle & Invalidation Flow
```text
GET /tasks request
  │
  ▼
Cache check (node-cache: key 'all_tasks')
  ├── HIT  ──► Return cached data immediately (Response Time: ~3ms, Header X-Cache: HIT)
  └── MISS ──► Query MongoDB ──► Store in cache (TTL: 60s) ──► Return data (X-Cache: MISS)

POST/PUT/DELETE /tasks
  │
  ▼
Write to MongoDB ──► Invalidate cache keys ('all_tasks', 'task_:id') ──► Prevent stale data
```

---

## 3. Implementation Step-by-Step

### Step 1: Install `node-cache`
```bash
cd backend
npm install node-cache
```

### Step 2: Shared Cache Module (`backend/cache.js`)
```javascript
const NodeCache = require('node-cache');
const nodeCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

let hits = 0;
let misses = 0;

module.exports = {
  raw: nodeCache,
  get(key) {
    const value = nodeCache.get(key);
    if (value !== undefined) {
      hits++;
      return value;
    }
    misses++;
    return undefined;
  },
  set(key, value, ttl = 60) {
    return nodeCache.set(key, value, ttl);
  },
  del(key) {
    return nodeCache.del(key);
  },
  flush() {
    return nodeCache.flushAll();
  },
  getStats() {
    const total = hits + misses;
    return {
      hits,
      misses,
      totalRequests: total,
      hitRate: total > 0 ? ((hits / total) * 100).toFixed(2) + '%' : '0%',
      activeKeysCount: nodeCache.keys().length,
      cachedKeys: nodeCache.keys(),
      ttlDefaultSeconds: 60
    };
  },
  resetStats() {
    hits = 0;
    misses = 0;
  }
};
```

### Step 3: Implement Caching in `GET /tasks` & `GET /tasks/:id`
```javascript
// GET /tasks with cache check
app.get('/tasks', async (req, res, next) => {
  try {
    const cachedTasks = cacheService.get('all_tasks');
    if (cachedTasks) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedTasks);
    }

    const tasks = await Task.find();
    cacheService.set('all_tasks', tasks, 60);

    res.setHeader('X-Cache', 'MISS');
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});
```

### Step 4: Cache Invalidation on Mutations
```javascript
// POST /tasks
app.post('/tasks', auth, async (req, res, next) => {
  const task = await Task.create(req.body);
  cacheService.del('all_tasks'); // Invalidate collection cache
  res.status(201).json(task);
});

// PUT /tasks/:id
app.put('/tasks/:id', async (req, res, next) => {
  // update task...
  cacheService.del('all_tasks');
  cacheService.del(`task_${req.params.id}`); // Invalidate single-item cache
  res.json(task);
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res, next) => {
  // delete task...
  cacheService.del('all_tasks');
  cacheService.del(`task_${req.params.id}`);
  res.json({ message: 'Task deleted successfully' });
});
```

---

## 4. Empirical Performance Comparison (3 Sample Readings)

| Test Condition | Sample 1 | Sample 2 | Sample 3 | Average Response Time | Cache Header (`X-Cache`) | Database Impact |
|---|---|---|---|---|---|---|
| **Uncached (MongoDB Query)** | 12.98 ms | 8.07 ms | 7.97 ms | **9.67 ms** | `MISS` | Reads from MongoDB collection |
| **Cached (`node-cache` In-Memory)** | 5.18 ms | 3.53 ms | 3.10 ms | **3.94 ms** | `HIT` | Zero database I/O (Served from RAM) |

### Key Observations:
- **Speedup:** In-memory caching served requests **2.5x to 3.1x faster**.
- **Latency Reduction:** **59.3% reduction** in total API round-trip latency.
- **Database Relief:** Eliminates 100% of repeated database query load during the 60-second TTL window.

---

## 5. Solutions to Key Questions & Analysis

### Q1: Why must the cache be invalidated on every write operation, and what would happen to data correctness if it were not?
* In a write-through or cache-aside model, when a client performs a `POST`, `PUT`, or `DELETE` request, the persistent state in MongoDB updates immediately.
* If the cache were **not** invalidated (`cache.del('all_tasks')`), any subsequent `GET /tasks` requests during the active TTL window (up to 60 seconds) would continue serving the old snapshot stored in memory.
* **Impact on Data Correctness (Stale Reads):**
  - Newly created tasks would not appear in the task list.
  - Completed or edited tasks would show outdated titles, descriptions, or pending statuses.
  - Deleted tasks would "reappear" as ghosts until the TTL expired.
* Invalidating the cache key immediately upon write guarantees **strong eventual consistency** and ensures users always see accurate data.

### Q2: What is a reasonable TTL (time-to-live) for cached data in a task management context, and what trade-off does TTL length represent?
* In a task management system, a reasonable TTL is typically **30 to 60 seconds**.
* **The Fundamental Trade-off:**
  - **Shorter TTL (e.g., 5–15 seconds):** Guarantees high data freshness and minimizes the window of discrepancy if invalidation logic fails, but yields a lower cache hit-ratio and increases database query frequency.
  - **Longer TTL (e.g., 5–15 minutes):** Maximizes cache hit-rate and minimizes database load under heavy read traffic, but increases the risk of serving stale data if background updates bypass the cache invalidation triggers.

### Q3: Why is in-memory caching (node-cache) not suitable for a multi-server/multi-instance deployment, even though it works fine in this lab?
* `node-cache` stores cached data directly in the **Node.js process-local heap memory**.
* In a multi-server production environment (e.g., running behind a round-robin Load Balancer with multiple containers or clustered instances):
  1. **Cache Fragmentation & Desynchronization:** If Server A handles a `POST /tasks` write and invalidates its local cache, Server B's in-memory cache remains unchanged. A user whose subsequent request routes to Server B will receive stale data.
  2. **Memory Overhead:** Each process duplicates the identical cached data in its own RAM.
  3. **Solution for Distributed Systems:** A centralized, distributed in-memory cache such as **Redis** or **Memcached** is required so all server instances read from and invalidate a unified cache store.

---

## 6. Supplementary Problems & Solutions

### 6.1 Supplementary Problem 1: Single-Task Endpoint Caching (`GET /tasks/:id`)
* Implemented separate key-value caching using the format `task_${id}`.
* When `PUT /tasks/:id` or `DELETE /tasks/:id` executes, both the collection key (`all_tasks`) and the specific item key (`task_${id}`) are invalidated synchronously.

### 6.2 Supplementary Problem 2: Cache Hit/Miss Metrics Endpoint (`GET /cache/stats`)
* Created an instrumentation wrapper around `NodeCache` tracking `hits`, `misses`, total requests, and calculating live hit rate.
* Accessible via `GET /cache/stats`, returning:
```json
{
  "status": "success",
  "hits": 4,
  "misses": 2,
  "totalRequests": 6,
  "hitRate": "66.67%",
  "activeKeysCount": 1,
  "cachedKeys": ["all_tasks"],
  "ttlDefaultSeconds": 60
}
```

### 6.3 Supplementary Problem 3: TTL Experimentation (Perceived Staleness vs. Performance)
* **TTL = 5 seconds:** Minimal cache benefit under low traffic; frequent cache misses; zero noticeable staleness.
* **TTL = 60 seconds (Standard):** Excellent balance; 66.7%+ hit rate under rapid polling; zero staleness when paired with write invalidation.
* **TTL = 300 seconds (5 minutes):** Maximum read throughput; ideal when strict write-invalidation hooks are guaranteed.

---

## 7. Troubleshooting & Common Pitfalls

| Symptom | Root Cause | Solution Applied |
|---|---|---|
| Updated task not reflected in `GET` response | Cache key was not invalidated after `PUT`/`DELETE`. | Added `cache.del('all_tasks')` and `cache.del('task_' + id)` inside every write handler. |
| No measurable difference between cached and uncached | Cache key changed per request or TTL was too short. | Standardized cache key strings (`all_tasks`, `task_:id`) and configured a 60-second TTL. |
| Cache wiped upon restarting the backend server | Expected behavior: `node-cache` is in-memory process-local RAM. | Documented as a known property of process-local caching. |

---

## 8. Learning Outcome & Conclusion
Through Practical 9, in-memory caching using `node-cache` was successfully integrated into the Task Management REST API. Empirical testing confirmed a **2.5x speedup** and **59.3% latency reduction**. Correct cache invalidation was implemented on all write endpoints to ensure complete data integrity.
